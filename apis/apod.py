import os
from core import http_client, cache

APOD_URL = "https://api.nasa.gov/planetary/apod"
CACHE_TTL = 21600

def get_apod(api_key=None) -> dict | None:
    cached = cache.get("apod_today", CACHE_TTL)
    if cached:
        return cached

    if api_key is None:
        api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")

    data = http_client.get(
        APOD_URL,
        params={"api_key": api_key}
    )
    if not data:
        return None

    media_type = data.get("media_type", "image")
    explanation = data.get("explanation", "")
    truncated = explanation[:120] + "..." if len(explanation) > 120 else explanation

    result = {
        "title": data.get("title", "No title"),
        "explanation": truncated,
        "media_type": media_type,
        "url": data.get("url", ""),
        "is_video": media_type == "video"
    }
    cache.set("apod_today", result, CACHE_TTL)
    return result