import { useState } from "react"
import { Download, Loader2, CheckCircle } from "lucide-react"

export default function ExportButton() {
  const [state, setState] = useState("idle") // idle | loading | done | error

  const handleExport = async () => {
    if (!window.electronAPI) {
      alert("Export only available in the desktop app.")
      return
    }
    setState("loading")
    const result = await window.electronAPI.exportPDF()
    if (result.success) {
      setState("done")
      setTimeout(() => setState("idle"), 3000)
    } else {
      setState(result.reason === "cancelled" ? "idle" : "error")
      setTimeout(() => setState("idle"), 2000)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={state === "loading"}
      className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-space-600 hover:border-nebula-blue text-star-dim hover:text-nebula-blue transition-all text-sm font-body disabled:opacity-50"
    >
      {state === "loading" && <Loader2 size={15} className="animate-spin" />}
      {state === "done"    && <CheckCircle size={15} className="text-nebula-cyan" />}
      {state === "idle" || state === "error" ? <Download size={15} /> : null}
      {state === "loading" ? "Exporting..."  : null}
      {state === "done"    ? "Saved!"        : null}
      {state === "idle"    ? "Export PDF"    : null}
      {state === "error"   ? "Failed"        : null}
    </button>
  )
}