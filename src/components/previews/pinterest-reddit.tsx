"use client"

import { ArrowBigDownIcon, ArrowBigUpIcon, MessageSquareIcon } from "lucide-react"
import { hostname } from "@/lib/types"
import { PreviewImage, type PreviewProps } from "./shared"

export function PinterestPreview({ data }: PreviewProps) {
  return (
    <div className="w-[236px] text-left font-sans">
      <PreviewImage src={data.image} alt={data.imageAlt} className="aspect-[2/3] w-full rounded-2xl" />
      <div className="mt-2 line-clamp-2 px-1 text-sm font-semibold text-[#111]">{data.title}</div>
      <div className="px-1 text-xs text-[#5f5f5f]">{hostname(data.url)}</div>
    </div>
  )
}

export function RedditPreview({ data }: PreviewProps) {
  return (
    <div className="w-full max-w-[640px] rounded-lg border border-[#ccc] bg-white p-3 text-left font-sans">
      <div className="text-xs text-[#576f76]">
        <span className="font-semibold text-[#0f1a1c]">r/webdev</span> · Posted by u/someone · 2h
      </div>
      <div className="mt-2 flex gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-lg font-semibold leading-snug text-[#0f1a1c]">{data.title}</div>
          <div className="mt-1 truncate text-xs text-[#0079d3]">{hostname(data.url)} ↗</div>
        </div>
        <PreviewImage src={data.image} alt={data.imageAlt} className="h-[72px] w-[108px] shrink-0 rounded-lg" />
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-[#576f76]">
        <span className="flex items-center gap-1 rounded-full bg-[#eaedef] px-2 py-1">
          <ArrowBigUpIcon className="size-4" /> 128 <ArrowBigDownIcon className="size-4" />
        </span>
        <span className="flex items-center gap-1 rounded-full bg-[#eaedef] px-2 py-1">
          <MessageSquareIcon className="size-4" /> 24
        </span>
      </div>
    </div>
  )
}
