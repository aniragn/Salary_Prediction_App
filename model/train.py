import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import joblib
import os

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_PATH  = os.path.join(BASE, "../data/salary_data.csv")
MODEL_DIR  = os.path.join(BASE, "../app")

# ── Load ───────────────────────────────────────────────────
df = pd.read_csv(DATA_PATH)
print(f"Dataset: {df.shape[0]} rows × {df.shape[1]} cols")

# ── Encode ─────────────────────────────────────────────────
categorical = ["Gender", "Education Level", "Job Title"]
encoders = {}
for col in categorical:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# ── Feature engineering ────────────────────────────────────
df["Exp_Age_Ratio"]    = df["Years of Experience"] / (df["Age"] + 1)
df["Senior"]           = (df["Years of Experience"] >= 10).astype(int)

FEATURES = [
    "Age", "Gender", "Education Level", "Job Title",
    "Years of Experience", "Exp_Age_Ratio", "Senior"
]
X = df[FEATURES]
y = df["Salary"]

# ── Split ──────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── Train GradientBoosting ─────────────────────────────────
print("\nTraining GradientBoostingRegressor...")
gb = GradientBoostingRegressor(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=5,
    min_samples_split=5,
    min_samples_leaf=3,
    subsample=0.85,
    random_state=42,
)
gb.fit(X_train, y_train)

y_pred = gb.predict(X_test)
mae  = mean_absolute_error(y_test, y_pred)
rmse = mean_squared_error(y_test, y_pred) ** 0.5
r2   = r2_score(y_test, y_pred)

cv_scores = cross_val_score(gb, X, y, cv=5, scoring="r2")

print(f"\n{'='*45}")
print(f"  MAE  : ${mae:>10,.0f}")
print(f"  RMSE : ${rmse:>10,.0f}")
print(f"  R²   : {r2:.4f}")
print(f"  CV R²: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
print(f"{'='*45}")

# ── Save ───────────────────────────────────────────────────
os.makedirs(MODEL_DIR, exist_ok=True)
joblib.dump(gb,       os.path.join(MODEL_DIR, "model.pkl"))
joblib.dump(encoders, os.path.join(MODEL_DIR, "encoders.pkl"))
joblib.dump(FEATURES, os.path.join(MODEL_DIR, "features.pkl"))
print(f"\n✅ Saved model.pkl, encoders.pkl, features.pkl → {MODEL_DIR}")
