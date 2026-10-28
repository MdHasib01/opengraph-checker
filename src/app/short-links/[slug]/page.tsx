import type { Metadata } from "next"
import { Suspense } from "react"
import { LinkAnalytics } from "@/components/short-links/link-analytics"

export const metadata: Metadata = { title: "Short link analytics" }

async function AnalyticsContent({ params }: { params: PageProps<"/short-links/[slug]">["params"] }) {
  const { slug } = await params
  return <LinkAnalytics slug={slug} />
}

export default function LinkAnalyticsPage(props: PageProps<"/short-links/[slug]">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense>
        <AnalyticsContent params={props.params} />
      </Suspense>
    </div>
  )
}
