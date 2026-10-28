import os
import sys

# Add project root to sys.path
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from langchain_core.messages import HumanMessage
from backend.pipeline import compile_pipeline


def main():
    print("=== Testing SuryaHimal 12-Agent Pipeline Execution ===")
    graph = compile_pipeline()

    initial_state = {
        "messages": [HumanMessage(content="Ingest villages, harmonize data, run EDA, forecast 2030 demand, classify microgrids, and compile SDG report.")],
        "active_dataset_path": os.path.join(ROOT, "data/raw/sample_himalayan_villages.csv"),
        "plan_list": [],
        "completed_steps": [],
        "current_agent": "orchestrator",
        "numerical_columns": [],
        "categorical_columns": [],
        "solar_viability_scores": {},
        "hydro_potential_scores": {},
        "sql_query": None,
        "sql_result_path": None,
        "eda_stats": {},
        "chart_specs": [],
        "insights": [],
        "predictions_path": None,
        "recommendations": [],
        "report_path": None,
        "error": None,
    }

    final_state = graph.invoke(initial_state)

    print("\n=== Execution Completed Successfully ===")
    print(f"Steps completed: {final_state.get('completed_steps')}")
    print(f"Insights generated: {len(final_state.get('insights', []))}")
    print(f"Recommendations generated: {len(final_state.get('recommendations', []))}")
    print(f"SDG Report path: {final_state.get('report_path')}")
    print(f"Predictions path: {final_state.get('predictions_path')}")


if __name__ == "__main__":
    main()
