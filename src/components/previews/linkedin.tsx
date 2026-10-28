"use client"

import { hostname } from "@/lib/types"
import { PreviewImage, type PreviewProps } from "./shared"

export function LinkedInPreview({ data }: PreviewProps) {
  return (
    <div className="w-full max-w-[552px] overflow-hidden rounded-lg bg-white text-left font-sans shadow-[0_0_0_1px_rgba(0,0,0,0.12)]">
      <PreviewImage src={data.image} alt={data.imageAlt} className="aspect-[1.91/1] w-full" />
      <div className="bg-[#eef3f8] px-3 py-2">
        <div className="line-clamp-2 text-sm font-semibold text-black/90">{data.title}</div>
        <div className="mt-1 truncate text-xs text-black/60">{hostname(data.url)}</div>
      </div>
    </div>
  )
}
