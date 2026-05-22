LABELS = {
    5: "★★★★★  PERFECT NIGHT",
    4: "★★★★☆  GREAT NIGHT",
    3: "★★★☆☆  DECENT NIGHT",
    2: "★★☆☆☆  POOR CONDITIONS",
    1: "★☆☆☆☆  STAY INSIDE",
}

def calculate_verdict(
    cloud_cover_pct: int,
    moon_illumination_pct: int,
    iss_pass_tonight: bool
) -> dict:
    score = 0
    factors = []

    if cloud_cover_pct <= 25:
        score += 2
        factors.append("✓  Clear skies forecast")
    elif cloud_cover_pct <= 50:
        score += 1
        factors.append("~  Partly cloudy tonight")
    else:
        factors.append("✗  Heavy cloud cover tonight")

    if iss_pass_tonight:
        score += 1
        factors.append("✓  ISS passes overhead tonight")
    else:
        factors.append("—  No ISS pass tonight")

    if moon_illumination_pct < 40:
        score += 1
        factors.append("✓  Dark moon — good for stars")
    elif moon_illumination_pct > 80:
        score -= 1
        factors.append("✗  Bright moon — washes out stars")
    else:
        factors.append("~  Partial moon")

    score = max(1, min(5, score))
    return {
        "score": score,
        "label": LABELS[score],
        "factors": factors
    }