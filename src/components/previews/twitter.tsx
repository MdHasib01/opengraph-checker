"use client"

import { hostname } from "@/lib/types"
import { PreviewImage, type PreviewProps } from "./shared"

export function TwitterPreview({ data }: PreviewProps) {
  const domain = hostname(data.url)

  if (data.twitterCard === "summary") {
    return (
      <div className="flex w-full max-w-[506px] overflow-hidden rounded-2xl border border-[#cfd9de] bg-white text-left font-sans">
        <PreviewImage src={data.image} alt={data.imageAlt} className="aspect-square w-[130px] shrink-0 border-r border-[#cfd9de]" />
        <div className="flex min-w-0 flex-col justify-center gap-0.5 px-3 text-[15px]">
          <div className="truncate text-[#536471]">{domain}</div>
          <div className="truncate text-[#0f1419]">{data.title}</div>
          <div className="line-clamp-2 text-[#536471]">{data.description}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[506px] text-left font-sans">
      <div className="relative overflow-hidden rounded-2xl border border-[#cfd9de]">
        <PreviewImage src={data.image} alt={data.imageAlt} className="aspect-[1.91/1] w-full" />
        <div className="absolute bottom-3 left-3 max-w-[calc(100%-24px)] truncate rounded bg-black/75 px-1.5 py-0.5 text-[13px] text-white">
          {data.title}
        </div>
      </div>
      <div className="mt-1 text-[13px] text-[#536471]">From {domain}</div>
    </div>
  )
}
