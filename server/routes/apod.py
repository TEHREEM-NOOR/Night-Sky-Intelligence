"""
APOD route — /api/apod
Returns today's NASA Astronomy Picture of the Day.
"""

from fastapi import APIRouter
from fastapi.responses import JSONResponse
import sys, os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from apis.apod import get_apod

router = APIRouter()


@router.get("/api/apod")
def apod_data():
    api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
    apod = get_apod(api_key)
    return JSONResponse(content={"apod": apod})