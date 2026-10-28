import pandas as pd
import numpy as np
from typing import Dict, Any
from backend.state import GraphState


def eda_node(state: GraphState) -> Dict[str, Any]:
    """
    Energy EDA Agent (📊): Calculates elevation-vs-insolation Pearson correlations,
    maps inter-district energy poverty severity, and produces descriptive statistics
    required by the Insight and Report agents.
    """
    print("\n--- [Energy EDA Agent] ---")
    dataset_path = state.get("cleaned_dataset_path") or state.get("active_dataset_path")
    if not dataset_path:
        print("Error: No dataset path available.")
        return {"error": "EDA failed: No dataset path."}

    print(f"Loading dataset for EDA: {dataset_path}")
    try:
        df = pd.read_csv(dataset_path)
        eda_output: Dict[str, Any] = {}

        # --- Basic shape ---
        eda_output["row_count"] = df.shape[0]
        eda_output["column_count"] = df.shape[1]
        eda_output["columns"] = list(df.columns)

        # --- Descriptive stats (numerical) ---
        num_df = df.select_dtypes(include=["number"])
        if not num_df.empty:
            desc = num_df.describe().to_dict()
            eda_output["descriptive_stats"] = desc

        # --- Elevation vs Insolation correlation ---
        elev_col = next((c for c in df.columns if "elevation" in c.lower() or "altitude" in c.lower()), None)
        insol_col = next((c for c in df.columns if "solar" in c.lower() or "irradiance" in c.lower() or "sv" in c.lower()), None)

        if elev_col and insol_col and elev_col in df.columns and insol_col in df.columns:
            corr_val = df[[elev_col, insol_col]].dropna().corr().iloc[0, 1]
            eda_output["elevation_insolation_correlation"] = round(float(corr_val), 4)
            print(f"Elevation-Insolation Pearson r = {corr_val:.4f}")

        # --- Full correlation matrix (numerical) ---
        if not num_df.empty:
            corr_matrix = num_df.corr().round(3).to_dict()
            eda_output["correlation_matrix"] = corr_matrix

        # --- Categorical distribution summaries ---
        cat_sums: Dict[str, Dict[str, int]] = {}
        for col in df.select_dtypes(exclude=["number"]).columns:
            if df[col].nunique() <= 40:
                cat_sums[col] = df[col].value_counts().head(10).to_dict()
        eda_output["categorical_summaries"] = cat_sums

        # --- Energy poverty severity by district ---
        district_col = next((c for c in df.columns if "district" in c.lower()), None)
        poverty_col = next((c for c in df.columns if "poverty" in c.lower() or "bpl" in c.lower()), None)
        grid_col = next((c for c in df.columns if "grid" in c.lower() or "electrif" in c.lower()), None)

        if district_col and district_col in df.columns:
            district_stats: Dict[str, Any] = {}
            for district, grp in df.groupby(district_col):
                entry: Dict[str, Any] = {"village_count": len(grp)}
                if poverty_col and poverty_col in grp.columns:
                    entry["avg_poverty_rate"] = round(float(grp[poverty_col].mean()), 3)
                if grid_col and grid_col in grp.columns:
                    entry["off_grid_count"] = int((grp[grid_col] == 0).sum())
                if insol_col and insol_col in grp.columns:
                    entry["avg_sv"] = round(float(grp[insol_col].mean()), 3)
                district_stats[str(district)] = entry
            eda_output["district_energy_poverty_map"] = district_stats
            print(f"District energy poverty map computed for {len(district_stats)} districts.")

        # Merge with previous EDA stats (cleaning audit)
        prev_eda = state.get("eda_stats") or {}
        prev_eda.update(eda_output)

        print(f"EDA complete: {df.shape[0]} villages, {df.shape[1]} features analysed.")

        completed = list(state.get("completed_steps", []))
        if "eda" not in completed:
            completed.append("eda")

        return {
            "eda_stats": prev_eda,
            "completed_steps": completed,
        }

    except Exception as e:
        print(f"EDA error: {e}")
        return {"error": f"EDA failed: {e}"}
