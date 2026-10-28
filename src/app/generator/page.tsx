import type { Metadata } from "next"
import { Suspense } from "react"
import { GeneratorView } from "@/components/generator-view"
import { presetFor, searchToParams } from "@/lib/og-templates"

export const metadata: Metadata = {
  title: "Open Graph image generator",
  description: "Design a 1200×630 Open Graph image from templates and AI-made backdrops, then download it or use its dynamic URL.",
}

async function GeneratorContent({ searchParams }: { searchParams: PageProps<"/generator">["searchParams"] }) {
  const query = await searchParams
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) if (typeof v === "string") sp.set(k, v)
  return <GeneratorView initial={sp.size ? searchToParams(sp) : presetFor("event")} />
}

export default function GeneratorPage(props: PageProps<"/generator">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Open Graph image generator</h1>
      <p className="mt-2 text-muted-foreground">Pick a template, customise it, and export a 1200×630 PNG.</p>
      <Suspense>
        <GeneratorContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}
