"use client"

import { MoreVerticalIcon } from "lucide-react"
import { hostname } from "@/lib/types"
import { Favicon, truncate, type PreviewProps } from "./shared"

function breadcrumb(url: string) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split("/").filter(Boolean)
    return [u.origin, ...parts].join(" › ")
  } catch {
    return url
  }
}

export function GooglePreview({ data }: PreviewProps) {
  return (
    <div className="w-full max-w-[600px] rounded-xl bg-white p-4 font-[Arial,sans-serif] text-left">
      <div className="flex items-center gap-3">
        <div className="flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
          <Favicon src={data.favicon} className="size-[18px]" />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm text-[#202124]">{data.siteName || hostname(data.url)}</div>
          <div className="truncate text-xs text-[#4d5156]">{breadcrumb(data.url)}</div>
        </div>
        <MoreVerticalIcon className="size-4 text-[#4d5156]" />
      </div>
      <div className="mt-2 text-xl leading-snug text-[#1a0dab] hover:underline">
        {truncate(data.title || "Untitled page", 60)}
      </div>
      <div className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#4d5156]">
        {truncate(data.description || "No description provided.", 160)}
      </div>
    </div>
  )
}
