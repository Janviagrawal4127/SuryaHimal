"""
SQL ReAct Agent (⚡): Executes generated SQL queries against the in-memory
village SQLite database with self-healing error correction (ReAct loop).
"""
import os
import re
import json
import sqlite3
import pandas as pd
from typing import Dict, Any
from backend.state import GraphState


def execute_query_safely(sql: str, dataset_path: str, max_retries: int = 3) -> Dict[str, Any]:
    """
    Execute a SQL query against a SQLite in-memory table loaded from the village CSV.
    Self-heals syntax errors for up to max_retries attempts.
    """
    if not os.path.exists(dataset_path):
        return {"error": f"Dataset not found: {dataset_path}", "rows": [], "columns": []}

    try:
        df = pd.read_csv(dataset_path)
    except Exception as e:
        return {"error": f"Failed to load dataset: {e}", "rows": [], "columns": []}

    conn = sqlite3.connect(":memory:")
    df.to_sql("villages", conn, if_exists="replace", index=False)

    last_error = None
    current_sql = sql

    for attempt in range(max_retries):
        try:
            result_df = pd.read_sql_query(current_sql, conn)
            conn.close()
            return {
                "sql": current_sql,
                "rows": result_df.head(100).to_dict(orient="records"),
                "columns": list(result_df.columns),
                "row_count": len(result_df),
                "attempts": attempt + 1,
            }
        except Exception as e:
            last_error = str(e)
            print(f"  SQL attempt {attempt+1} failed: {e}")
            # Self-healing: fix common column name mismatches
            current_sql = _auto_heal(current_sql, df, str(e))

    conn.close()
    return {
        "error": f"SQL execution failed after {max_retries} attempts: {last_error}",
        "sql": current_sql,
        "rows": [],
        "columns": [],
    }


def _auto_heal(sql: str, df: pd.DataFrame, error: str) -> str:
    """Simple ReAct self-healing: replace unrecognised column names."""
    columns = list(df.columns)
    # Extract unrecognised column from error message
    match = re.search(r"no such column: (\w+)", error, re.IGNORECASE)
    if match:
        bad_col = match.group(1)
        # Find closest column
        for col in columns:
            if bad_col.lower() in col.lower() or col.lower() in bad_col.lower():
                print(f"  Healing: replacing '{bad_col}' -> '{col}'")
                sql = sql.replace(bad_col, col)
                break
    return sql


def sql_agent_node(state: GraphState) -> Dict[str, Any]:
    """
    SQL ReAct Agent Node: Executes the SQL query stored in state
    and saves results to disk.
    """
    print("\n--- [SQL ReAct Agent] ---")
    sql = state.get("sql_query")
    if not sql:
        print("No SQL query in state.")
        completed = list(state.get("completed_steps", []))
        if "sql_agent" not in completed:
            completed.append("sql_agent")
        return {"completed_steps": completed}

    dataset_path = state.get("cleaned_dataset_path") or state.get("active_dataset_path") or "data/cleaned_villages.csv"
    print(f"Executing: {sql}")
    print(f"On dataset: {dataset_path}")

    result = execute_query_safely(sql, dataset_path)

    # Save result to disk
    os.makedirs("data", exist_ok=True)
    sql_result_path = "data/sql_result.json"
    with open(sql_result_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, default=str)
    print(f"SQL result saved -> {sql_result_path} ({result.get('row_count', 0)} rows)")

    completed = list(state.get("completed_steps", []))
    if "sql_agent" not in completed:
        completed.append("sql_agent")

    return {
        "sql_result_path": sql_result_path,
        "completed_steps": completed,
    }
