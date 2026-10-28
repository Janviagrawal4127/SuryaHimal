import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from typing import Dict, Any
from backend.state import GraphState


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def preprocessing_node(state: GraphState) -> Dict[str, Any]:
    """
    Preprocessor Agent (⚙️): Normalises continuous elevation, cloud days, and river
    gradient features via StandardScaler; applies LabelEncoder to district and
    state categorical columns; prepares the feature matrix for the ML forecaster.
    """
    print("\n--- [Preprocessor Agent] ---")
    dataset_path = state.get("cleaned_dataset_path") or state.get("active_dataset_path")
    if not dataset_path:
        print("Error: No dataset path available.")
        return {"error": "Preprocessing failed: No dataset path."}

    print(f"Loading dataset for preprocessing: {dataset_path}")
    try:
        df = pd.read_csv(dataset_path)

        numerical_cols = state.get("numerical_columns", []) or list(df.select_dtypes(include=["number"]).columns)
        categorical_cols = state.get("categorical_columns", []) or list(df.select_dtypes(exclude=["number"]).columns)

        # 1. StandardScaler on continuous numerical features
        # Skip already-computed binary / index columns
        skip_scale = {"solar_viability_sv", "hydro_potential_hp"}
        scale_cols = [c for c in numerical_cols if c in df.columns and c not in skip_scale and df[c].nunique() > 2]

        if scale_cols:
            scaler = StandardScaler()
            df[scale_cols] = scaler.fit_transform(df[scale_cols])
            print(f"Scaled {len(scale_cols)} numerical columns: {scale_cols}")

        # 2. LabelEncoder for categorical text columns
        for col in categorical_cols:
            if col in df.columns and df[col].dtype == object:
                le = LabelEncoder()
                df[col + "_enc"] = le.fit_transform(df[col].astype(str))
                print(f"Label-encoded '{col}' -> '{col}_enc'")

        data_dir = os.path.join(ROOT, "data")
        os.makedirs(data_dir, exist_ok=True)
        preprocessed_path = os.path.join(data_dir, "preprocessed_villages.csv")
        df.to_csv(preprocessed_path, index=False)
        print(f"Saved preprocessed dataset -> {preprocessed_path}")

        completed = list(state.get("completed_steps", []))
        if "preprocessing" not in completed:
            completed.append("preprocessing")

        return {
            "preprocessed_dataset_path": preprocessed_path,
            "active_dataset_path": preprocessed_path,
            "completed_steps": completed,
        }

    except Exception as e:
        print(f"Preprocessing error: {e}")
        return {"error": f"Preprocessing failed: {e}"}
