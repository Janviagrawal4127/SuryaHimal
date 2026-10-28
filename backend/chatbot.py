"""
Strategy Advisor Chatbot (🧭): Groq Llama 3.3 70B powered energy policy consultant
for SuryaHimal. Provides data-grounded SDG-7 strategy advice, microgrid planning
guidance, and policy Q&A for Gram Panchayat leaders and government agencies.
"""
import os
import json
import pandas as pd
from typing import List, Dict, Any, Optional


def _load_energy_context() -> str:
    """Load live SuryaHimal analytics data to inject into system prompt."""
    ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    context_parts = []

    try:
        for pred_path in ["data/predictions.json"]:
            full = os.path.join(ROOT, pred_path)
            if os.path.exists(full):
                with open(full, "r") as f:
                    preds = json.load(f)

                forecast = preds.get("demand_forecast_2025_2030", [])
                if forecast:
                    start = forecast[0]["predicted_kwh_per_day"]
                    end = forecast[-1]["predicted_kwh_per_day"]
                    context_parts.append(f"Demand Forecast: {start} → {end} kWh/day (2025–2030)")

                cls = preds.get("microgrid_classification", {})
                if cls:
                    solar = cls.get("Solar-First", {}).get("count", 0)
                    hydro = cls.get("Micro-Hydro", {}).get("count", 0)
                    hybrid = cls.get("Hybrid", {}).get("count", 0)
                    context_parts.append(
                        f"Technology Mix: Solar-First={solar}, Micro-Hydro={hydro}, Hybrid={hybrid}"
                    )

                acc = preds.get("classifier_accuracy")
                if acc:
                    context_parts.append(f"Classifier Accuracy: {acc*100:.1f}%")
                break
    except Exception:
        pass

    try:
        for csv_path in ["data/cleaned_villages.csv", "data/raw_villages.csv"]:
            full = os.path.join(ROOT, csv_path)
            if os.path.exists(full):
                df = pd.read_csv(full)
                context_parts.append(f"Villages Loaded: {len(df)} records")
                if "elevation_m" in df.columns:
                    context_parts.append(
                        f"Elevation Range: {df['elevation_m'].min():.0f}m – {df['elevation_m'].max():.0f}m"
                    )
                if "grid_access" in df.columns:
                    off_grid = (df["grid_access"] == 0).sum()
                    context_parts.append(f"Off-Grid Villages: {off_grid}")
                if "solar_viability_sv" in df.columns:
                    avg_sv = df["solar_viability_sv"].mean()
                    context_parts.append(f"Mean Solar Viability (Sv): {avg_sv:.3f}")
                break
    except Exception:
        pass

    return "\n".join(f"  - {p}" for p in context_parts) if context_parts else ""


SYSTEM_PROMPT_TEMPLATE = """You are SuryaHimal Strategy Advisor — an expert AI energy policy consultant embedded inside the SuryaHimal Autonomous Agentic AI platform for Himalayan clean energy access.

Your primary role is to help:
1. Government energy planners (MNRE, State REDAs) make evidence-based microgrid deployment decisions
2. Gram Panchayat leaders understand village-level solar vs micro-hydro suitability
3. Development agencies (World Bank, UNDP) design bankable SDG-7 project proposals
4. Researchers and hackathon judges understand the AI methodology and domain indices

Key domain knowledge you must apply:
- Solar Viability Index: Sv = I_solar × (1 − D_cloud/365) × cos(θ_slope)
- Hydro Potential Index: Hp = (∇_river / (d_stream + ε)) × (P_annual/1000)
- Technology thresholds: Sv ≥ 2.5 → Solar-First; Hp ≥ 5.0 → Micro-Hydro; otherwise Hybrid
- Demand trajectory: 0.31 kWh/day (2025) → 0.65 kWh/day (2030) at +3.1%/yr
- Target: 5,128 households in 64 critical villages | ₹11.3 Crore CapEx | 24-month rollout
- SDG alignment: SDG 7.1 (universal access), SDG 7.2 (renewable share), SDG 13.2, SDG 1.4

Communication style:
- Use precise domain terminology (Sv, Hp, CapEx, kcWh, MNRE, PM-KUSUM)
- Cite specific numbers from the data context when available
- Structure recommendations with Phase → Action → Cost → Impact format
- Always frame rural energy policy in terms of SDG targets and 2030 deadlines

{data_context_block}

If asked about topics outside Himalayan energy, microgrids, or SDG policy, gently redirect to how SuryaHimal can help solve those energy access challenges."""


def build_system_prompt(include_data: bool = True) -> str:
    data_block = ""
    if include_data:
        ctx = _load_energy_context()
        if ctx:
            data_block = f"""
=== LIVE SURYA HIMAL ANALYTICS (from latest pipeline run) ===
{ctx}
==============================================================
Reference these figures when answering questions about energy demand, village classifications, or CapEx planning."""
    return SYSTEM_PROMPT_TEMPLATE.format(data_context_block=data_block)


def chat_with_groq(
    messages: List[Dict[str, str]],
    include_data_context: bool = True,
) -> Dict[str, str]:
    """
    Send a conversation to Groq Llama 3.3 70B and return the strategy advisor response.
    """
    api_key = os.getenv("Groq_API") or os.getenv("GROQ_API_KEY")
    if not api_key:
        return {
            "role": "assistant",
            "content": (
                "I need a Groq API key to function. Please add `Groq_API=your_key` "
                "to your `.env` file. Get a free key at https://console.groq.com/"
            ),
        }
    api_key = api_key.strip('"').strip("'")

    system_prompt = build_system_prompt(include_data=include_data_context)
    payload = [{"role": "system", "content": system_prompt}]
    for msg in messages:
        payload.append({"role": msg["role"], "content": msg["content"]})

    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=payload,
            temperature=0.6,
            max_tokens=1200,
        )
        return {"role": "assistant", "content": response.choices[0].message.content}
    except Exception as e:
        return {
            "role": "assistant",
            "content": f"Connection error: {e}\n\nPlease verify your Groq API key at https://console.groq.com/",
        }
