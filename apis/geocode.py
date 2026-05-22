import sys
from core import http_client, cache

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse"
HEADERS = {"User-Agent": "night-sky-intel/1.0"}
CACHE_TTL = 86400 * 365

def get_coordinates(city_name: str) -> dict | None:
    cache_key = f"geocode_{city_name.lower().strip()}"
    cached = cache.get(cache_key, CACHE_TTL)
    if cached:
        return cached

    data = http_client.get(
        NOMINATIM_URL,
        params={"q": city_name, "format": "json", "limit": 1},
        headers=HEADERS
    )

    if data is None:
        return None

    if len(data) == 0:
        suggestions = _get_suggestions(city_name)
        return {"error": "not_found", "suggestions": suggestions}

    result = data[0]
    output = {
        "lat": float(result["lat"]),
        "lng": float(result["lon"]),
        "display_name": result.get("display_name", city_name),
        "city": city_name
    }
    cache.set(cache_key, output, CACHE_TTL)
    return output

def _get_suggestions(city_name: str) -> list[str]:
    words = city_name.strip().split()
    query = words[0] if words else city_name
    data = http_client.get(
        NOMINATIM_URL,
        params={"q": query, "format": "json", "limit": 3},
        headers=HEADERS
    )
    if not data:
        return []
    suggestions = []
    for item in data[:3]:
        name = item.get("display_name", "")
        short = name.split(",")[0].strip()
        if short and short.lower() != city_name.lower():
            suggestions.append(short)
    return suggestions

def reverse_geocode(lat: float, lng: float) -> str:
    cache_key = f"reverse_{round(lat, 2)}_{round(lng, 2)}"
    cached = cache.get(cache_key, 86400)
    if cached:
        return cached.get("name", "Unknown location")

    data = http_client.get(
        NOMINATIM_REVERSE_URL,
        params={"lat": lat, "lon": lng, "format": "json"},
        headers=HEADERS
    )
    if not data:
        return "Unknown location"

    address = data.get("address", {})
    name = (
        address.get("country")
        or address.get("state")
        or address.get("ocean")
        or address.get("sea")
        or data.get("display_name", "Unknown location").split(",")[0]
    )
    cache.set(cache_key, {"name": name}, 86400)
    return name