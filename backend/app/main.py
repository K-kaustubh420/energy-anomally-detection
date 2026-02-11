from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from app.schemas import EnergyInput, PredictionResponse, WindowInput, AnalyticsResponse
from app.model import predict_energy, model, scaler # Import model/scaler for window logic

app = FastAPI(title="Energy Anomaly Detection API")

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict", response_model=PredictionResponse)
def predict(data: EnergyInput):
    """
    Receives single energy input from frontend
    """
    return predict_energy(data.energy)

@app.post("/analyze-window", response_model=AnalyticsResponse)
def analyze_window(data: WindowInput):
    """
    Analyzes a 30-60 second window of data
    """
    readings = data.readings
    if not readings:
        return {
            "avg_load": 0, "max_load": 0, "anomaly_ratio": 0,
            "diagnostic": "No data", "recommendation": "N/A"
        }

    avg_val = sum(readings) / len(readings)
    max_val = max(readings)
    
    # Run bulk inference on the window
    anomalies = 0
    for v in readings:
        X = np.array([[v]])
        X_scaled = scaler.transform(X)
        if model.predict(X_scaled)[0] == -1:
            anomalies += 1
            
    ratio = (anomalies / len(readings)) * 100
    
    # Diagnostic Intelligence
    if ratio > 50:
        diag = "Critical Sustained Anomaly"
        rec = "High frequency of spikes detected. Potential hardware failure or short circuit imminent."
    elif ratio > 10:
        diag = "Unstable Load Pattern"
        rec = "Fluctuating energy draw. Check for loose connections or inefficient standby appliances."
    else:
        diag = "System Healthy"
        rec = "Load is stable. No anomalies detected within this temporal window."

    return {
        "avg_load": round(avg_val, 2),
        "max_load": round(max_val, 2),
        "anomaly_ratio": round(ratio, 2),
        "diagnostic": diag,
        "recommendation": rec
    }