"""
Weather route — /api/weather
Returns tonight's cloud cover and wind speed for a lat/lng.
"""

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import sys, os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from apis.weather import get_tonight_weather

router = APIRouter()


@router.get("/api/weather")
def weather_data(lat: float = Query(...), lng: float = Query(...)):
    weather = get_tonight_weather(lat, lng)
    return JSONResponse(content={"weather": weather})