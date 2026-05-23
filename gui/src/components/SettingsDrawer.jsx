import { useState } from "react"
import { X, Key, Clock, RotateCcw } from "lucide-react"
import useDashboardStore  from "../store/dashboardStore"

export default function SettingsDrawer() {
  const { settingsOpen, toggleSettings } = useDashboardStore()
  const [key, setKey] = useState("")
  const [saved, setSaved] = useState(false)

  if (!settingsOpen) return null

  const save = async () => {
    try {
      await fetch("http://localhost:7842/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nasa_api_key: key }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
  }

  const clearCache = async () => {
    try { await fetch("http://localhost:7842/api/cache", { method: "DELETE" }) }
    catch {}
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={toggleSettings} />

      {/* Drawer */}
      <div className="w-80 glass-panel h-full p-6 animate-slide-in shadow-panel flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm text-nebula-blue tracking-widest uppercase">Settings</h2>
          <button onClick={toggleSettings} className="p-1.5 rounded-lg hover:bg-space-700 text-star-dim hover:text-star-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* NASA Key */}
        <div>
          <label className="flex items-center gap-2 text-xs text-star-dim font-body mb-2">
            <Key size={12} /> NASA API Key
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your NASA API key"
            className="w-full bg-space-900 border border-space-600 rounded-xl px-4 py-3 text-star-white font-mono text-sm outline-none focus:border-nebula-blue transition-colors"
          />
          <button
            onClick={save}
            className="mt-2 w-full py-2 rounded-xl bg-nebula-blue/10 border border-nebula-blue/30 text-nebula-blue text-sm font-body hover:bg-nebula-blue/20 transition-colors"
          >
            {saved ? "✓ Saved" : "Save Key"}
          </button>
          <p className="text-star-dim text-xs font-body mt-2">
            Get a free key at{" "}
            <a href="https://api.nasa.gov" target="_blank" rel="noreferrer" className="text-nebula-blue underline">api.nasa.gov</a>
          </p>
        </div>

        {/* Cache */}
        <div>
          <label className="flex items-center gap-2 text-xs text-star-dim font-body mb-2">
            <Clock size={12} /> Cache
          </label>
          <button
            onClick={clearCache}
            className="w-full py-2 rounded-xl bg-space-900 border border-space-700 text-star-dim text-sm font-body hover:border-nebula-pink hover:text-nebula-pink transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={13} /> Clear All Cache
          </button>
        </div>
      </div>
    </div>
  )
}