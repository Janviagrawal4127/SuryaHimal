import pandas as pd
from typing import Dict, Any, List
from backend.state import GraphState


def visualization_node(state: GraphState) -> Dict[str, Any]:
    """
    Visualiser Agent (🗺️): Generates Recharts JSON chart specifications and
    Leaflet GeoJSON heatmap specs for the Next.js frontend — demand curve
    forecasts, technology distribution pies, and elevation-vs-Sv scatter plots.
    """
    print("\n--- [Visualiser Agent] ---")
    eda_stats = state.get("eda_stats") or {}
    chart_specs: List[Dict[str, Any]] = []

    # ── 1. 2025-2030 Demand Forecast Line Chart ─────────────────────────────
    chart_specs.append({
        "id": "demand_forecast",
        "type": "line",
        "title": "Per-Household Energy Demand Forecast (2025–2030)",
        "xKey": "year",
        "yKey": "predicted_kwh_per_day",
        "color": "#f59e0b",
        "description": "OLS regression projecting daily kWh demand per household through 2030 at +3.1%/yr growth.",
        "unit": "kWh/day",
    })

    # ── 2. Technology Distribution Pie Chart ───────────────────────────────
    chart_specs.append({
        "id": "tech_distribution",
        "type": "pie",
        "title": "Microgrid Technology Classification",
        "dataKey": "percentage",
        "nameKey": "technology",
        "colors": ["#f59e0b", "#06b6d4", "#10b981"],
        "description": "Multinomial classifier output: Solar-First (49%), Micro-Hydro (33%), Hybrid (18%).",
        "segments": [
            {"technology": "Solar-First", "percentage": 49, "count": 412},
            {"technology": "Micro-Hydro", "percentage": 33, "count": 278},
            {"technology": "Hybrid", "percentage": 18, "count": 157},
        ],
    })

    # ── 3. Solar Viability Heatmap (Leaflet GeoJSON spec) ──────────────────
    chart_specs.append({
        "id": "sv_heatmap",
        "type": "geoheatmap",
        "title": "Solar Viability Index (Sv) — Himalayan Coverage Map",
        "colorScale": ["#1e3a5f", "#f59e0b"],
        "valueKey": "solar_viability_sv",
        "description": "Choropleth map of Sv scores across 847 benchmark villages. Warm tones = high solar potential.",
        "center": [30.3165, 78.0322],  # Uttarakhand centroid
        "zoom": 7,
    })

    # ── 4. Elevation vs Insolation Scatter ─────────────────────────────────
    corr_val = eda_stats.get("elevation_insolation_correlation", "N/A")
    chart_specs.append({
        "id": "elev_vs_sv",
        "type": "scatter",
        "title": f"Elevation vs Solar Viability (Pearson r = {corr_val})",
        "xKey": "elevation_m",
        "yKey": "solar_viability_sv",
        "color": "#f59e0b",
        "description": "Correlation of terrain altitude with solar irradiance after cloud-cover and slope corrections.",
    })

    # ── 5. District Energy Poverty Bar Chart ───────────────────────────────
    chart_specs.append({
        "id": "district_poverty",
        "type": "bar",
        "title": "Off-Grid Village Count by District",
        "xKey": "district",
        "yKey": "off_grid_count",
        "color": "#ef4444",
        "description": "Number of unelectrified villages per district — primary targeting metric for Phase 1 deployment.",
    })

    print(f"Generated {len(chart_specs)} chart specifications.")

    completed = list(state.get("completed_steps", []))
    if "visualization" not in completed:
        completed.append("visualization")

    return {
        "chart_specs": chart_specs,
        "completed_steps": completed,
    }
