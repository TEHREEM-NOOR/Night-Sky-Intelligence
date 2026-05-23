const { app, BrowserWindow, ipcMain, Notification } = require("electron")
const { spawn }  = require("child_process")
const path       = require("path")
const http       = require("http")
const notif      = require("./notifications")
const { exportToPDF } = require("./export")

let win     = null
let backend = null

function startBackend() {
  const script = path.join(__dirname, "../../server/main.py")
  backend = spawn("python", [script], { stdio: "inherit", detached: false })
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
    width:  1280,
    height: 860,
    minWidth:  960,
    minHeight: 640,
    backgroundColor: "#03040f",
    titleBarStyle:   "hiddenInset",
    webPreferences: {
      nodeIntegration:  false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  })

  const isDev = process.env.NODE_ENV === "development"
  if (isDev) win.loadURL("http://localhost:3000")
  else       win.loadFile(path.join(__dirname, "../dist/index.html"))

  win.on("closed", () => { win = null })
}

// IPC handlers
ipcMain.handle("export-pdf", async () => {
  if (!win) return { success: false }
  return exportToPDF(win)
})

ipcMain.handle("toggle-notifications", async (_, enabled) => {
  if (enabled) notif.enableNotifications(win)
  else         notif.disableNotifications()
  return { success: true }
})

ipcMain.handle("notify-verdict", async (_, { city, score }) => {
  notif.sendClearSkyNotification(city, score)
  return { success: true }
})

ipcMain.handle("clear-cache", async () => {
  try {
    const r = await new Promise((resolve, reject) => {
      const req = http.request(
        { host: "localhost", port: 7842, path: "/api/cache", method: "DELETE" },
        (res) => resolve(res.statusCode)
      )
      req.on("error", reject)
      req.end()
    })
    return { success: r === 200 }
  } catch { return { success: false } }
})

app.whenReady().then(() => {
  startBackend()
  pollBackend((ready) => {
    if (!ready) { console.error("Backend failed"); app.quit(); return }
    createWindow()
  })
})

app.on("window-all-closed", () => {
  notif.disableNotifications()
  if (backend) { backend.kill(); backend = null }
  if (process.platform !== "darwin") app.quit()
})

app.on("activate", () => { if (!win) createWindow() })