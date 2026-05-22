import pytest
from unittest.mock import patch
from datetime import date
from apis.asteroids import get_neos

MOCK_NASA_RESPONSE = {
    "near_earth_objects": {
        "2024-01-01": [
            {
                "name": "(2024 AA1)",
                "estimated_diameter": {"meters": {"estimated_diameter_min": 80.0, "estimated_diameter_max": 120.0}},
                "close_approach_data": [{"miss_distance": {"astronomical": "0.00514"}, "relative_velocity": {"kilometers_per_second": "18.5"}, "close_approach_date_full": "2024-Jan-01 12:00"}],
                "is_potentially_hazardous_asteroid": False
            },
            {
                "name": "(2024 BB2)",
                "estimated_diameter": {"meters": {"estimated_diameter_min": 300.0, "estimated_diameter_max": 400.0}},
                "close_approach_data": [{"miss_distance": {"astronomical": "0.00257"}, "relative_velocity": {"kilometers_per_second": "25.0"}, "close_approach_date_full": "2024-Jan-01 15:00"}],
                "is_potentially_hazardous_asteroid": True
            }
        ]
    }
}

def test_neos_parsed_correctly():
    with patch("core.http_client.get", return_value=MOCK_NASA_RESPONSE):
        with patch("core.cache.get", return_value=None):
            with patch("core.cache.set"):
                with patch("os.getenv", return_value="DEMO_KEY"):
                    result = get_neos(date(2024, 1, 1), 1)
    assert len(result) == 2

def test_hazardous_flag():
    with patch("core.http_client.get", return_value=MOCK_NASA_RESPONSE):
        with patch("core.cache.get", return_value=None):
            with patch("core.cache.set"):
                with patch("os.getenv", return_value="DEMO_KEY"):
                    result = get_neos(date(2024, 1, 1), 1)
    hazardous = [n for n in result if n["is_hazardous"]]
    assert len(hazardous) == 1

def test_sorted_by_miss_distance():
    with patch("core.http_client.get", return_value=MOCK_NASA_RESPONSE):
        with patch("core.cache.get", return_value=None):
            with patch("core.cache.set"):
                with patch("os.getenv", return_value="DEMO_KEY"):
                    result = get_neos(date(2024, 1, 1), 1)
    distances = [n["miss_distance_moon"] for n in result]
    assert distances == sorted(distances)

def test_api_failure_returns_none():
    with patch("core.http_client.get", return_value=None):
        with patch("core.cache.get", return_value=None):
            with patch("os.getenv", return_value="DEMO_KEY"):
                result = get_neos(date(2024, 1, 1), 1)
    assert result is None