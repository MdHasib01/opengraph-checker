"use client"

import { XIcon } from "lucide-react"
import { DISMISS_ATTR, DISMISS_KEY } from "@/lib/announcement"

export function DismissAnnouncement() {
  return (
    <button
      type="button"
      aria-label="Dismiss announcement"
      onClick={() => {
        document.documentElement.setAttribute(DISMISS_ATTR, "")
        try {
          localStorage.setItem(DISMISS_KEY, "1")
        } catch {
          // storage blocked (private mode): still hidden for this page view
        }
      }}
      className="absolute top-1/2 right-3 inline-flex -translate-y-1/2 size-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
    >
      <XIcon className="size-4" />
    </button>
  )
}
