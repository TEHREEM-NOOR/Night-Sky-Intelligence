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

def get_iss_passes(lat: float, lng: float) -> list | None:
    cache_key = f"iss_passes_{round(lat, 2)}_{round(lng, 2)}"
    cached = cache.get(cache_key, PASS_TTL)
    if cached:
        return cached

    data = http_client.get(
        ISS_PASS_URL,
        params={"lat": lat, "lon": lng, "n": 3}
    )
    if not data or "response" not in data:
        return None

    passes = []
    for p in data["response"]:
        rise_ts = p.get("risetime", 0)
        duration_s = p.get("duration", 0)
        rise_dt = datetime.fromtimestamp(rise_ts, tz=timezone.utc).astimezone()
        minutes = duration_s // 60
        seconds = duration_s % 60
        passes.append({
            "risetime_ts": rise_ts,
            "risetime_local": rise_dt.strftime("%H:%M %Z"),
            "risetime_date": rise_dt.strftime("%a %d %b"),
            "duration_seconds": duration_s,
            "duration_display": f"{minutes} min {seconds} sec",
            "tonight": _is_tonight(rise_dt)
        })

    cache.set(cache_key, passes, PASS_TTL)
    return passes

def _is_tonight(dt: datetime) -> bool:
    now = datetime.now(tz=dt.tzinfo)
    same_day = dt.date() == now.date()
    evening = 18 <= dt.hour <= 23
    return same_day and evening