import { useState } from "react"
import { Bell, BellOff } from "lucide-react"

export default function NotificationToggle() {
  const [enabled, setEnabled] = useState(false)

  const toggle = async () => {
    const next = !enabled
    setEnabled(next)
    if (window.electronAPI) {
      await window.electronAPI.toggleNotifications(next)
    }
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border transition-all text-sm font-body ${
        enabled
          ? "border-nebula-cyan text-nebula-cyan"
          : "border-space-600 text-star-dim hover:border-nebula-cyan hover:text-nebula-cyan"
      }`}
    >
      {enabled
        ? <Bell    size={15} className="animate-pulse-slow" />
        : <BellOff size={15} />
      }
      {enabled ? "Alerts On" : "Alerts Off"}
    </button>
  )
}