import pytest
from datetime import date
from core.moon import get_moon_phase

def test_new_moon():
    result = get_moon_phase(date(2000, 1, 6))
    assert result["phase_name"] == "New Moon"
    assert result["phase_emoji"] == "🌑"

def test_full_moon():
    result = get_moon_phase(date(2000, 1, 21))
    assert result["phase_name"] == "Full Moon"
    assert result["phase_emoji"] == "🌕"

def test_waxing_crescent():
    result = get_moon_phase(date(2000, 1, 10))
    assert result["phase_name"] in ("Waxing Crescent", "First Quarter")

def test_illumination_range():
    for d in range(1, 30):
        result = get_moon_phase(date(2024, 1, d))
        assert 0 <= result["illumination_pct"] <= 100

def test_cycle_day_range():
    result = get_moon_phase(date(2024, 6, 15))
    assert 0 <= result["cycle_day"] < 29.53059

def test_default_date_is_today():
    result = get_moon_phase()
    assert "phase_name" in result
    assert "illumination_pct" in result