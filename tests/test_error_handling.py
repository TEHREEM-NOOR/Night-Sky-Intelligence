import pytest
from unittest.mock import patch, MagicMock
from core.verdict import calculate_verdict
from core.moon import get_moon_phase

def test_verdict_with_no_weather_defaults():
    result = calculate_verdict(75, 50, False)
    assert result["score"] >= 1

def test_dashboard_renders_with_all_none(capsys):
    from display.dashboard import render
    data = {
        "iss_position": None,
        "iss_passes": None,
        "neos": None,
        "weather": None,
        "moon": get_moon_phase(),
        "apod": None,
        "verdict": calculate_verdict(75, 50, False)
    }
    render("Test City", data)
    captured = capsys.readouterr()
    assert "unavailable" in captured.out.lower() or len(captured.out) > 0

def test_dashboard_renders_with_partial_data(capsys):
    from display.dashboard import render
    data = {
        "iss_position": {"lat": 10.0, "lng": 20.0, "location": "Indian Ocean"},
        "iss_passes": None,
        "neos": [],
        "weather": {"cloud_cover_pct": 30, "cloud_label": "Partly Cloudy", "wind_kmh": 10.0},
        "moon": get_moon_phase(),
        "apod": None,
        "verdict": calculate_verdict(30, 40, False)
    }
    render("Lahore", data)
    captured = capsys.readouterr()
    assert len(captured.out) > 0

def test_cache_miss_does_not_crash():
    from core.cache import get
    result = get("nonexistent_key_xyz", 60)
    assert result is None

def test_empty_neo_list_renders():
    from display.dashboard import _neo_panel
    panel = _neo_panel([])
    assert panel is not None

def test_none_neo_renders():
    from display.dashboard import _neo_panel
    panel = _neo_panel(None)
    assert panel is not None