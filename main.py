import sys
import os
import argparse
from dotenv import load_dotenv

load_dotenv()

from core import cache
from apis import geocode, iss, asteroids, weather, apod
from core.moon import get_moon_phase
from core.verdict import calculate_verdict
from display import dashboard

BANNED_CHARS = set("<>{}\\")

def validate_city(city: str) -> str | None:
    if not city or not city.strip():
        return "Error: City name cannot be empty."
    if len(city) > 100:
        return "Error: City name is too long (max 100 characters)."
    if any(c in BANNED_CHARS for c in city):
        return "Error: City name contains invalid characters."
    return None

def main():
    parser = argparse.ArgumentParser(
        description="Night Sky Intelligence Terminal — what is happening in the sky above your city tonight?"
    )
    parser.add_argument("--city", required=True, help="City name (e.g. 'Lahore')")
    parser.add_argument("--days", type=int, default=7, choices=range(1, 8), metavar="1-7",
                        help="Asteroid window in days (1–7, default 7)")
    parser.add_argument("--no-cache", action="store_true", help="Ignore cache and force fresh API calls")
    args = parser.parse_args()

    error = validate_city(args.city)
    if error:
        print(error, file=sys.stderr)
        sys.exit(1)

    if args.no_cache:
        cache.delete_all()
        print("[cache] Cache cleared. Fetching fresh data...\n")

    city_name = args.city.strip()
    print(f"Fetching data for {city_name}...")

    geo = geocode.get_coordinates(city_name)
    if geo is None:
        print("Error: Could not connect to geocoding service.", file=sys.stderr)
        sys.exit(1)

    if geo.get("error") == "not_found":
        suggestions = geo.get("suggestions", [])
        print(f"City not found: '{city_name}'", file=sys.stderr)
        if suggestions:
            print(f"Did you mean: {', '.join(suggestions)}?", file=sys.stderr)
        sys.exit(1)

    lat = geo["lat"]
    lng = geo["lng"]
    display_name = geo.get("display_name", city_name).split(",")[0].strip()

    iss_position = iss.get_iss_position()
    iss_passes = iss.get_iss_passes(lat, lng)
    neos = asteroids.get_neos(days=args.days)
    weather_data = weather.get_tonight_weather(lat, lng)
    apod_data = apod.get_apod()
    moon = get_moon_phase()

    iss_pass_tonight = False
    if iss_passes:
        iss_pass_tonight = any(p.get("tonight") for p in iss_passes)

    cloud_cover = weather_data["cloud_cover_pct"] if weather_data else 75
    moon_illumination = moon["illumination_pct"] if moon else 50

    verdict = calculate_verdict(cloud_cover, moon_illumination, iss_pass_tonight)

    data = {
        "iss_position": iss_position,
        "iss_passes": iss_passes,
        "neos": neos,
        "weather": weather_data,
        "moon": moon,
        "apod": apod_data,
        "verdict": verdict
    }

    dashboard.render(display_name, data)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nExited.", file=sys.stderr)
        sys.exit(0)
    except Exception as e:
        print(f"\nUnexpected error: {e}", file=sys.stderr)
        sys.exit(1)