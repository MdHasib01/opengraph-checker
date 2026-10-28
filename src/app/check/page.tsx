import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { CheckView } from "@/components/check-view"
import { hostname } from "@/lib/types"

export async function generateMetadata(props: PageProps<"/check">): Promise<Metadata> {
  const { url } = await props.searchParams
  const target = typeof url === "string" ? url : ""
  return { title: target ? `Open Graph preview for ${hostname(target)}` : "Check a URL" }
}

export default async function CheckPage(props: PageProps<"/check">) {
  const { url } = await props.searchParams
  if (typeof url !== "string" || !url.trim()) redirect("/")
  return <CheckView key={url} url={url} />
}
