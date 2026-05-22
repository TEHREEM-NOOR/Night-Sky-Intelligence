import pytest
from unittest.mock import patch
from apis.geocode import get_coordinates, _get_suggestions

def test_city_found():
    mock_response = [{"lat": "31.5497", "lon": "74.3436", "display_name": "Lahore, Punjab, Pakistan"}]
    with patch("core.http_client.get", return_value=mock_response):
        with patch("core.cache.get", return_value=None):
            with patch("core.cache.set"):
                result = get_coordinates("Lahore")
    assert result["lat"] == 31.5497
    assert result["lng"] == 74.3436

def test_city_not_found_returns_suggestions():
    with patch("core.http_client.get", return_value=[]):
        with patch("core.cache.get", return_value=None):
            with patch("apis.geocode._get_suggestions", return_value=["Xyzabad", "Xyztok"]):
                result = get_coordinates("xyz123invalidcity")
    assert result["error"] == "not_found"
    assert isinstance(result["suggestions"], list)

def test_api_failure_returns_none():
    with patch("core.http_client.get", return_value=None):
        with patch("core.cache.get", return_value=None):
            result = get_coordinates("Lahore")
    assert result is None

def test_cache_hit_skips_api():
    cached = {"lat": 31.5, "lng": 74.3, "display_name": "Lahore", "city": "Lahore"}
    with patch("core.cache.get", return_value=cached):
        with patch("core.http_client.get") as mock_get:
            result = get_coordinates("Lahore")
            mock_get.assert_not_called()
    assert result["lat"] == 31.5