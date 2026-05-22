from datetime import date
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.columns import Columns
from rich import box

console = Console()

def render(city_name: str, data: dict) -> None:
    today = date.today().strftime("%A, %d %B %Y")
    console.print()
    console.rule(f"[bold white]🌌  NIGHT SKY INTEL  —  {city_name}[/bold white]")
    console.print(f"[dim]{today}[/dim]", justify="center")
    console.print()

    console.print(_iss_panel(data.get("iss_position"), data.get("iss_passes")))
    console.print(_neo_panel(data.get("neos")))
    console.print(_weather_panel(data.get("weather"), data.get("moon")))
    console.print(_apod_panel(data.get("apod")))
    console.print(_verdict_panel(data.get("verdict")))
    console.print()

def _iss_panel(position: dict | None, passes: list | None) -> Panel:
    t = Text()
    if position is None:
        t.append("Data unavailable\n", style="dim")
    else:
        t.append("Currently over:  ", style="bold")
        t.append(f"{position.get('location', 'Unknown')}\n")

    if passes is None or len(passes) == 0:
        t.append("Pass data unavailable", style="dim")
    else:
        next_pass = passes[0]
        t.append("Next pass:       ", style="bold")
        t.append(f"{next_pass['risetime_date']}  {next_pass['risetime_local']}\n")
        t.append("Visible for:     ", style="bold")
        t.append(f"{next_pass['duration_display']}\n")

    return Panel(t, title="[bold cyan]🛸  ISS — NEXT PASS[/bold cyan]", box=box.DOUBLE, padding=(0, 2))

def _neo_panel(neos: list | None) -> Panel:
    t = Text()
    if neos is None:
        t.append("Data unavailable", style="dim")
        return Panel(t, title="[bold yellow]☄️   NEAR-EARTH OBJECTS THIS WEEK[/bold yellow]", box=box.DOUBLE, padding=(0, 2))

    if len(neos) == 0:
        t.append("No near-Earth objects this week.", style="dim")
        return Panel(t, title="[bold yellow]☄️   NEAR-EARTH OBJECTS THIS WEEK[/bold yellow]", box=box.DOUBLE, padding=(0, 2))

    t.append(f"{len(neos)} object(s) tracked\n\n", style="dim")
    for neo in neos:
        hazard = neo.get("is_hazardous", False)
        name = neo["name"].replace("(", "").replace(")", "").strip()
        prefix = "⚠️  " if hazard else "   "
        style = "bold red" if hazard else "bold white"
        t.append(f"{prefix}{name}", style=style)
        t.append(f"   {neo['diameter_m']}m  │  {neo['size_label']}\n")
        t.append(f"         {neo['miss_distance_moon']}x Moon distance   {neo['velocity']}\n", style="dim")
        t.append(f"         Closest: {neo['close_approach_date']}\n\n", style="dim")

    return Panel(t, title="[bold yellow]☄️   NEAR-EARTH OBJECTS THIS WEEK[/bold yellow]", box=box.DOUBLE, padding=(0, 2))

def _weather_panel(weather: dict | None, moon: dict | None) -> Panel:
    t = Text()
    if weather is None:
        t.append("Weather data unavailable\n", style="dim")
    else:
        t.append("Cloud Cover:  ", style="bold")
        t.append(f"{weather['cloud_cover_pct']}%  {weather['cloud_label']}     ")
        t.append("Wind:  ", style="bold")
        t.append(f"{weather['wind_kmh']} km/h\n")

    if moon is None:
        t.append("Moon data unavailable", style="dim")
    else:
        t.append("Moon:         ", style="bold")
        t.append(f"{moon['phase_emoji']}  {moon['phase_name']}  ")
        t.append(f"({moon['illumination_pct']}% illuminated)", style="dim")

    return Panel(t, title="[bold blue]🌤️   TONIGHT'S CONDITIONS[/bold blue]", box=box.DOUBLE, padding=(0, 2))

def _apod_panel(apod: dict | None) -> Panel:
    t = Text()
    if apod is None:
        t.append("Data unavailable", style="dim")
    else:
        if apod.get("is_video"):
            t.append("Today's feature is a video: ", style="dim")
        t.append(f"\"{apod['title']}\"\n", style="bold white")
        t.append(apod["explanation"], style="dim")

    return Panel(t, title="[bold magenta]🔭  NASA TODAY[/bold magenta]", box=box.DOUBLE, padding=(0, 2))

def _verdict_panel(verdict: dict | None) -> Panel:
    t = Text()
    if verdict is None:
        t.append("Data unavailable", style="dim")
    else:
        t.append(f"\n   {verdict['label']}\n\n", style="bold yellow")
        for factor in verdict.get("factors", []):
            if factor.startswith("✓"):
                t.append(f"  {factor}\n", style="green")
            elif factor.startswith("✗"):
                t.append(f"  {factor}\n", style="red")
            else:
                t.append(f"  {factor}\n", style="dim")

    return Panel(t, title="[bold green]🏆  TONIGHT'S VERDICT[/bold green]", box=box.DOUBLE, padding=(0, 2))