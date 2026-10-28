from typing import List, Dict, Any, Optional, TypedDict
from langchain_core.messages import BaseMessage


class GraphState(TypedDict):
    """
    Shared state schema representing the workspace context and history
    for the 12 specialized agents of SuryaHimal.

    Each field is persisted across the Hub-and-Spoke LangGraph state machine,
    enabling autonomous energy planning for off-grid Himalayan villages.
    """
    messages: List[BaseMessage]

    # Dataset paths
    active_dataset_path: Optional[str]
    cleaned_dataset_path: Optional[str]
    preprocessed_dataset_path: Optional[str]

    # Orchestration
    plan_list: List[str]
    completed_steps: List[str]
    current_agent: str

    # Column metadata
    numerical_columns: List[str]
    categorical_columns: List[str]

    # NL-SQL pipeline
    sql_query: Optional[str]
    sql_result_path: Optional[str]

    # Energy-domain indices (computed by Energy Ingestor)
    solar_viability_scores: Optional[Dict[str, float]]   # village_id → Sv
    hydro_potential_scores: Optional[Dict[str, float]]   # village_id → Hp

    # EDA stats (statistical summaries + elevation/insolation correlation maps)
    eda_stats: Optional[Dict[str, Any]]

    # Chart specs for Recharts / Leaflet GeoJSON
    chart_specs: Optional[List[Dict[str, Any]]]

    # Insights: Energy Deserts, Quick-Win corridors
    insights: Optional[List[Dict[str, Any]]]

    # Predictions: OLS load forecast + Multinomial classifier results
    predictions_path: Optional[str]

    # Recommendations: Phased CapEx budget milestones
    recommendations: Optional[List[Dict[str, Any]]]

    # Final SDG-7 policy report path
    report_path: Optional[str]

    # Error propagation
    error: Optional[str]
