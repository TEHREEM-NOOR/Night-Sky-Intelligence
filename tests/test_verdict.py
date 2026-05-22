import pytest
from core.verdict import calculate_verdict

def test_perfect_night():
    result = calculate_verdict(10, 20, True)
    assert result["score"] == 4

def test_clear_sky_adds_two():
    r1 = calculate_verdict(10, 50, False)
    r2 = calculate_verdict(60, 50, False)
    assert r1["score"] > r2["score"]

def test_bright_moon_subtracts():
    r1 = calculate_verdict(10, 90, False)
    r2 = calculate_verdict(10, 50, False)
    assert r1["score"] < r2["score"]

def test_score_clamp_minimum():
    result = calculate_verdict(100, 100, False)
    assert result["score"] >= 1

def test_score_clamp_maximum():
    result = calculate_verdict(0, 0, True)
    assert result["score"] <= 5

def test_iss_pass_adds_one():
    r1 = calculate_verdict(60, 50, True)
    r2 = calculate_verdict(60, 50, False)
    assert r1["score"] == r2["score"] + 1

def test_label_present():
    result = calculate_verdict(10, 20, True)
    assert "★" in result["label"]

def test_factors_not_empty():
    result = calculate_verdict(30, 50, False)
    assert len(result["factors"]) > 0