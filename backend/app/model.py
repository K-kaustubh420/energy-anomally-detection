import joblib
import numpy as np

# Load trained model & scaler once at startup
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

def predict_energy(energy_value: float):
    X = np.array([[energy_value]])
    X_scaled = scaler.transform(X)

    prediction = model.predict(X_scaled)[0]
    score = model.decision_function(X_scaled)[0]

    return {
        "energy": energy_value,
        "status": "ANOMALY" if prediction == -1 else "NORMAL",
        "score": float(score)
    }