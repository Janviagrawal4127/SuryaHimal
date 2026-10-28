import os
import math
import pandas as pd
from typing import Dict, Any
from backend.state import GraphState


# ---------------------------------------------------------------------------
# Solar Viability Index:  Sv = I_solar × (1 − D_cloud/365) × cos(θ_slope)
# Hydro Potential Index:  Hp = (∇_river / (d_stream + ε)) × (P_annual/1000)
# ---------------------------------------------------------------------------

def _compute_sv(row: pd.Series) -> float:
    """Compute Solar Viability Index for a village row."""
    i_solar = float(row.get("solar_irradiance_kwh_m2_day", 4.5))
    d_cloud = float(row.get("annual_cloud_days", 120))
    theta_deg = float(row.get("slope_degrees", 15))
    theta_rad = math.radians(theta_deg)
    sv = i_solar * (1.0 - d_cloud / 365.0) * math.cos(theta_rad)
    return round(max(sv, 0.0), 4)


def _compute_hp(row: pd.Series) -> float:
    """Compute Hydro Potential Index for a village row."""
    river_gradient = float(row.get("river_gradient_m_per_km", 10.0))
    d_stream_km = float(row.get("distance_to_stream_km", 1.5))
    p_annual_mm = float(row.get("annual_precipitation_mm", 800))
    epsilon = 0.1  # prevent division by zero
    hp = (river_gradient / (d_stream_km + epsilon)) * (p_annual_mm / 1000.0)
    return round(max(hp, 0.0), 4)


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def ingestion_node(state: GraphState) -> Dict[str, Any]:
    """
    Energy Ingestor Agent (📥): Reads village satellite/elevation/hydrologic dataset,
    validates schema, and computes per-village Solar Viability (Sv) and Hydro Potential (Hp)
    domain indices from raw GIS features.
    """
    print("\n--- [Energy Ingestor Agent] ---")
    active_path = state.get("active_dataset_path")
    if not active_path:
        print("Error: No dataset path provided.")
        return {"error": "Ingestion failed: No active dataset path in state."}

    print(f"Loading village dataset from: {active_path}")
    try:
        ext = os.path.splitext(active_path)[-1].lower()
        if ext == ".csv":
            df = pd.read_csv(active_path)
        elif ext in (".xlsx", ".xls"):
            df = pd.read_excel(active_path)
        elif ext == ".json":
            df = pd.read_json(active_path)
        else:
            df = pd.read_csv(active_path)

        print(f"Loaded dataset: {df.shape[0]} villages x {df.shape[1]} features")

        # Ensure output directory exists
        data_dir = os.path.join(ROOT, "data")
        os.makedirs(data_dir, exist_ok=True)
        raw_path = os.path.join(data_dir, "raw_villages.csv")
        df.to_csv(raw_path, index=False)
        print(f"Saved raw village copy -> {raw_path}")

        # Identify columns
        numerical_cols = list(df.select_dtypes(include=["number"]).columns)
        categorical_cols = list(df.select_dtypes(exclude=["number"]).columns)
        print(f"Numerical features: {numerical_cols}")
        print(f"Categorical features: {categorical_cols}")

        # Compute domain indices
        df["solar_viability_sv"] = df.apply(_compute_sv, axis=1)
        df["hydro_potential_hp"] = df.apply(_compute_hp, axis=1)

        # Build index dictionaries keyed by village ID if available
        id_col = next((c for c in df.columns if "id" in c.lower() or "village" in c.lower()), None)
        if id_col:
            sv_dict = dict(zip(df[id_col].astype(str), df["solar_viability_sv"]))
            hp_dict = dict(zip(df[id_col].astype(str), df["hydro_potential_hp"]))
        else:
            sv_dict = dict(zip(df.index.astype(str), df["solar_viability_sv"]))
            hp_dict = dict(zip(df.index.astype(str), df["hydro_potential_hp"]))

        avg_sv = df["solar_viability_sv"].mean()
        avg_hp = df["hydro_potential_hp"].mean()
        print(f"Mean Solar Viability Sv = {avg_sv:.3f}  |  Mean Hydro Potential Hp = {avg_hp:.3f}")

        # Re-save enriched dataset
        df.to_csv(raw_path, index=False)

        completed = list(state.get("completed_steps", []))
        if "ingest" not in completed:
            completed.append("ingest")

        return {
            "active_dataset_path": raw_path,
            "numerical_columns": list(df.select_dtypes(include=["number"]).columns),
            "categorical_columns": list(df.select_dtypes(exclude=["number"]).columns),
            "solar_viability_scores": sv_dict,
            "hydro_potential_scores": hp_dict,
            "completed_steps": completed,
        }

    except Exception as e:
        print(f"Ingestion error: {e}")
        return {"error": f"Ingestion failed: {e}"}
