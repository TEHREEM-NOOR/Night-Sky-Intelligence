import time
import httpx

TIMEOUT = 8.0
RETRY_WAIT = 2.0

def get(url: str, params: dict = None, headers: dict = None) -> dict | None:
    for attempt in range(2):
        try:
            response = httpx.get(
                url,
                params=params,
                headers=headers,
                timeout=TIMEOUT
            )
            if response.status_code == 200:
                return response.json()
            if response.status_code == 400:
                print(f"[http] 400 Bad request — check input parameters: {url}")
                return None
            if response.status_code == 401:
                print("[http] 401 Invalid API key — check your .env file")
                return None
            if response.status_code == 403:
                print("[http] 403 API key unauthorised")
                return None
            if response.status_code == 404:
                print(f"[http] 404 Resource not found: {url}")
                return None
            if response.status_code == 429:
                print("[http] 429 Rate limit hit — wait 60 seconds")
                return None
            if response.status_code >= 500:
                if attempt == 0:
                    time.sleep(RETRY_WAIT)
                    continue
                print(f"[http] 5xx Server error after retry: {url}")
                return None
        except httpx.TimeoutException:
            if attempt == 0:
                time.sleep(RETRY_WAIT)
                continue
            print(f"[http] Timeout after retry: {url}")
            return None
        except httpx.RequestError as e:
            if attempt == 0:
                time.sleep(RETRY_WAIT)
                continue
            print(f"[http] Request error after retry: {e}")
            return None
    return None