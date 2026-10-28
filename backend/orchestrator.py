import re
from typing import Dict, Any, List
from langchain_core.messages import AIMessage
from backend.state import GraphState


def orchestrator_node(state: GraphState) -> Dict[str, Any]:
    """
    Master Orchestrator Agent (🧠): Parses user queries, schedules agent execution loops,
    and synchronises the shared GraphState memory for the SuryaHimal energy pipeline.

    Supported planning keywords are all domain-specific to Himalayan microgrid analysis:
    villages, solar, hydro, hybrid, elevation, insolation, forecast, classify, SDG, report, etc.
    """
    print("\n--- [SuryaHimal Master Orchestrator] ---")

    messages = state.get("messages", [])
    plan_list = state.get("plan_list", [])
    completed_steps = state.get("completed_steps", [])

    if not plan_list:
        print("Plan list is empty. Analysing request to construct energy pipeline plan...")
        user_query = ""
        if messages:
            user_query = messages[-1].content.lower()

        plan = []

        # Ingest village dataset
        if any(w in user_query for w in ["ingest", "load", "import", "read", "village", "csv", "dataset", "file", "upload"]):
            plan.append("ingest")

        # Harmonize / clean sensor data
        if any(w in user_query for w in ["clean", "null", "missing", "harmonize", "impute", "quality", "outlier", "spike"]):
            if "ingest" not in plan:
                plan.append("ingest")
            plan.append("clean")

        # Preprocess features
        if any(w in user_query for w in ["preprocess", "scale", "encode", "normalize", "elevation", "prepare", "feature"]):
            if "ingest" not in plan:
                plan.append("ingest")
            if "clean" not in plan:
                plan.append("clean")
            plan.append("preprocessing")

        # NL → SQL energy queries
        if any(w in user_query for w in ["sql", "query", "find", "select", "above", "3000m", "river", "off-grid", "how many"]):
            if "ingest" not in plan:
                plan.append("ingest")
            plan.append("nl_query")
            plan.append("sql_agent")

        # EDA: elevation-insolation correlation, poverty maps
        if any(w in user_query for w in ["eda", "stats", "correlation", "distribution", "elevation", "insolation", "cloud", "poverty"]):
            if "ingest" not in plan:
                plan.append("ingest")
            if "clean" not in plan:
                plan.append("clean")
            plan.append("eda")

        # Forecasting: OLS demand + multinomial classifier
        if any(w in user_query for w in ["forecast", "predict", "classify", "solar", "hydro", "hybrid", "ml", "model", "2030", "load", "regression"]):
            if "ingest" not in plan:
                plan.append("ingest")
            if "clean" not in plan:
                plan.append("clean")
            if "preprocessing" not in plan:
                plan.append("preprocessing")
            plan.append("predictive")

        # Energy insights: deserts, quick-wins
        if any(w in user_query for w in ["insight", "desert", "quick-win", "corridor", "opportunity", "risk", "poverty"]):
            if "ingest" not in plan:
                plan.append("ingest")
            if "eda" not in plan:
                plan.append("eda")
            plan.append("insight")

        # CapEx recommendations
        if any(w in user_query for w in ["recommend", "capex", "budget", "lakh", "crore", "phase", "priority", "rollout", "household"]):
            if "ingest" not in plan:
                plan.append("ingest")
            if "insight" not in plan:
                plan.append("insight")
            plan.append("recommendation")

        # SDG Policy Report
        if any(w in user_query for w in ["report", "sdg", "policy", "pdf", "html", "brief", "compile", "summary", "executive"]):
            if "insight" not in plan:
                plan.append("insight")
            if "recommendation" not in plan:
                plan.append("recommendation")
            plan.append("report")

        # Full pipeline default
        if not plan:
            print("No specific commands detected. Scheduling full end-to-end SuryaHimal pipeline.")
            plan = ["ingest", "clean", "preprocessing", "eda", "predictive", "insight", "recommendation", "report"]

        plan_list = plan
        print(f"SuryaHimal execution plan: {plan_list}")

    # Determine next agent
    next_agent = "end"
    for step in plan_list:
        if step not in completed_steps:
            next_agent = step
            break

    print(f"Completed: {completed_steps}")
    print(f"Routing -> {next_agent}")

    return {
        "plan_list": plan_list,
        "current_agent": next_agent,
    }
