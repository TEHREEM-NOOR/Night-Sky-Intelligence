"""
Asteroids route — /api/asteroids
Returns near-Earth objects for the requested date range.
"""

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import sys, os
from datetime import date

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from apis.asteroids import get_neos

router = APIRouter()


@router.get("/api/asteroids")
def asteroids_data(
    start_date: str = Query(default=str(date.today())),
    days: int = Query(default=7, ge=1, le=7),
):
    neos = get_neos(start_date, days)
    return JSONResponse(content={"neos": neos})