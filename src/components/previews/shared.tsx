"use client"

import { useState } from "react"
import { ImageOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PreviewData } from "@/lib/types"

export type PreviewProps = { data: PreviewData }

export function proxied(url: string) {
  if (!url) return ""
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:")) return url
  return `/api/proxy-image?url=${encodeURIComponent(url)}`
}

export function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s
}

export function PreviewImage({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  const [failed, setFailed] = useState<string | null>(null)
  if (!src || failed === src) {
    return (
      <div className={cn("flex items-center justify-center bg-neutral-200 text-neutral-400", className)}>
        <ImageOffIcon className="size-8" />
      </div>
    )
  }
  return (
    // Remote, arbitrary-origin images: next/image would need every host allow-listed.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={proxied(src)} alt={alt ?? ""} onError={() => setFailed(src)} className={cn("object-cover", className)} />
  )
}

export function Favicon({ src, className }: { src: string; className?: string }) {
  const [failed, setFailed] = useState<string | null>(null)
  if (!src || failed === src) return <div className={cn("rounded-full bg-neutral-300", className)} />
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={proxied(src)} alt="" onError={() => setFailed(src)} className={cn("rounded-full bg-white object-contain", className)} />
}
