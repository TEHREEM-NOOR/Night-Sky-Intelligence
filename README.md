# Night Sky Intelligence Terminal

What is happening in the sky above your city tonight?

Aggregates live data from 5 free public APIs into a single terminal dashboard:
ISS position and next pass, near-Earth asteroids, tonight's cloud cover, moon phase, and NASA's astronomy picture of the day.

## Prerequisites

- Python 3.10 or higher
- A free NASA API key — get one in 30 seconds at https://api.nasa.gov (click "Generate API Key")

## Setup

```bash
git clone https://github.com/yourname/night-sky-intel.git
cd night-sky-intel
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and replace `your_key_here` with your NASA API key.

## Run

```bash
python main.py --city "Lahore"
```

## Options

```bash
python main.py --city "London" --days 3      # 3-day asteroid window
python main.py --city "Karachi" --no-cache   # skip cache, fresh data
python main.py --help
```

## Run Tests

```bash
pip install pytest
pytest tests/
```

## APIs Used

| API | Auth | Used For |
|---|---|---|
| Nominatim (OpenStreetMap) | None | City → coordinates |
| Open-Notify | None | ISS position + passes |
| NASA NeoWs | API Key | Near-Earth asteroids |
| Open-Meteo | None | Cloud cover + wind |
| NASA APOD | API Key | Astronomy picture of the day |