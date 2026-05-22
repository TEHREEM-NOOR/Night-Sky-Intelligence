const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const http = require('http')

let mainWindow = null
let pythonProcess = null

// ── start Python backend ──────────────────────────────────────────────────────

function startBackend() {
  const projectRoot = path.join(__dirname, '..', '..')
  const scriptPath = path.join(projectRoot, 'server', 'main.py')

  console.log('Starting Python backend...')

  pythonProcess = spawn('python', [scriptPath], {
    cwd: projectRoot,
    stdio: 'inherit',
  })

  pythonProcess.on('error', (err) => {
    console.error('Failed to start Python backend:', err.message)
  })

  pythonProcess.on('exit', (code) => {
    console.log(`Python backend exited with code ${code}`)
  })
}

// ── poll /api/health until server is ready ────────────────────────────────────

function waitForBackend(retries = 30, interval = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const check = () => {
      http.get('http://127.0.0.1:7842/api/health', (res) => {
        if (res.statusCode === 200) {
          console.log('Backend is ready.')
          resolve()
        } else {
          retry()
        }
      }).on('error', retry)
    }

    const retry = () => {
      attempts++
      if (attempts >= retries) {
        reject(new Error('Backend did not start in time.'))
      } else {
        setTimeout(check, interval)
      }
    }

    check()
  })
}

// ── create browser window ─────────────────────────────────────────────────────

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0a0a0f',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Night Sky Intel',
  })

  // in dev load Vite dev server; in prod load built index.html
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// ── app lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(async () => {
  startBackend()

  try {
    await waitForBackend()
    createWindow()
  } catch (err) {
    console.error(err.message)
    // open window anyway — backend might still come up
    createWindow()
  }
})

app.on('window-all-closed', () => {
  // kill Python backend cleanly — no orphan processes
  if (pythonProcess) {
    console.log('Killing Python backend...')
    pythonProcess.kill()
    pythonProcess = null
  }

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})