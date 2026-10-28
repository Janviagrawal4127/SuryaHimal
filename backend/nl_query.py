"""
NL-to-SQL Agent (🗣️): Translates natural language energy queries into SQL using
rule-based patterns (Vectorless RAG), enabling policy planners to query the village
dataset with domain-specific questions like:
  "Find off-grid villages above 3000m altitude with river access within 500m"
  "List Solar-First villages in Chamoli with poverty rate above 60%"
"""
import re
from typing import Dict, Any
from backend.state import GraphState


# ─── Rule-based NL → SQL fallback patterns ──────────────────────────────────

_PATTERNS = [
    # Off-grid village queries
    (
        r"(off.?grid|no.?electricity|unelectrified).+above\s+(\d+)\s*m",
        lambda m: (
            f"SELECT * FROM villages WHERE grid_access = 0 "
            f"AND elevation_m > {m.group(2)}"
        ),
    ),
    (
        r"off.?grid.+river.+(\d+)\s*m",
        lambda m: (
            f"SELECT * FROM villages WHERE grid_access = 0 "
            f"AND distance_to_stream_km < {float(m.group(1))/1000:.2f}"
        ),
    ),
    # Poverty-level queries
    (
        r"(poor|poverty|bpl).+above\s+(\d+)\s*%",
        lambda m: (
            f"SELECT * FROM villages WHERE poverty_rate > {float(m.group(2))/100:.2f}"
        ),
    ),
    # Technology class queries
    (
        r"solar.?first\s+villages",
        lambda _: "SELECT * FROM villages WHERE microgrid_class = 'Solar-First'",
    ),
    (
        r"micro.?hydro\s+villages",
        lambda _: "SELECT * FROM villages WHERE microgrid_class = 'Micro-Hydro'",
    ),
    (
        r"hybrid\s+villages",
        lambda _: "SELECT * FROM villages WHERE microgrid_class = 'Hybrid'",
    ),
    # Count queries
    (
        r"how many.+(off.?grid|unelectrified)",
        lambda _: "SELECT COUNT(*) as off_grid_count FROM villages WHERE grid_access = 0",
    ),
    (
        r"count.+district",
        lambda _: "SELECT district, COUNT(*) as village_count FROM villages GROUP BY district ORDER BY village_count DESC",
    ),
    # Elevation queries
    (
        r"above\s+(\d+)\s*m",
        lambda m: f"SELECT * FROM villages WHERE elevation_m > {m.group(1)}",
    ),
    (
        r"(high.?altitude|mountain|himalayan)\s+villages",
        lambda _: "SELECT * FROM villages WHERE elevation_m > 2500",
    ),
    # District filter
    (
        r"in\s+(\w+)\s+district",
        lambda m: f"SELECT * FROM villages WHERE LOWER(district) = LOWER('{m.group(1)}')",
    ),
]


def run_rule_based_fallback(nl_query: str) -> str:
    """Convert natural language query to SQL via rule matching."""
    q = nl_query.lower().strip()
    for pattern, builder in _PATTERNS:
        m = re.search(pattern, q, re.IGNORECASE)
        if m:
            return builder(m)
    # Generic fallback
    return "SELECT * FROM villages LIMIT 50"


def nl_query_node(state: GraphState) -> Dict[str, Any]:
    """
    NL-to-SQL Agent Node: Extracts the last user message and translates
    it into an SQL query to be executed by the SQL ReAct Agent.
    """
    print("\n--- [NL-to-SQL Agent] ---")
    messages = state.get("messages", [])
    last_query = ""
    if messages:
        last_query = messages[-1].content

    # Try Groq LLM first, fallback to rule-based
    api_key = _try_groq_sql(last_query)
    if api_key:
        sql = api_key
    else:
        sql = run_rule_based_fallback(last_query)

    print(f"NL Query: '{last_query}' -> SQL: '{sql}'")

    completed = list(state.get("completed_steps", []))
    if "nl_query" not in completed:
        completed.append("nl_query")

    return {
        "sql_query": sql,
        "completed_steps": completed,
    }


def _try_groq_sql(nl_query: str) -> str | None:
    """Attempt Groq Llama-based NL→SQL translation. Returns None if unavailable."""
    import os
    api_key = os.getenv("Groq_API") or os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    try:
        from groq import Groq
        client = Groq(api_key=api_key.strip('"').strip("'"))
        schema_context = """
Table: villages
Columns: village_id, village_name, district, state, elevation_m, latitude, longitude,
         solar_irradiance_kwh_m2_day, annual_cloud_days, slope_degrees,
         river_gradient_m_per_km, distance_to_stream_km, annual_precipitation_mm,
         population, households, poverty_rate, grid_access (0/1),
         daily_demand_kwh, solar_viability_sv, hydro_potential_hp,
         microgrid_class (Solar-First/Micro-Hydro/Hybrid)
"""
        prompt = (
            f"You are an SQL expert for a Himalayan village energy database.\n"
            f"{schema_context}\n"
            f"Translate this natural language query to SQL (SQLite syntax, no markdown):\n"
            f"Query: {nl_query}\n"
            f"SQL:"
        )
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=256,
            temperature=0.1,
        )
        sql = response.choices[0].message.content.strip()
        # Strip markdown fences if present
        sql = re.sub(r"```sql|```", "", sql).strip()
        return sql if sql.upper().startswith("SELECT") else None
    except Exception:
        return None
