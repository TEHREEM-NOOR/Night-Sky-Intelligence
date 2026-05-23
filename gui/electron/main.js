const { app, BrowserWindow, Notification } = require("electron")
const { spawn } = require("child_process")
const path = require("path")
const http  = require("http")

let win     = null
let backend = null

function startBackend() {
  backend = spawn("python", [path.join(__dirname, "../../server/main.py")], {
    stdio: "inherit",
    detached: false,
  })
  backend.on("error", (e) => console.error("Backend error:", e))
}

function pollBackend(cb, tries = 0) {
  if (tries > 30) { cb(false); return }
  http.get("http://localhost:7842/api/health", (r) => {
    if (r.statusCode === 200) cb(true)
    else setTimeout(() => pollBackend(cb, tries + 1), 500)
  }).on("error", () => setTimeout(() => pollBackend(cb, tries + 1), 500))
}

function createWindow() {
  win = new BrowserWindow({
    width:  1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#03040f",
    titleBarStyle: "hiddenInset",
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  })

  const isDev = process.env.NODE_ENV === "development"
  if (isDev) win.loadURL("http://localhost:3000")
  else       win.loadFile(path.join(__dirname, "../dist/index.html"))

  win.on("closed", () => { win = null })
}

app.whenReady().then(() => {
  startBackend()
  pollBackend((ready) => {
    if (!ready) { console.error("Backend failed to start"); app.quit(); return }
    createWindow()
  })
})

app.on("window-all-closed", () => {
  if (backend) { backend.kill(); backend = null }
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => {
  if (!win) createWindow()
})