import os
from datetime import date, timedelta
from core import http_client, cache
from core.scales import asteroid_size_label, miss_distance_moon, velocity_display

NEO_URL = "https://api.nasa.gov/neo/rest/v1/feed"
CACHE_TTL = 10800

def get_neos(start_date: date = None, days: int = 7) -> list | None:
    if start_date is None:
        start_date = date.today()
    end_date = start_date + timedelta(days=days - 1)

    cache_key = f"neos_{start_date.isoformat()}_{days}"
    cached = cache.get(cache_key, CACHE_TTL)
    if cached:
        return cached

    api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
    data = http_client.get(
        NEO_URL,
        params={
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "api_key": api_key
        }
    )
    if not data:
        return None

    all_neos = []
    neo_dates = data.get("near_earth_objects", {})
    for date_key, neo_list in neo_dates.items():
        for neo in neo_list:
            try:
                approach = neo["close_approach_data"][0]
                diam_min = neo["estimated_diameter"]["meters"]["estimated_diameter_min"]
                diam_max = neo["estimated_diameter"]["meters"]["estimated_diameter_max"]
                avg_diameter = (diam_min + diam_max) / 2
                miss_au = float(approach["miss_distance"]["astronomical"])
                velocity_kms = float(approach["relative_velocity"]["kilometers_per_second"])

                all_neos.append({
                    "name": neo.get("name", "Unknown"),
                    "diameter_m": round(avg_diameter, 1),
                    "size_label": asteroid_size_label(avg_diameter),
                    "miss_distance_moon": miss_distance_moon(miss_au),
                    "velocity": velocity_display(velocity_kms),
                    "close_approach_date": approach.get("close_approach_date_full", date_key),
                    "is_hazardous": neo.get("is_potentially_hazardous_asteroid", False)
                })
            except (KeyError, IndexError, ValueError):
                continue

    all_neos.sort(key=lambda x: x["miss_distance_moon"])

    if len(all_neos) > 10:
        all_neos = all_neos[:5]

    cache.set(cache_key, all_neos, CACHE_TTL)
    return all_neos