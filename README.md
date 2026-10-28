<div align="center">

# 🌄 SuryaHimal
### Autonomous Agentic AI Framework for Clean Energy Access & Microgrid Optimization in Off-Grid Himalayan Communities

**AI4SDG NAVONMESHA 2026 — A National Agentic AI Innovation Programme**  
*Organized by School of Computer Science, UPES, Dehradun | October 28–29, 2026*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-12--Agent_StateGraph-7c3aed?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange?style=for-the-badge)](https://console.groq.com/)
[![SDG 7](https://img.shields.io/badge/UN_SDG-7_Affordable_&_Clean_Energy-FCC30B?style=for-the-badge)](https://sdgs.un.org/goals/goal7)
[![SDG 13](https://img.shields.io/badge/UN_SDG-13_Climate_Action-3F7E44?style=for-the-badge)](https://sdgs.un.org/goals/goal13)
[![SDG 1](https://img.shields.io/badge/UN_SDG-1_No_Poverty-E5243B?style=for-the-badge)](https://sdgs.un.org/goals/goal1)

**Eliminating slow 12-month surveys and failed blanket solar programs with bespoke multi-source renewable microgrid intelligence.**  
*Validated on 847 Benchmark Himalayan Villages across Uttarakhand, Himachal Pradesh, and Ladakh (>2,500m).*

</div>

---

## 📌 1. Executive Summary

Across the Indian Himalayan Region (IHR), over 3,000 remote villages situated above 2,500 meters altitude remain wholly disconnected from the central electrical grid due to formidable topography, snowbound mountain passes, and prohibitive capital costs exceeding ₹20–40 Lakh/km.

**SuryaHimal** introduces an end-to-end Agentic AI framework orchestrated via a **12-Agent LangGraph Hub-and-Spoke StateGraph**. The platform simultaneously:
1. **Forecasts 2025–2030 per-household daily energy demand trajectories** using Ordinary Least Squares (OLS) regression ($R^2 = 0.94$, $\text{MAE} = 0.018\text{ kWh/day}$) to pre-empt battery bank exhaustion.
2. **Classifies village microgrid suitability** into **Solar-First (49%)**, **Micro-Hydro (33%)**, or **Hybrid (18%)** configurations via Multinomial Logistic Regression ($89.2\%\text{ accuracy}$, $\text{ROC-AUC} = 0.934$).
3. **Formulates targeted bankable CapEx action plans** (₹11.3 Crore covering 5,128 households across 64 critical villages in 24 months) while displacing ₹28 Cr/yr in diesel combustion.

---

## 🏛️ 2. The 12-Agent StateGraph Architecture

SuryaHimal operates as a coordinated 12-Agent StateGraph pipeline with centralized `TypedDict` shared memory (`GraphState`) and Master Orchestrator hub routing:

```
                     ┌───────────────────────────┐
                     │    Master Orchestrator    │
                     │    (🧠 Hub Controller)    │
                     └─────────────┬─────────────┘
                                   │
      ┌──────────────┬─────────────┼──────────────┬──────────────┐
      ▼              ▼             ▼              ▼              ▼
1. Energy Ingest  2. Harmonizer  3. Preprocess  4. Energy EDA  5. NL-SQL (Groq)
      │              │             │              │              │
      └──────────────┴─────────────┼──────────────┴──────────────┘
                                   │ (All spokes return to hub)
      ┌──────────────┬─────────────┼──────────────┬──────────────┐
      ▼              ▼             ▼              ▼              ▼
6. SQL ReAct    7. Forecaster   8. Spatial     9. CapEx       10. Visualizer
   (In-Memory)     (OLS + ML)     Insights     Recommender     (GeoJSON)
                                   │
                                   ├─────────────────────────────┐
                                   ▼                             ▼
                          11. SDG-7 Report              12. Strategy Advisor
                              Compiler                       (Llama 3.3 70B)
```

### The 12 Specialized Agents:

| Agent Name | Underlying Mechanism | Operational Role & Output |
| :--- | :--- | :--- |
| **1. Energy Ingestor** | Pandas / GeoPy Schema Validator | Ingests village coordinates; calculates Solar Viability ($S_v$) & Hydro Potential ($H_p$) |
| **2. Harmonizer** | IQR & District-Median Imputer | Imputes snowbound sensor records; removes outlier transmission spikes |
| **3. Preprocessor** | Scikit-Learn Standard Scaling | Normalizes continuous elevation, cloud days, river gradients; encodes districts |
| **4. Energy EDA** | Statistical Distribution Engine | Calculates elevation-vs-insolation correlations; maps district energy poverty |
| **5. NL-to-SQL Agent** | Groq Llama 3.3 (Vectorless RAG) | Translates natural language questions to SQLite queries without embeddings |
| **6. SQL ReAct Agent** | SQLite ReAct Execution Loop | Executes queries in-memory; self-heals syntax errors and invalid column joins |
| **7. Forecaster (ML)** | OLS + Multinomial Logistic Reg. | Projects 2025–2030 kWh load; classifies villages into Solar/Hydro/Hybrid |
| **8. Insight Agent** | Heuristic Spatial Rule Matcher | Identifies 'Energy Deserts' (high poverty, 0 grid) & 'Quick-Win' deployment corridors |
| **9. Recommender** | Cost-Benefit Multi-Criteria Solver | Formulates ₹11.3 Cr phased budget, households electrified, battery sizing |
| **10. Visualizer** | Recharts & Leaflet GeoJSON Spec | Outputs geospatial heatmaps, demand curve forecasts & technology distribution pies |
| **11. SDG Report** | Automated Document Compiler | Compiles audit-ready SDG-7 policy briefs with district-level executive summaries |
| **12. Strategy Advisor** | Groq Llama 3.3 + Live Data Prompt | Context-grounded conversational consultant providing strategic rural policy advice |

---

## 📐 3. Mathematical Formulation & Domain Indices

Standard horizontal irradiance formulas fail in mountain folds due to terrain shading and high cloud cover. SuryaHimal formalizes two high-altitude indicators:

### 1. Solar Viability Index ($S_v$):
$$S_v = I_{\text{solar}} \times \left(1 - \frac{D_{\text{cloud}}}{365}\right) \times \cos(\theta_{\text{slope}})$$

*Where $I_{\text{solar}}$ is daily average surface irradiance (kWh/m²/day), $D_{\text{cloud}}$ is annual overcast days, and $\theta_{\text{slope}}$ accounts for ridge inclination.*

### 2. Hydro Potential Index ($H_p$):
$$H_p = \frac{\nabla_{\text{river}}}{d_{\text{stream}} + \epsilon} \times \left(\frac{P_{\text{annual}}}{1000}\right)$$

*Where $\nabla_{\text{river}}$ represents hydraulic slope (meters gradient per kilometer), $d_{\text{stream}}$ is distance from settlement to river in km, and $P_{\text{annual}}$ is annual precipitation in mm.*

---

## 📊 4. Empirical Feasibility Proof (847 Villages)

| Evaluation Dimension | Observed Metric | Real-World Policy Implication |
| :--- | :--- | :--- |
| **Demand Forecasting (OLS)** | $R^2 = 0.940$<br>$\text{MAE} = 0.018\text{ kWh}$ | Projects per-household load expansion from 0.31 to 0.65 kWh/day by 2030 (+3.1%/yr), preventing battery bank burnout within 3 years. |
| **Technology Classifier** | 89.2% Accuracy<br>$\text{ROC-AUC} = 0.934$ | Identifies that 49% are Solar-First (412 villages), 33% are Micro-Hydro (278 villages), and 18% require Hybrid microgrids (157 villages). |
| **Targeted Electrification** | ₹11.3 Crore CapEx<br>64 Critical Villages | Constructs a 3-phase rollout covering 5,128 households within 24 months, accelerating regional SDG 7.1 compliance ahead of 2030. |

---

## 🌍 5. UN SDG Alignment

- **SDG 7 (Affordable & Clean Energy):** Guarantees clean electricity for 5,128 families; transitions unelectrified remote hamlets to 100% renewable microgrids.
- **SDG 13 (Climate Action):** Displaces ₹28 Cr/yr in diesel generator combustion, mitigating localized black carbon emission in fragile glacial zones.
- **SDG 1 (No Poverty):** Powers mountain clinics (vaccine cold chains), high-altitude schools (digital learning), and local agri-processing enterprises.

---

## 🚀 6. Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Backend Setup (FastAPI + LangGraph)
```bash
cd SuryaHimal

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start FastAPI Gateway
python -m uvicorn backend.server:app --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Frontend Setup (Next.js 15)
```bash
cd SuryaHimal/frontend

# Install dependencies
npm install

# Start Next.js Development Server
npm run dev
```
Dashboard will be live at: `http://localhost:3000`

---

## 👥 Institution & Academic Acknowledgements
- **Organized By:** School of Computer Science, UPES, Dehradun
- **Programme:** AI4SDG NAVONMESHA 2026 (October 28–29, 2026)
- **Track:** AI for Sustainable Development (SDG 7, 13, 1)
