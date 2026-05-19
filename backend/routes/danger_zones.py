from fastapi import APIRouter
import json
import os

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/zones.json")

@router.get("/danger-zones")
def get_danger_zones():
    with open(DATA_PATH, "r") as f:
        zones = json.load(f)
    return {"status": "success", "data": zones}

@router.get("/danger-zones/{level}")
def get_zones_by_level(level: str):
    with open(DATA_PATH, "r") as f:
        zones = json.load(f)
    filtered = [z for z in zones if z["level"] == level]
    return {"status": "success", "level": level, "data": filtered}