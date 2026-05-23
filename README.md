# 🌌 Night Sky Intel

> Live space intelligence for any city on Earth — ISS tracking, near-Earth asteroids, stargazing conditions, and NASA imagery in one dashboard.

---

## What It Does

Type any city. Get a live dashboard showing:

- **ISS Tracker** — where the ISS is right now, and exactly when it passes over your city
- **Asteroid Radar** — every near-Earth object this week in human scale ("3x the Eiffel Tower, 0.8x the Moon's distance")
- **Stargazing Verdict** — cloud cover + moon phase combined into a 1–5 star score
- **NASA Today** — today's astronomy image with full description

No website does all of this in one place.

---

## APIs Used

| API | What For | Key Required |
|-----|----------|-------------|
| Open-Notify | ISS position + pass times | ❌ Free |
| NASA NeoWs | Asteroids this week | ✅ Free signup |
| NASA APOD | Daily astronomy image | ✅ Same key |
| Open-Meteo | Cloud cover + wind | ❌ Free |
| Nominatim | City → coordinates | ❌ Free |

---

## Requirements

- Python 3.10+
- Node.js 18+
- A free NASA API key → get one at [api.nasa.gov](https://api.nasa.gov) (takes 2 minutes)

---

## Setup & Run — Fresh Machine

### Step 1 — Clone the repo
```bash
git clone https://github.com/yourusername/night-sky-intel.git
cd night-sky-intel
```

### Step 2 — Python backend
```bash
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and paste your NASA key:

### Step 3 — Start the backend
```bash
python server/main.py
```

Backend runs on `http://localhost:7842`. Leave this terminal open.

### Step 4 — Frontend (new terminal)
```bash
cd gui
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Step 5 — Desktop app (optional)
```bash
cd gui
npm run start
```

---

## CLI Mode (no GUI needed)

```bash
# Basic
python main.py --city "Lahore"

# Custom asteroid window
python main.py --city "London" --days 3

# Skip cache, force fresh data
python main.py --city "Tokyo" --no-cache

# Help
python main.py --help
```

---

## Testing the Error Handling

The assessors will test these — here is how to trigger each one yourself:

```bash
# Bad input
python main.py --city ""
python main.py --city "xyznotacity123"

# API error simulation — disconnect internet, then run
python main.py --city "Karachi"

# Slow API — tool times out after 8s and shows partial dashboard
# No special setup needed, handled automatically
```

---

## Running Tests

```bash
pytest tests/ -v
```

---

## Building the Desktop App

```bash
cd gui

# macOS
npm run dist:mac

# Windows
npm run dist:win

# Linux
npm run dist:linux
```

Output goes to `gui/dist-electron/`.

---

## Project Structure
night-sky-intel/
├── main.py              # CLI entry point
├── server/              # FastAPI backend
├── apis/                # One file per API
├── core/                # Cache, retry, moon math, scales, verdict
├── display/             # Rich terminal dashboard
├── gui/                 # Electron + React frontend
│   ├── electron/        # Main process, notifications, export
│   └── src/             # React components, store, hooks
├── tests/               # pytest test suite
├── .env.example               #NASA_API_KEY=your_key_here
├── README.md
└── ANSWERS.md