"""
Verdict route — /api/verdict
Calculates the stargazing verdict score from weather + moon + ISS data.
"""

from fastapi import APIRouter, Body
from fastapi.responses import JSONResponse
import sys, os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from core.verdict import calculate_verdict

router = APIRouter()


@router.post("/api/verdict")
def verdict_data(payload: dict = Body(...)):
    """
    Expects JSON body:
    {
        "cloud_cover": 40,
        "moon_illumination": 25,
        "iss_pass_tonight": true
    }
    """
    score, factors = calculate_verdict(
        cloud_cover=payload.get("cloud_cover", 0),
        moon_illumination=payload.get("moon_illumination", 0),
        iss_pass_tonight=payload.get("iss_pass_tonight", False),
    )
    return JSONResponse(content={"score": score, "factors": factors})