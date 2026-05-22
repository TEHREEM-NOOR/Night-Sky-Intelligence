from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from core.verdict import calculate_verdict

router = APIRouter()


class VerdictRequest(BaseModel):
    cloud_cover_pct: int
    moon_illumination_pct: int
    iss_pass_tonight: bool


@router.post("/api/verdict")
def get_verdict(payload: VerdictRequest):
    result = calculate_verdict(
        payload.cloud_cover_pct,
        payload.moon_illumination_pct,
        payload.iss_pass_tonight
    )
    return JSONResponse(content=result)

LABELS = {
    5: "★★★★★ PERFECT NIGHT",
    4: "★★★★☆ GREAT NIGHT",
    3: "★★★☆☆ DECENT NIGHT",
    2: "★★☆☆☆ POOR CONDITIONS",
    1: "★☆☆☆☆ STAY INSIDE",
}

def calculate_verdict(cloud_cover_pct: int, moon_illumination_pct: int, iss_pass_tonight: bool):
    score = 0
    factors = []

    # CLOUDS
    if cloud_cover_pct <= 25:
        score += 2
        factors.append("✓ Clear skies forecast")
    elif cloud_cover_pct <= 50:
        score += 1
        factors.append("~ Partly cloudy tonight")
    else:
        factors.append("✗ Heavy cloud cover tonight")

    # MOON
    if moon_illumination_pct < 40:
        score += 1
        factors.append("✓ Dark moon — ideal for stars")
    elif moon_illumination_pct > 80:
        score -= 1
        factors.append("✗ Bright moon — washes out stars")
    else:
        factors.append("~ Moderate moonlight")

    # ISS
    if iss_pass_tonight:
        score += 1
        factors.append("✓ ISS passes overhead tonight")
    else:
        factors.append("— No ISS pass tonight")

    score = max(1, min(5, score))

    return {
        "score": score,
        "label": LABELS.get(score, "UNKNOWN NIGHT"),
        "factors": factors
    }