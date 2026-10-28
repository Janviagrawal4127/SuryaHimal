import os
import sys
import json
import asyncio
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from langchain_core.messages import HumanMessage
from backend.pipeline import compile_pipeline
from backend.nl_query import run_rule_based_fallback
from backend.sql_agent import execute_query_safely

app = FastAPI(
    title="SuryaHimal API Gateway",
    description=(
        "REST & WebSocket API bridging the Next.js dashboard with the 12-agent "
        "LangGraph clean energy intelligence fleet for off-grid Himalayan villages."
    ),
    version="1.0.0",
)

# ── CORS ────────────────────────────────────────────────────────────────────
_raw_origins = os.getenv("ALLOWED_ORIGINS", "")
_frontend_url = os.getenv("FRONTEND_URL", "")

configured_origins = {"http://localhost:3000", "http://127.0.0.1:3000"}
if _raw_origins:
    for o in _raw_origins.split(","):
        clean = o.strip().rstrip("/")
        if clean:
            configured_origins.add(clean)
if _frontend_url:
    configured_origins.add(_frontend_url.strip().rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(configured_origins),
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── WebSocket Manager ────────────────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for conn in self.active_connections:
            try:
                await conn.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


# ── Request Models ───────────────────────────────────────────────────────────
class PipelineRunRequest(BaseModel):
    prompt: Optional[str] = (
        "Ingest village dataset, harmonize sensor data, run energy EDA, "
        "forecast 2030 demand, classify microgrid technologies, "
        "identify energy deserts, and compile SDG-7 policy report."
    )
    dataset_path: Optional[str] = "data/raw/sample_himalayan_villages.csv"


class QueryRequest(BaseModel):
    query: str
    dataset_path: Optional[str] = "data/cleaned_villages.csv"


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    include_data_context: Optional[bool] = True


# ── Health Check ─────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "SuryaHimal 12-Agent Energy Intelligence Backend",
        "orchestrator_status": "ready",
        "agents_available": 12,
        "fleet": [
            "orchestrator", "ingest", "clean", "preprocessing",
            "nl_query", "sql_agent", "eda", "visualization",
            "predictive", "insight", "recommendation", "report",
        ],
        "domain": "Himalayan Off-Grid Clean Energy Access",
        "sdg_focus": "SDG 7, SDG 13, SDG 1",
        "validation_villages": 847,
    }


# ── Pipeline Trigger ──────────────────────────────────────────────────────────
@app.post("/api/pipeline/run")
async def run_pipeline_endpoint(req: PipelineRunRequest, background_tasks: BackgroundTasks):
    """Triggers the full SuryaHimal 12-agent LangGraph energy analysis pipeline."""
    dataset_path = req.dataset_path or "data/raw/sample_himalayan_villages.csv"
    if not os.path.exists(os.path.join(ROOT, dataset_path)):
        dataset_path = "data/raw/sample_himalayan_villages.csv"

    graph = compile_pipeline()

    initial_state = {
        "messages": [HumanMessage(content=req.prompt)],
        "active_dataset_path": dataset_path,
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

    await manager.broadcast({
        "type": "pipeline_started",
        "prompt": req.prompt,
        "timestamp": pd.Timestamp.now().isoformat(),
    })

    try:
        final_state = graph.invoke(initial_state)

        await manager.broadcast({
            "type": "pipeline_completed",
            "completed_steps": final_state.get("completed_steps", []),
            "insights_count": len(final_state.get("insights", [])),
            "recommendations_count": len(final_state.get("recommendations", [])),
        })

        return {
            "status": "success" if not final_state.get("error") else "error",
            "completed_steps": final_state.get("completed_steps", []),
            "cleaned_dataset_path": final_state.get("cleaned_dataset_path"),
            "solar_viability_scores": final_state.get("solar_viability_scores", {}),
            "hydro_potential_scores": final_state.get("hydro_potential_scores", {}),
            "insights": final_state.get("insights", []),
            "recommendations": final_state.get("recommendations", []),
            "report_path": final_state.get("report_path"),
        }
    except Exception as e:
        await manager.broadcast({"type": "pipeline_error", "error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))


# ── NL-to-SQL Energy Query ────────────────────────────────────────────────────
@app.post("/api/query/sql")
async def execute_nl_sql(req: QueryRequest):
    """
    Translates natural language village energy questions to SQL and executes
    with ReAct self-healing. Supports queries like:
    'Find off-grid villages above 3000m with river access within 500m'
    """
    raw_query = req.query.strip()
    if raw_query.upper().startswith("SELECT"):
        sql = raw_query
    else:
        sql = run_rule_based_fallback(raw_query)

    dataset_path = os.path.join(ROOT, req.dataset_path or "data/cleaned_villages.csv")
    if not os.path.exists(dataset_path):
        dataset_path = os.path.join(ROOT, "data/raw_villages.csv")

    return execute_query_safely(sql, dataset_path)


# ── Predictions Endpoint ──────────────────────────────────────────────────────
@app.get("/api/data/predictions")
async def get_predictions():
    """Returns latest demand forecast and microgrid classification results."""
    pred_file = os.path.join(ROOT, "data/predictions.json")
    if os.path.exists(pred_file):
        with open(pred_file, "r") as f:
            return json.load(f)
    return {"message": "No predictions generated yet. Run the pipeline first."}


# ── SDG Report Endpoint ───────────────────────────────────────────────────────
@app.get("/api/data/report", response_class=HTMLResponse)
async def get_report():
    """Serves the latest compiled SDG-7 HTML policy brief."""
    report_file = os.path.join(ROOT, "data/sdg_report.html")
    if os.path.exists(report_file):
        with open(report_file, "r", encoding="utf-8") as f:
            return f.read()
    return "<h3 style='font-family:sans-serif;padding:40px'>No report generated yet. Run the pipeline first.</h3>"


# ── WebSocket Telemetry ───────────────────────────────────────────────────────
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """Real-time agent telemetry streaming to the Next.js dashboard."""
    await manager.connect(websocket)
    try:
        await websocket.send_json({
            "type": "handshake",
            "message": "Connected to SuryaHimal Orchestrator Telemetry Stream",
            "fleet_size": 12,
            "domain": "Himalayan Clean Energy",
            "status": "ready",
        })
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"type": "heartbeat", "received": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


# ── Strategy Advisor Chat ─────────────────────────────────────────────────────
@app.post("/api/chat")
async def energy_strategy_chat(req: ChatRequest):
    """Energy Policy Strategy AI Chatbot — Groq Llama 3.3 with live energy data context."""
    from backend.chatbot import chat_with_groq
    msgs = [{"role": m.role, "content": m.content} for m in req.messages]
    return chat_with_groq(msgs, include_data_context=req.include_data_context or True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.server:app", host="0.0.0.0", port=8000, reload=True)
