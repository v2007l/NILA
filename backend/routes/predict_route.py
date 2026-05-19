from fastapi import APIRouter
from pydantic import BaseModel
import pickle
import numpy as np
import os
from datetime import datetime

router = APIRouter()

model_path = os.path.join(os.path.dirname(__file__), "../model.pkl")

def load_model():
    with open(model_path, 'rb') as f:
        return pickle.load(f)

class PredictRequest(BaseModel):
    lat: float
    lng: float
    incidents: int

@router.post("/predict")
def predict_danger(data: PredictRequest):
    try:
        model = load_model()
        now = datetime.now()
        hour = now.hour
        day_of_week = now.weekday()
        month = now.month

        features = np.array([[
            data.lat,
            data.lng,
            hour,
            day_of_week,
            month,
            data.incidents
        ]])

        score = model.predict(features)[0]
        score = max(0, min(100, float(score)))

        if score >= 70:
            level = 'high'
        elif score >= 40:
            level = 'medium'
        else:
            level = 'low'

        return {
            "status": "success",
            "lat": data.lat,
            "lng": data.lng,
            "danger_score": round(score, 2),
            "level": level,
            "hour": hour,
            "day_of_week": day_of_week,
            "month": month
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/predict-all")
def predict_all_zones():
    zones = [
        {"area": "Gandhipuram", "lat": 11.0168, "lng": 76.9558, "incidents": 24},
        {"area": "RS Puram", "lat": 11.0050, "lng": 76.9612, "incidents": 12},
        {"area": "Peelamedu", "lat": 11.0230, "lng": 76.9850, "incidents": 4},
        {"area": "Ukkadam", "lat": 11.0120, "lng": 76.9400, "incidents": 31},
        {"area": "Saibaba Colony", "lat": 11.0310, "lng": 76.9700, "incidents": 9},
    ]

    try:
        model = load_model()
        now = datetime.now()
        hour = now.hour
        day_of_week = now.weekday()
        month = now.month

        results = []
        for i, zone in enumerate(zones):
            features = np.array([[
                zone["lat"],
                zone["lng"],
                hour,
                day_of_week,
                month,
                zone["incidents"]
            ]])

            score = model.predict(features)[0]
            score = max(0, min(100, float(score)))

            if score >= 70:
                level = 'high'
            elif score >= 40:
                level = 'medium'
            else:
                level = 'low'

            results.append({
                "id": i + 1,
                "area": zone["area"],
                "lat": zone["lat"],
                "lng": zone["lng"],
                "radius": 400,
                "incidents": zone["incidents"],
                "danger_score": round(score, 2),
                "level": level,
                "last_updated": now.strftime("%Y-%m-%d")
            })

        return {"status": "success", "data": results}

    except Exception as e:
        return {"status": "error", "message": str(e)}