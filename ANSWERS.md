# ANSWERS.md

---

## 1. How to Run

**Requirements:** Python 3.10+, Node.js 18+, one free NASA API key from api.nasa.gov

```bash
# Clone
git clone https://github.com/yourusername/night-sky-intel.git
cd night-sky-intel

# Backend
pip install -r requirements.txt
cp .env.example .env
# → open .env, paste your NASA key

# Start backend (keep this terminal open)
python server/main.py

# Frontend (new terminal)
cd gui && npm install && npm run dev
# → open http://localhost:3000
```

CLI only (no GUI):
```bash
python main.py --city "Your City"
```

---

## 2. Stack Choice

**Python** for the backend — standard library covers most HTTP needs,
`httpx` adds async and clean timeout control, and the data manipulation
is straightforward. Python was the obvious choice for a data-fetching
layer that needs reliable error handling and a clean module structure.

**FastAPI** for the API server — automatic validation, built-in SSE
support via `StreamingResponse`, and near-zero boilerplate. It let me
expose each data section as a stream so the frontend renders
progressively as each API responds rather than waiting for all five.

**React + Zustand** for the frontend — Zustand is simpler than Redux
for this use case. One store, flat state, no boilerplate. React's
component model mapped cleanly to the dashboard panels.

**Electron** for the desktop shell — it spawns the Python backend as a
child process, polls `/api/health` before showing the window, and kills
the backend cleanly on close. Cross-platform with one codebase.

**Worse choice:** A single-file Flask app with synchronous requests
would have worked for a prototype but would have made the ~12 second
multi-API load time unavoidable. The async FastAPI backend with
`asyncio.gather()` cuts that to 2–3 seconds.

---

## 3. One Real Edge Case

**File:** `core/http_client.py`

**The case:** Any of the five APIs being slow or timing out.

Every API call goes through one function that sets an 8-second timeout
via `httpx`. On timeout or HTTP 5xx, the function waits 2 seconds and
retries exactly once. If the second attempt also fails, it returns
`None` instead of raising an exception.

Every panel component checks for `None` and renders "Data unavailable"
in that section while the rest of the dashboard renders normally.

**Without this:** A single slow API would hang the entire dashboard.
The user would see a blank screen for 30+ seconds and potentially a
crash with an unhandled exception. With it, a dead API means one
greyed-out panel — the other four sections still load and the
stargazing verdict still calculates from whatever data is available.

---

## 4. AI Usage

**Tool used:** Claude (Anthropic)

**What I asked:** Initial project structure and boilerplate for the
FastAPI SSE streaming endpoint, the Electron preload/IPC pattern, and
the Tailwind config with custom space theme tokens.

**What it gave me:** A working SSE endpoint and a Tailwind config with
color variables, animations, and keyframes.

**What I changed:**

The AI-generated SSE endpoint sent all five API responses in one
batch after all resolved. I changed it to use `asyncio.as_completed()`
instead of `asyncio.gather()` so each section streams to the frontend
the moment its API responds. This made the ISS panel appear in ~500ms
while asteroids (the slowest call) still loaded in the background.
The user sees a progressive dashboard instead of a blank screen
followed by everything at once.

I also rewrote the Tailwind animation keyframes — the AI gave me
standard `pulse` and `spin`. I replaced them with `float`,
`glow`, `twinkle`, and `orbit` to match the space aesthetic, and
added the animated gradient border that runs across all panel tops.

---

## 5. Honest Gap

**The Open-Notify pass endpoint is unreliable.**

`api.open-notify.org/iss-pass.json` has had intermittent outages since
2022. The current code tries it, and if it fails, shows "Pass data
unavailable" — which is honest but not good enough for a tool that
is supposed to tell you when to go outside.

**What I would do with another day:**

Replace the Open-Notify pass endpoint with a direct TLE calculation
using the `ephem` library and fresh TLE data from Celestrak
(`celestrak.org/SOCRATES`). This would calculate ISS pass times
locally with no external dependency — more accurate, always available,
and faster. I left this out because `ephem` is a fourth pip dependency
and I wanted to stay at three. With another day I would have
implemented the math directly using the SGP4 propagation model, which
is well-documented and has no license restrictions.