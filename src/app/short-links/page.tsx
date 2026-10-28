import type { Metadata } from "next"
import { EyeIcon, LineChartIcon, PaletteIcon } from "lucide-react"
import { ShortLinksView } from "@/components/short-links/short-links-view"

export const metadata: Metadata = {
  title: "Short links with custom previews",
  description:
    "Create short links with your own Open Graph title, description and image, then track clicks and which platforms unfurled them.",
}

const POINTS = [
  { icon: PaletteIcon, title: "Your preview, any page", body: "Set the title, description and image people see, even for pages you don't control." },
  { icon: EyeIcon, title: "Crawlers see your tags", body: "Facebook, X, LinkedIn, Slack and others get your custom card; people go straight to the destination." },
  { icon: LineChartIcon, title: "Click analytics", body: "Clicks per day, referrers, devices, countries and which platforms fetched the preview." },
]

export default function ShortLinksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Short links with custom previews</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Shorten any URL and control exactly how it looks when shared, then see who clicked.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {POINTS.map((p) => (
          <div key={p.title} className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <p.icon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.body}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <ShortLinksView />
      </div>
    </div>
  )
}
