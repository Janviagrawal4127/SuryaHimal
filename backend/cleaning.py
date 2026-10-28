import os
import pandas as pd
import numpy as np
from typing import Dict, Any
from backend.state import GraphState


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def cleaning_node(state: GraphState) -> Dict[str, Any]:
    """
    Data Harmonizer Agent (🧹): Resolves missing sensor records using IQR-bounded
    district-median imputation, removes transmission spikes across mountain stations,
    and deduplicates repeated survey rows.

    This is the SuryaHimal equivalent of the AnalytixAI cleaning agent, tuned for
    high-altitude GIS datasets where nulls arise from snowbound sensor outages.
    """
    print("\n--- [Data Harmonizer Agent] ---")
    active_path = state.get("active_dataset_path")
    if not active_path:
        print("Error: No dataset path in state.")
        return {"error": "Cleaning failed: No active dataset path."}

    print(f"Loading village dataset for harmonization: {active_path}")
    try:
        df = pd.read_csv(active_path)
        original_shape = df.shape

        # 1. Deduplication
        dup_count = df.duplicated().sum()
        df = df.drop_duplicates()
        print(f"Removed {dup_count} duplicate village records.")

        # 2. Missing Value Imputation (District-Median strategy)
        imputed_counts: Dict[str, int] = {}
        district_col = next((c for c in df.columns if "district" in c.lower()), None)

        for col in df.columns:
            null_count = int(df[col].isnull().sum())
            if null_count == 0:
                continue
            imputed_counts[col] = null_count
            if df[col].dtype in [np.float64, np.int64, "float64", "int64"]:
                if district_col and district_col in df.columns:
                    # District-median imputation
                    df[col] = df.groupby(district_col)[col].transform(
                        lambda x: x.fillna(x.median())
                    )
                    # Global median fallback for remaining nulls
                    df[col] = df[col].fillna(df[col].median())
                    print(f"Column '{col}': Imputed {null_count} nulls with district-median.")
                else:
                    median_val = df[col].median()
                    df[col] = df[col].fillna(median_val)
                    print(f"Column '{col}': Imputed {null_count} nulls with global median ({median_val:.3f}).")
            else:
                mode_val = df[col].mode().iloc[0] if not df[col].mode().empty else "Unknown"
                df[col] = df[col].fillna(mode_val)
                print(f"Column '{col}': Imputed {null_count} nulls with mode ('{mode_val}').")

        # 3. Outlier Capping via IQR (for energy/GIS numeric columns only)
        capped_counts: Dict[str, int] = {}
        numerical_cols = state.get("numerical_columns", []) or list(df.select_dtypes(include=["number"]).columns)

        # Skip computed index columns from capping
        skip_cols = {"solar_viability_sv", "hydro_potential_hp"}

        for col in numerical_cols:
            if col in skip_cols or col not in df.columns or df[col].nunique() <= 2:
                continue
            q1 = df[col].quantile(0.25)
            q3 = df[col].quantile(0.75)
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            outlier_mask = (df[col] < lower) | (df[col] > upper)
            outlier_count = int(outlier_mask.sum())
            if outlier_count > 0:
                capped_counts[col] = outlier_count
                df[col] = np.clip(df[col], lower, upper)
                print(f"Column '{col}': Capped {outlier_count} transmission spikes -> [{lower:.2f}, {upper:.2f}].")

        # Save cleaned dataset
        data_dir = os.path.join(ROOT, "data")
        os.makedirs(data_dir, exist_ok=True)
        cleaned_path = os.path.join(data_dir, "cleaned_villages.csv")
        df.to_csv(cleaned_path, index=False)
        print(f"Saved harmonized dataset -> {cleaned_path}")
        print(f"Cleaned shape: {df.shape} (was {original_shape})")

        completed = list(state.get("completed_steps", []))
        if "clean" not in completed:
            completed.append("clean")

        return {
            "cleaned_dataset_path": cleaned_path,
            "active_dataset_path": cleaned_path,
            "completed_steps": completed,
            "eda_stats": {
                "cleaning_audit": {
                    "removed_duplicates": int(dup_count),
                    "imputed_missing": imputed_counts,
                    "capped_outliers": capped_counts,
                    "rows_before": original_shape[0],
                    "rows_after": df.shape[0],
                }
            },
        }

    except Exception as e:
        print(f"Harmonizer error: {e}")
        return {"error": f"Cleaning failed: {e}"}
