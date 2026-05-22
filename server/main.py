"""
server/main.py
--------------
FastAPI app. Port 7842.
Endpoints:
  GET  /api/health        — Electron polls this on startup
  GET  /api/dashboard     — Full data fetch via asyncio.gather()
  GET  /api/stream        — SSE: pushes each section as it resolves
  DELETE /api/cache       — Clears .cache/ folder (refresh button)
  + all domain routers mounted here
"""

import asyncio
import glob
import json
import os
import sys
import time
from typing import AsyncGenerator

import uvicorn
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from dotenv import load_dotenv
load_dotenv()

from apis.geocode import get_coordinates
from apis.iss import get_iss_position, get_iss_passes
from apis.asteroids import get_neos
from apis.weather import get_tonight_weather
from apis.apod import get_apod
from core.moon import get_moon_phase
from core.verdict import calculate_verdict
from datetime import date

from server.routes import iss, asteroids, weather, apod, verdict

# ── app ───────────────────────────────────────────────────────────────────────

app = FastAPI(title="night-sky-intel", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Electron uses file:// origin
    allow_methods=["*"],
    allow_headers=["*"],
)

# mount domain routers
app.include_router(iss.router)
app.include_router(asteroids.router)
app.include_router(weather.router)
app.include_router(apod.router)
app.include_router(verdict.router)


# ── helpers ───────────────────────────────────────────────────────────────────

def _cache_dir() -> str:
    return os.path.join(PROJECT_ROOT, ".cache")


async def _run_in_thread(fn, *args):
    """Run a blocking function in a thread pool so asyncio.gather works."""
    loop = asyncio.get_running_loop()   # get_running_loop() — correct for Python 3.10+
    return await loop.run_in_executor(None, fn, *args)


# ── /api/health ───────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    """Electron polls this until it returns 200, then opens the window."""
    return {"status": "ok", "timestamp": time.time()}


# ── /api/dashboard ────────────────────────────────────────────────────────────

@app.get("/api/dashboard")
async def dashboard(
    city: str = Query(..., description="City name, e.g. Lahore"),
    days: int = Query(default=7, ge=1, le=7),
):
    """
    Fetches all five data sections concurrently using asyncio.gather().
    Cuts load time from ~12s (sequential) to ~2-3s (parallel).
    Returns a single JSON object with all sections.
    """
    # Step 1 — geocode the city (must happen first, others depend on lat/lng)
    coords = await _run_in_thread(get_coordinates, city)
    if coords is None:
        return JSONResponse(
            status_code=404,
            content={"error": f"City '{city}' not found. Check spelling and try again."},
        )

    lat = coords["lat"]
    lng = coords["lng"]
    display_name = coords.get("display_name", city)
    nasa_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
    today = str(date.today())

    # Step 2 — fire all five fetchers concurrently
    iss_pos, iss_passes, neos, weather, apod, moon = await asyncio.gather(
        _run_in_thread(get_iss_position),
        _run_in_thread(get_iss_passes, lat, lng),
        _run_in_thread(get_neos, today, days),
        _run_in_thread(get_tonight_weather, lat, lng),
        _run_in_thread(get_apod),
        _run_in_thread(get_moon_phase, date.today()),
    )

    # Step 3 — calculate verdict from resolved data
    cloud_cover = weather.get("cloud_cover_avg", 0) if weather else 0
    moon_illum = moon.get("illumination_pct", 0) if moon else 0
    iss_tonight = bool(iss_passes and len(iss_passes) > 0)
    verdict = calculate_verdict(cloud_cover, moon_illum, iss_tonight)
    return JSONResponse(content={
        "city": display_name,
        "lat": lat,
        "lng": lng,
        "iss_position": iss_pos,
        "iss_passes": iss_passes,
        "asteroids": neos,
        "weather": weather,
        "apod": apod,
        "moon": moon,
        "verdict": {
            "score": verdict["score"],
            "label": verdict["label"],
            "factors": verdict["factors"]
        },
    })
    


# ── /api/stream (SSE) ─────────────────────────────────────────────────────────

@app.get("/api/stream")
async def stream(
    city: str = Query(...),
    days: int = Query(default=7, ge=1, le=7),
):
    """
    Server-Sent Events endpoint.
    Pushes each section as soon as it resolves.
    React frontend renders panels progressively — ISS appears in ~500ms,
    full dashboard in ~2-3 seconds.

    SSE format:
      data: {"section": "iss", "data": {...}}\n\n
    """

    async def event_generator() -> AsyncGenerator[str, None]:
        # geocode first — everything else needs lat/lng
        coords = await _run_in_thread(get_coordinates, city)
        if coords is None:
            yield f"data: {json.dumps({'section': 'error', 'message': f'City not found: {city}'})}\n\n"
            return

        lat = coords["lat"]
        lng = coords["lng"]
        display_name = coords.get("display_name", city)
        nasa_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
        today = str(date.today())

        yield f"data: {json.dumps({'section': 'geocode', 'data': {'city': display_name, 'lat': lat, 'lng': lng}})}\n\n"

        # create all tasks
        tasks = {
            "iss_position":  asyncio.ensure_future(_run_in_thread(get_iss_position)),
            "iss_passes":    asyncio.ensure_future(_run_in_thread(get_iss_passes, lat, lng)),
            "asteroids":     asyncio.ensure_future(_run_in_thread(get_neos, today, days)),
            "weather":       asyncio.ensure_future(_run_in_thread(get_tonight_weather, lat, lng)),
            "apod":          asyncio.ensure_future(_run_in_thread(get_apod, nasa_key)),
            "moon":          asyncio.ensure_future(_run_in_thread(get_moon_phase, date.today())),
        }

        # yield each section as it completes
        pending = dict(tasks)
        while pending:
            done, _ = await asyncio.wait(
                list(pending.values()), return_when=asyncio.FIRST_COMPLETED
            )
            for future in done:
                # find which section this future belongs to
                section_name = next(k for k, v in pending.items() if v is future)
                result = future.result()
                yield f"data: {json.dumps({'section': section_name, 'data': result})}\n\n"
                del pending[section_name]

        # once all resolved, calculate and push verdict
        weather_data = tasks["weather"].result()
        moon_data    = tasks["moon"].result()
        passes_data  = tasks["iss_passes"].result()

        cloud_cover  = weather_data.get("cloud_cover_avg", 0) if weather_data else 0
        moon_illum   = moon_data.get("illumination_pct", 0) if moon_data else 0
        iss_tonight  = bool(passes_data and len(passes_data) > 0)

        verdict = calculate_verdict(cloud_cover, moon_illum, iss_tonight)

        yield f"data: {json.dumps({'section': 'verdict', 'data': verdict})}\n\n"
        yield "data: {\"section\": \"done\"}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disables nginx buffering if behind proxy
        },
    )


# ── /api/cache DELETE ─────────────────────────────────────────────────────────

@app.delete("/api/cache")
def clear_cache():
    """Wired to the GUI refresh button. Deletes all .json files in .cache/"""
    cache_dir = _cache_dir()
    deleted = 0
    if os.path.isdir(cache_dir):
        for f in glob.glob(os.path.join(cache_dir, "*.json")):
            os.remove(f)
            deleted += 1
    return {"deleted": deleted, "message": f"Cleared {deleted} cached entries."}


# ── entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run(
        "server.main:app",
        host="127.0.0.1",
        port=7842,
        reload=False,
        log_level="info",
    )