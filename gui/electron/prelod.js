const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  exportPDF:           ()        => ipcRenderer.invoke("export-pdf"),
  toggleNotifications: (enabled) => ipcRenderer.invoke("toggle-notifications", enabled),
  notifyVerdict:       (data)    => ipcRenderer.invoke("notify-verdict", data),
  clearCache:          ()        => ipcRenderer.invoke("clear-cache"),
  isElectron:          true,
})