"use client";

import React from "react";

interface AgentMeta {
  id: number;
  name: string;
  role: string;
  mechanism: string;
  output: string;
  status: "Active" | "Standby" | "Online";
  color: string;
}

const AGENTS: AgentMeta[] = [
  {
    id: 1,
    name: "Energy Ingestor",
    role: "GIS & Coordinate Ingestion",
    mechanism: "Pandas / GeoPy Schema Validator",
    output: "Computes baseline Solar Viability (Sv) & Hydro Potential (Hp) per village",
    status: "Active",
    color: "text-primary",
  },
  {
    id: 2,
    name: "Data Harmonizer",
    role: "Missing Data Imputer",
    mechanism: "IQR & District-Median Imputer",
    output: "Resolves missing sensor records; removes outlier transmission spikes",
    status: "Active",
    color: "text-secondary",
  },
  {
    id: 3,
    name: "Feature Preprocessor",
    role: "Normalization & Encoding",
    mechanism: "Scikit-Learn Standard Scaling",
    output: "Normalizes elevation, cloud days, river gradients; encodes districts",
    status: "Active",
    color: "text-tertiary",
  },
  {
    id: 4,
    name: "Energy EDA Analyst",
    role: "Spatial Correlational Engine",
    mechanism: "Statistical Distribution Engine",
    output: "Calculates elevation-vs-insolation correlations; maps poverty severity",
    status: "Active",
    color: "text-primary",
  },
  {
    id: 5,
    name: "NL-to-SQL Agent",
    role: "Query Translator",
    mechanism: "Groq Llama 3.3 (Vectorless RAG)",
    output: "Translates natural questions ('Off-grid >3000m with river access') to SQL",
    status: "Active",
    color: "text-secondary",
  },
  {
    id: 6,
    name: "SQL ReAct Agent",
    role: "Self-Healing Query Execution",
    mechanism: "SQLite ReAct Execution Loop",
    output: "Executes queries in-memory; parses syntax errors and self-corrects",
    status: "Active",
    color: "text-tertiary",
  },
  {
    id: 7,
    name: "ML Forecaster",
    role: "Demand & Tech Predictor",
    mechanism: "OLS + Multinomial Logistic Reg.",
    output: "Projects 2025–2030 kWh load; assigns Solar / Hydro / Hybrid class",
    status: "Active",
    color: "text-primary",
  },
  {
    id: 8,
    name: "Spatial Insight Agent",
    role: "Pattern Recognition",
    mechanism: "Heuristic Spatial Rule Matcher",
    output: "Identifies 'Energy Deserts' (high poverty, 0 grid) & 'Quick-Win' corridors",
    status: "Active",
    color: "text-secondary",
  },
  {
    id: 9,
    name: "CapEx Recommender",
    role: "Budget Milestone Solver",
    mechanism: "Cost-Benefit Multi-Criteria Solver",
    output: "Formulates ₹11.3 Cr phased budget, households electrified, battery sizing",
    status: "Active",
    color: "text-tertiary",
  },
  {
    id: 10,
    name: "Visualizer Agent",
    role: "GeoJSON & Chart Engine",
    mechanism: "Recharts & Leaflet GeoJSON Spec",
    output: "Outputs geospatial heatmaps, demand curve forecasts & technology pies",
    status: "Active",
    color: "text-primary",
  },
  {
    id: 11,
    name: "SDG Report Compiler",
    role: "Document Generator",
    mechanism: "Automated Document Compiler",
    output: "Compiles audit-ready SDG-7 policy briefs with district executive summaries",
    status: "Active",
    color: "text-secondary",
  },
  {
    id: 12,
    name: "Strategy Advisor",
    role: "Conversational Consultant",
    mechanism: "Groq Llama 3.3 + Live Data Prompt",
    output: "Context-grounded conversational agent consulting policy planners",
    status: "Active",
    color: "text-tertiary",
  },
];

export default function AgentsSwarmPage() {
  return (
    <div className="flex flex-col relative w-full h-full space-y-6 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-primary text-xl">hub</span>
          <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
            LangGraph Multi-Agent Architecture
          </span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface">
          SuryaHimal 12-Agent Autonomous Swarm Fleet
        </h2>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
          Hub-and-Spoke StateGraph topology with centralized TypedDict shared state memory (GraphState) and autonomous ReAct error recovery loops.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-outline-variant">
          <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1 font-mono">
            <span className="material-symbols-outlined text-base">alt_route</span>
            Hub-and-Spoke State Machine
          </div>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Every spoke returns control to the Master Orchestrator, enabling automated error recovery and dynamic task rescheduling.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-outline-variant">
          <div className="flex items-center gap-2 text-secondary font-bold text-xs mb-1 font-mono">
            <span className="material-symbols-outlined text-base">memory</span>
            TypedDict GraphState Memory
          </div>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Immutable snapshots holding coordinates, Solar Viability (Sv), Hydro Potential (Hp), and classification outputs across all nodes.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-outline-variant">
          <div className="flex items-center gap-2 text-tertiary font-bold text-xs mb-1 font-mono">
            <span className="material-symbols-outlined text-base">healing</span>
            Self-Healing ReAct Loop
          </div>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            SQL generation failures and invalid schema joins trigger autonomous ReAct feedback iterations without requiring human debugging.
          </p>
        </div>
      </div>

      {/* 12-Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="glass-card rounded-2xl p-5 border border-outline-variant hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-container font-bold text-on-surface-variant">
                  Agent #{agent.id}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-tertiary">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  {agent.status}
                </span>
              </div>

              <h3 className={`font-display text-base font-bold ${agent.color}`}>
                {agent.name}
              </h3>
              <div className="text-[11px] font-mono text-on-surface-variant/80 mt-0.5">
                {agent.role}
              </div>

              <div className="my-3 p-3 rounded-xl bg-surface-container/50 border border-outline-variant/60 font-mono text-[11px] space-y-1">
                <div className="text-secondary font-bold">Mechanism:</div>
                <div className="text-on-surface">{agent.mechanism}</div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                {agent.output}
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/40 mt-4 flex items-center justify-between text-[10px] font-mono text-outline">
              <span>Node: {agent.name.toLowerCase().replace(/\s+/g, '_')}</span>
              <span className="text-primary font-bold">Hub-and-Spoke Connected</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
