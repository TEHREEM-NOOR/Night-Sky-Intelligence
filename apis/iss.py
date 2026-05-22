from datetime import datetime, timezone
from core import http_client, cache
from apis.geocode import reverse_geocode

ISS_NOW_URL = "http://api.open-notify.org/iss-now.json"
ISS_PASS_URL = "http://api.open-notify.org/iss-pass.json"

POSITION_TTL = 60
PASS_TTL = 1800

def get_iss_position() -> dict | None:
    cached = cache.get("iss_position", POSITION_TTL)
    if cached:
        return cached

    data = http_client.get(ISS_NOW_URL)
    if not data:
        return None

    pos = data.get("iss_position", {})
    lat = float(pos.get("latitude", 0))
    lng = float(pos.get("longitude", 0))
    location_name = reverse_geocode(lat, lng)

    result = {
        "lat": lat,
        "lng": lng,
        "location": location_name,
        "timestamp": data.get("timestamp")
    }
    cache.set("iss_position", result, POSITION_TTL)
    return result

def get_iss_passes(lat, lng):
    """
    Open-Notify pass endpoint is unreliable since 2022.
    Returns empty list gracefully instead of crashing.
    TODO Phase 5: replace with ephem + Celestrak TLE calculation.
    """
    # cache key
    cache_key = f"iss_passes_{lat}_{lng}"
    cached = cache.get(cache_key, 86400)
    if cached:
        return cached

    response = http_client.get(
        "http://api.open-notify.org/iss-pass.json",
        params={"lat": lat, "lon": lng, "n": 3},
    )

    # endpoint is known-dead — return empty list, don't crash
    if response is None or not isinstance(response, dict):
        return []

    passes = []
    for p in response.get("response", []):
        passes.append({
            "risetime": p.get("risetime"),
            "duration_seconds": p.get("duration"),
        })

    cache.set(cache_key, passes, ttl_seconds=1800)
    return passes
def _is_tonight(dt: datetime) -> bool:
    now = datetime.now(tz=dt.tzinfo)
    same_day = dt.date() == now.date()
    evening = 18 <= dt.hour <= 23
    return same_day and evening