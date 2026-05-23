const { Notification, app } = require("electron")
const path = require("path")

let issCheckInterval = null
let notificationsEnabled = false

function isSupported() {
  return Notification.isSupported()
}

function enableNotifications(win) {
  notificationsEnabled = true
  startISSCheck(win)
}

function disableNotifications() {
  notificationsEnabled = false
  if (issCheckInterval) {
    clearInterval(issCheckInterval)
    issCheckInterval = null
  }
}

function startISSCheck(win) {
  if (issCheckInterval) clearInterval(issCheckInterval)

  issCheckInterval = setInterval(async () => {
    if (!notificationsEnabled) return
    try {
      const http = require("http")
      const data = await new Promise((resolve, reject) => {
        http.get("http://localhost:7842/api/iss/passes", (res) => {
          let body = ""
          res.on("data", (chunk) => body += chunk)
          res.on("end", () => resolve(JSON.parse(body)))
        }).on("error", reject)
      })

      // If next pass is within 30 minutes
      if (data?.minutes_until_pass <= 30 && data?.minutes_until_pass > 0) {
        new Notification({
          title: "🛸 ISS Pass Coming!",
          body: `ISS passes over your city in ${data.minutes_until_pass} minutes. Duration: ${data.duration}`,
          icon: path.join(__dirname, "../public/icon.png"),
          urgency: "normal",
        }).show()
      }
    } catch {}
  }, 5 * 60 * 1000) // check every 5 minutes
}

function sendClearSkyNotification(city, score) {
  if (!notificationsEnabled || !Notification.isSupported()) return
  if (score >= 4) {
    new Notification({
      title: "🌌 Perfect Night for Stargazing!",
      body: `Clear skies tonight in ${city}. Score: ${score}/5 — get outside!`,
      urgency: "normal",
    }).show()
  }
}

module.exports = {
  isSupported,
  enableNotifications,
  disableNotifications,
  sendClearSkyNotification,
}