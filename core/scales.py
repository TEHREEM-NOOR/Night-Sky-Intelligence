AU_TO_MOON_DISTANCE = 0.00257

def asteroid_size_label(diameter_meters: float) -> str:
    if diameter_meters < 50:
        return "as wide as a football field"
    if diameter_meters < 150:
        return "as tall as the Eiffel Tower"
    if diameter_meters < 500:
        return "as tall as the Burj Khalifa"
    if diameter_meters < 2000:
        return "as wide as a small city"
    return "city-killer scale"

def miss_distance_moon(au_distance: float) -> float:
    return round(au_distance / AU_TO_MOON_DISTANCE, 1)

def velocity_display(km_per_second: float) -> str:
    return f"{round(km_per_second, 1)} km/s"