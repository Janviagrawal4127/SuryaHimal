from langgraph.graph import StateGraph, END
from backend.state import GraphState
from backend.orchestrator import orchestrator_node
from backend.ingestion import ingestion_node
from backend.cleaning import cleaning_node
from backend.preprocessing import preprocessing_node
from backend.nl_query import nl_query_node
from backend.sql_agent import sql_agent_node
from backend.eda import eda_node
from backend.visualization import visualization_node
from backend.predictive import predictive_node
from backend.insight import insight_node
from backend.recommendation import recommendation_node
from backend.report import report_node


def orchestrator_router(state: GraphState) -> str:
    """
    Hub-and-Spoke routing function: reads current_agent from state
    and returns the name of the next node to execute.
    """
    next_agent = state.get("current_agent", "end")
    valid = {
        "ingest", "clean", "preprocessing", "nl_query", "sql_agent",
        "eda", "visualization", "predictive", "insight", "recommendation", "report"
    }
    return next_agent if next_agent in valid else "end"


def compile_pipeline():
    """
    Compiles the SuryaHimal 12-Agent LangGraph Hub-and-Spoke StateGraph.

    Topology:
      orchestrator → [ingest | clean | preprocessing | nl_query | sql_agent |
                       eda | visualization | predictive | insight | recommendation | report]
      every spoke → orchestrator (all spokes loop back to the hub)
      orchestrator → END when no more steps remain
    """
    builder = StateGraph(GraphState)

    # Register all agent nodes
    builder.add_node("orchestrator", orchestrator_node)
    builder.add_node("ingest", ingestion_node)
    builder.add_node("clean", cleaning_node)
    builder.add_node("preprocessing", preprocessing_node)
    builder.add_node("nl_query", nl_query_node)
    builder.add_node("sql_agent", sql_agent_node)
    builder.add_node("eda", eda_node)
    builder.add_node("visualization", visualization_node)
    builder.add_node("predictive", predictive_node)
    builder.add_node("insight", insight_node)
    builder.add_node("recommendation", recommendation_node)
    builder.add_node("report", report_node)

    # Entry point
    builder.set_entry_point("orchestrator")

    # Conditional routing from orchestrator hub
    builder.add_conditional_edges(
        "orchestrator",
        orchestrator_router,
        {
            "ingest": "ingest",
            "clean": "clean",
            "preprocessing": "preprocessing",
            "nl_query": "nl_query",
            "sql_agent": "sql_agent",
            "eda": "eda",
            "visualization": "visualization",
            "predictive": "predictive",
            "insight": "insight",
            "recommendation": "recommendation",
            "report": "report",
            "end": END,
        },
    )

    # Every spoke returns to orchestrator (hub-and-spoke pattern)
    for node in ["ingest", "clean", "preprocessing", "nl_query", "sql_agent",
                 "eda", "visualization", "predictive", "insight", "recommendation", "report"]:
        builder.add_edge(node, "orchestrator")

    return builder.compile()
