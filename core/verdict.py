LABELS = {
    5: "★★★★★  PERFECT NIGHT",
    4: "★★★★☆  GREAT NIGHT",
    3: "★★★☆☆  DECENT NIGHT",
    2: "★★☆☆☆  POOR CONDITIONS",
    1: "★☆☆☆☆  STAY INSIDE",
}

def calculate_verdict(cloud_cover_pct: int, moon_illumination_pct: int, iss_pass_tonight: bool):

    factors = []

    # ---------------- BASE SCORE ----------------
    base_score = 0

    # CLOUDS
    if cloud_cover_pct <= 25:
        base_score += 2
        factors.append("✓ Clear skies forecast")
    elif cloud_cover_pct <= 50:
        base_score += 1
        factors.append("~ Partly cloudy tonight")
    else:
        base_score -= 1
        factors.append("✗ Heavy cloud cover tonight")

    # MOON
    if moon_illumination_pct < 40:
        base_score += 1
        factors.append("✓ Dark moon — ideal for stars")
    elif moon_illumination_pct > 80:
        base_score -= 1
        factors.append("✗ Bright moon — washes out stars")
    else:
        factors.append("~ Moderate moonlight")

    # ---------------- FINAL SCORE ----------------
    score_without_iss = max(1, min(5, base_score))

    # IMPORTANT: ISS is PURE +1 bonus
    if iss_pass_tonight:
        score_with_iss = min(5, score_without_iss + 1)
    else:
        score_with_iss = score_without_iss

    return {
        "score": score_with_iss,
        "label": LABELS[score_with_iss],
        "factors": factors
    }