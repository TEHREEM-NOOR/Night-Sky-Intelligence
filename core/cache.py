import json
import os
import time
import re

CACHE_DIR = ".cache"

def _key_to_filename(key: str) -> str:
    slug = re.sub(r"[^\w\-]", "_", key.lower())
    return os.path.join(CACHE_DIR, f"{slug}.json")

def get(key: str, ttl_seconds: int) -> dict | None:
    path = _key_to_filename(key)
    if not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            payload = json.load(f)
        cached_at = payload.get("_cached_at", 0)
        if ttl_seconds > 0 and (time.time() - cached_at) > ttl_seconds:
            return None
        return payload.get("data")
    except (json.JSONDecodeError, KeyError, OSError):
        return None

def set(key: str, data: dict | list, ttl_seconds: int = 0) -> None:
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = _key_to_filename(key)
    payload = {
        "_cached_at": time.time(),
        "_ttl": ttl_seconds,
        "data": data
    }
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)
    except OSError as e:
        print(f"[cache] Failed to write cache: {e}")

def delete_all() -> None:
    if not os.path.exists(CACHE_DIR):
        return
    for filename in os.listdir(CACHE_DIR):
        if filename.endswith(".json"):
            try:
                os.remove(os.path.join(CACHE_DIR, filename))
            except OSError:
                pass