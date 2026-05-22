import math
from datetime import date

KNOWN_NEW_MOON = date(2000, 1, 6)
LUNAR_CYCLE = 29.53059

PHASES = [
    (1.85,  "New Moon",        "🌑"),
    (7.38,  "Waxing Crescent", "🌒"),
    (9.22,  "First Quarter",   "🌓"),
    (14.76, "Waxing Gibbous",  "🌔"),
    (16.61, "Full Moon",       "🌕"),
    (22.15, "Waning Gibbous",  "🌖"),
    (23.99, "Last Quarter",    "🌗"),
    (29.53, "Waning Crescent", "🌘"),
]

def get_moon_phase(target_date: date = None) -> dict:
    if target_date is None:
        target_date = date.today()
    days_since = (target_date - KNOWN_NEW_MOON).days
    cycle_day = days_since % LUNAR_CYCLE
    phase_name = "Waning Crescent"
    phase_emoji = "🌘"
    for threshold, name, emoji in PHASES:
        if cycle_day < threshold:
            phase_name = name
            phase_emoji = emoji
            break
    illumination = int((1 - math.cos(2 * math.pi * cycle_day / LUNAR_CYCLE)) / 2 * 100)
    return {
        "cycle_day": round(cycle_day, 2),
        "phase_name": phase_name,
        "phase_emoji": phase_emoji,
        "illumination_pct": illumination
    }