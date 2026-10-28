"use client"

import { hostname } from "@/lib/types"
import { PreviewImage, type PreviewProps } from "./shared"

export function FacebookPreview({ data }: PreviewProps) {
  return (
    <div className="w-full max-w-[524px] overflow-hidden border border-[#dadde1] bg-white text-left font-[Helvetica,Arial,sans-serif]">
      <PreviewImage src={data.image} alt={data.imageAlt} className="aspect-[1.91/1] w-full" />
      <div className="border-t border-[#dadde1] bg-[#f2f3f5] px-3 py-2.5">
        <div className="truncate text-xs uppercase text-[#606770]">{hostname(data.url)}</div>
        <div className="mt-0.5 line-clamp-2 text-base font-semibold leading-5 text-[#1d2129]">{data.title}</div>
        <div className="mt-0.5 line-clamp-1 text-sm text-[#606770]">{data.description}</div>
      </div>
    </div>
  )
}
