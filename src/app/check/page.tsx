import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { CheckView } from "@/components/check-view"
import { hostname } from "@/lib/types"

export async function generateMetadata(props: PageProps<"/check">): Promise<Metadata> {
  const { url } = await props.searchParams
  const target = typeof url === "string" ? url : ""
  return { title: target ? `Open Graph preview for ${hostname(target)}` : "Check a URL" }
}

async function CheckContent({ searchParams }: { searchParams: PageProps<"/check">["searchParams"] }) {
  const { url } = await searchParams
  if (typeof url !== "string" || !url.trim()) redirect("/")
  return <CheckView key={url} url={url} />
}

export default function CheckPage(props: PageProps<"/check">) {
  return (
    <Suspense>
      <CheckContent searchParams={props.searchParams} />
    </Suspense>
  )
}
