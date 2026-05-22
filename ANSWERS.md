# Answers

## 1. How to run

Prerequisites: Python 3.10+, a free NASA API key from https://api.nasa.gov

```bash
git clone https://github.com/yourname/night-sky-intel.git
cd night-sky-intel
pip install -r requirements.txt
cp .env.example .env
# edit .env and add your NASA API key
python main.py --city "Lahore"
```

## 2. Stack choice

Python with httpx, rich, and python-dotenv.

httpx over requests: modern API, better timeout handling, same interface. rich: terminal dashboard with panels and colour without building a frontend. python-dotenv: standard pattern for keeping API keys out of source control. Three packages total as constrained by the spec.

A worse choice would have been Node.js with axios — nothing wrong with it technically, but Python's data processing and the rich library make the terminal output significantly cleaner with less code. A GUI framework like Tkinter would have been worse for a CLI tool — unnecessary complexity for this scope.

## 3. One real edge case

File: `core/http_client.py`, the retry block in the `get()` function.

When a 5xx response or timeout occurs on the first attempt, the code waits 2 seconds and retries exactly once. Without this, a transient server hiccup (common with free public APIs) would immediately mark a data section as unavailable and show "Data unavailable" in the dashboard. With it, the tool recovers silently from the majority of transient failures.

Without the retry, assessor test "slow API" would fail — the dashboard would show unavailable sections even when the API recovered within a few seconds.

## 4. AI usage

Used Claude to draft the initial structure of `display/dashboard.py` — the Rich panel layout. The AI output used `Table` from Rich for the NEO section. I changed it to plain `Text` with manual spacing because `Table` added borders that conflicted with the outer `DOUBLE` box style, making the output look cluttered. The text approach gives cleaner visual alignment inside the panels.

Also used Claude to verify the moon phase formula. The output matched the known reference dates I tested against.

## 5. Honest gap

The ISS pass calculation relies on `api.open-notify.org/iss-pass.json`, which has been unreliable since late 2022 and sometimes returns errors or stale data. The pass section will show unavailable more often than it should.

With another day I would replace this with a local calculation using the `ephem` library and TLE data fetched from Celestrak (`https://celestrak.org/SOCRATES/`). This would make ISS pass times more accurate and eliminate the dependency on an unreliable endpoint. The `ephem` approach would also give approach direction (SW→NE) which the current API does not return.