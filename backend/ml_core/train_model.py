import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

print("🔥 Loading Kaggle energy dataset...")

# Load Kaggle dataset (FAST)
df = pd.read_csv("ml_core/data/KAG_energydata_complete.csv")

print("📊 Dataset loaded")

# Use ONLY the energy column
df = df[["Appliances"]].dropna()

# Rename for clarity
df.columns = ["energy"]

# Sample for speed (VERY IMPORTANT)
df = df.sample(
    n=min(10000, len(df)),
    random_state=42
)


print("🧠 Training Isolation Forest model...")

# Scale data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)

# Train model
model = IsolationForest(
    n_estimators=50,
    contamination=0.05,
    random_state=42
)

model.fit(X_scaled)

# Save trained artifacts
joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("✅ Model trained and saved successfully")
