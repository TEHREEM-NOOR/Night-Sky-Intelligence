@(
  "scripts/notify.py",
  "scripts/export_pdf.py", 
  "scripts/auto_refresh.py",
  "gui/electron/notifications.js",
  "gui/electron/export.js",
  "gui/src/components/NotificationToggle.jsx",
  "gui/src/components/ExportButton.jsx",
  "gui/src/components/AutoRefreshToggle.jsx",
  ".github/workflows/build.yml",
  "build.spec",
  "electron-builder.yml"
) | ForEach-Object { New-Item -ItemType File -Force -Path $_ }