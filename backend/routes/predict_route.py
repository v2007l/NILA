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
        # --- COIMBATORE ---
        {"area": "Gandhipuram", "lat": 11.0168, "lng": 76.9558, "incidents": 24, "district": "Coimbatore"},
        {"area": "RS Puram", "lat": 11.0050, "lng": 76.9612, "incidents": 12, "district": "Coimbatore"},
        {"area": "Peelamedu", "lat": 11.0230, "lng": 76.9850, "incidents": 4, "district": "Coimbatore"},
        {"area": "Ukkadam", "lat": 11.0120, "lng": 76.9400, "incidents": 31, "district": "Coimbatore"},
        {"area": "Saibaba Colony", "lat": 11.0310, "lng": 76.9700, "incidents": 9, "district": "Coimbatore"},
        {"area": "Singanallur", "lat": 11.0000, "lng": 76.9800, "incidents": 18, "district": "Coimbatore"},
        {"area": "Kovaipudur", "lat": 10.9800, "lng": 76.9300, "incidents": 6, "district": "Coimbatore"},
        {"area": "Vadavalli", "lat": 11.0100, "lng": 76.9100, "incidents": 8, "district": "Coimbatore"},
        {"area": "Sundarapuram", "lat": 10.9950, "lng": 76.9450, "incidents": 14, "district": "Coimbatore"},
        {"area": "Kurichi", "lat": 10.9880, "lng": 76.9600, "incidents": 20, "district": "Coimbatore"},

        # --- ERODE ---
        {"area": "Erode Bus Stand", "lat": 11.3410, "lng": 77.7172, "incidents": 22, "district": "Erode"},
        {"area": "Perundurai", "lat": 11.2750, "lng": 77.5870, "incidents": 10, "district": "Erode"},
        {"area": "Bhavani", "lat": 11.4470, "lng": 77.6830, "incidents": 15, "district": "Erode"},
        {"area": "Gobichettipalayam", "lat": 11.4540, "lng": 77.4350, "incidents": 8, "district": "Erode"},
        {"area": "Erode Market", "lat": 11.3480, "lng": 77.7280, "incidents": 28, "district": "Erode"},
        {"area": "Chennimalai", "lat": 11.2990, "lng": 77.6050, "incidents": 5, "district": "Erode"},

        # --- THENI ---
        {"area": "Theni Town", "lat": 10.0104, "lng": 77.4770, "incidents": 16, "district": "Theni"},
        {"area": "Bodinayakanur", "lat": 10.0110, "lng": 77.3510, "incidents": 11, "district": "Theni"},
        {"area": "Periyakulam", "lat": 10.1150, "lng": 77.5410, "incidents": 9, "district": "Theni"},
        {"area": "Uthamapalayam", "lat": 9.8060, "lng": 77.3240, "incidents": 7, "district": "Theni"},
        {"area": "Andipatti", "lat": 9.9780, "lng": 77.6200, "incidents": 13, "district": "Theni"},

        # --- MADURAI ---
        {"area": "Madurai Junction", "lat": 9.9195, "lng": 78.1193, "incidents": 35, "district": "Madurai"},
        {"area": "Mattuthavani", "lat": 9.9400, "lng": 78.1100, "incidents": 20, "district": "Madurai"},
        {"area": "Tallakulam", "lat": 9.9320, "lng": 78.1350, "incidents": 17, "district": "Madurai"},
        {"area": "Anna Nagar Madurai", "lat": 9.9600, "lng": 78.0900, "incidents": 8, "district": "Madurai"},
        {"area": "Palanganatham", "lat": 9.8980, "lng": 78.1250, "incidents": 25, "district": "Madurai"},
        {"area": "Kochadai", "lat": 9.9500, "lng": 78.0700, "incidents": 12, "district": "Madurai"},
        {"area": "Villapuram Madurai", "lat": 9.9100, "lng": 78.1500, "incidents": 19, "district": "Madurai"},
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
                "district": zone["district"],
                "last_updated": now.strftime("%Y-%m-%d")
            })

        return {"status": "success", "data": results}

    except Exception as e:
        return {"status": "error", "message": str(e)}