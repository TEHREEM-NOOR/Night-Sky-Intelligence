const { dialog } = require("electron")
const path = require("path")
const fs   = require("fs")

async function exportToPDF(win) {
  try {
    const data = await win.webContents.printToPDF({
      printBackground:  true,
      pageSize:         "A4",
      marginsType:      1,
      printSelectionOnly: false,
      landscape:        false,
    })

    const { filePath } = await dialog.showSaveDialog(win, {
      title:       "Save Night Sky Report",
      defaultPath: path.join(
        require("os").homedir(),
        `night-sky-intel-${new Date().toISOString().split("T")[0]}.pdf`
      ),
      filters: [{ name: "PDF Files", extensions: ["pdf"] }],
    })

    if (filePath) {
      fs.writeFileSync(filePath, data)
      return { success: true, path: filePath }
    }

    return { success: false, reason: "cancelled" }
  } catch (err) {
    return { success: false, reason: err.message }
  }
}

module.exports = { exportToPDF }