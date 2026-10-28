import Link from "next/link"
import { ArrowRightIcon, Link2Icon } from "lucide-react"
import { DismissAnnouncement } from "@/components/dismiss-announcement"
import { DISMISS_ATTR, DISMISS_KEY } from "@/lib/announcement"

/** Runs before the bar paints, so a dismissed bar never flashes on load. */
const hideIfDismissed = `try{if(localStorage.getItem("${DISMISS_KEY}"))document.documentElement.setAttribute("${DISMISS_ATTR}","")}catch(e){}`

export function AnnouncementBar() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hideIfDismissed }} />
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white in-data-promo-dismissed:hidden">
        {/* soft highlight so the bar doesn't read as a flat block */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.18),transparent_60%)]" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 py-2 pr-12 pl-4 text-sm">
          <span className="hidden shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-white/25 sm:inline">
            New
          </span>
          <p className="min-w-0 truncate">
            <span className="font-semibold">Get short links for free!</span>
            <span className="hidden text-white/80 md:inline"> Custom previews and click analytics included.</span>
          </p>
          <Link
            href="/short-links"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
          >
            <Link2Icon className="size-3.5" />
            Generate now
            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <DismissAnnouncement />
        </div>
      </div>
    </>
  )
}
