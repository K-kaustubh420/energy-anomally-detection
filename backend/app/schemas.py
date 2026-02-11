from pydantic import BaseModel
from typing import List

# For real-time single readings
class EnergyInput(BaseModel):
    energy: float

class PredictionResponse(BaseModel):
    energy: float
    status: str
    score: float

# For the 60-second window analysis
class WindowInput(BaseModel):
    readings: List[float]

class AnalyticsResponse(BaseModel):
    avg_load: float
    max_load: float
    anomaly_ratio: float
    diagnostic: str
    recommendation: str