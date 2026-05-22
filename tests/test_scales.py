import pytest
from core.scales import asteroid_size_label, miss_distance_moon, velocity_display

def test_football_field():
    assert asteroid_size_label(30) == "as wide as a football field"
    assert asteroid_size_label(49) == "as wide as a football field"

def test_eiffel_tower():
    assert asteroid_size_label(50) == "as tall as the Eiffel Tower"
    assert asteroid_size_label(149) == "as tall as the Eiffel Tower"

def test_burj_khalifa():
    assert asteroid_size_label(150) == "as tall as the Burj Khalifa"
    assert asteroid_size_label(499) == "as tall as the Burj Khalifa"

def test_small_city():
    assert asteroid_size_label(500) == "as wide as a small city"
    assert asteroid_size_label(1999) == "as wide as a small city"

def test_city_killer():
    assert asteroid_size_label(2000) == "city-killer scale"
    assert asteroid_size_label(50000) == "city-killer scale"

def test_miss_distance_moon():
    result = miss_distance_moon(0.00257)
    assert result == 1.0

def test_miss_distance_close():
    result = miss_distance_moon(0.00514)
    assert result == 2.0

def test_velocity_display():
    assert velocity_display(12.345) == "12.3 km/s"