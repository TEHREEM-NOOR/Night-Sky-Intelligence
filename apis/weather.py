from datetime import date
from core import http_client, cache

WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
CACHE_TTL = 600

CLOUD_LABELS = [
    (25,  "Clear ✓"),
    (50,  "Partly Cloudy"),
    (75,  "Mostly Cloudy"),
    (100, "Overcast ✗"),
]

def get_tonight_weather(lat: float, lng: float) -> dict | None:
    cache_key = f"weather_{round(lat, 3)}_{round(lng, 3)}"
    cached = cache.get(cache_key, CACHE_TTL)
    if cached:
        return cached

    data = http_client.get(
        WEATHER_URL,
        params={
            "latitude": lat,
            "longitude": lng,
            "hourly": "cloudcover,windspeed_10m",
            "forecast_days": 2,
            "timezone": "auto"
        }
    )
    if not data:
        return None

    hourly = data.get("hourly", {})
    times = hourly.get("time", [])
    cloud_values = hourly.get("cloudcover", [])
    wind_values = hourly.get("windspeed_10m", [])

    tonight_cloud = []
    tonight_wind = None
    today_str = date.today().isoformat()

    for i, t in enumerate(times):
        if not t.startswith(today_str):
            continue
        hour = int(t[11:13])
        if 20 <= hour <= 23:
            if i < len(cloud_values) and cloud_values[i] is not None:
                tonight_cloud.append(cloud_values[i])
            if hour == 21 and i < len(wind_values) and wind_values[i] is not None:
                tonight_wind = wind_values[i]

    avg_cloud = int(sum(tonight_cloud) / len(tonight_cloud)) if tonight_cloud else 0
    cloud_label = "Clear ✓"
    for threshold, label in CLOUD_LABELS:
        if avg_cloud <= threshold:
            cloud_label = label
            break

    result = {
        "cloud_cover_pct": avg_cloud,
        "cloud_label": cloud_label,
        "wind_kmh": round(tonight_wind, 1) if tonight_wind is not None else 0.0
    }
    cache.set(cache_key, result, CACHE_TTL)
    return result