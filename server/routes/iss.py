"""
ISS route — /api/iss
Returns current ISS position and next 3 passes for a given lat/lng.
"""

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import sys, os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from apis.iss import get_iss_position, get_iss_passes

router = APIRouter()


@router.get("/api/iss")
def iss_data(lat: float = Query(...), lng: float = Query(...)):
    position = get_iss_position()
    passes = get_iss_passes(lat, lng)
    return JSONResponse(content={"position": position, "passes": passes})