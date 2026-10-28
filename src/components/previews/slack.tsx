"use client"

import { hostname } from "@/lib/types"
import { Favicon, PreviewImage, type PreviewProps } from "./shared"

export function SlackPreview({ data }: PreviewProps) {
  return (
    <div className="flex w-full max-w-[520px] gap-3 bg-white text-left font-sans text-[15px]">
      <div className="w-1 shrink-0 rounded bg-[#dddddd]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Favicon src={data.favicon} className="size-4 rounded-sm" />
          <span className="font-bold text-[#1d1c1d]">{data.siteName || hostname(data.url)}</span>
        </div>
        <div className="mt-1 font-bold text-[#1264a3] hover:underline">{data.title}</div>
        <div className="line-clamp-3 text-[#1d1c1d]">{data.description}</div>
        {data.image ? <PreviewImage src={data.image} alt={data.imageAlt} className="mt-2 aspect-[1.91/1] w-[360px] max-w-full rounded-lg" /> : null}
      </div>
    </div>
  )
}
