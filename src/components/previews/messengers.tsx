"use client"

import { hostname } from "@/lib/types"
import { PreviewImage, type PreviewProps } from "./shared"

export function WhatsAppPreview({ data }: PreviewProps) {
  return (
    <div className="w-full max-w-[360px] rounded-lg bg-[#efeae2] p-3 text-left font-sans">
      <div className="ml-auto w-[300px] max-w-full rounded-lg rounded-tr-none bg-[#d9fdd3] p-1 shadow-sm">
        <div className="overflow-hidden rounded-md bg-[#d1f4cc]">
          <PreviewImage src={data.image} alt={data.imageAlt} className="aspect-[1.91/1] w-full" />
          <div className="px-2.5 py-2">
            <div className="line-clamp-2 text-sm font-semibold text-[#111b21]">{data.title}</div>
            <div className="line-clamp-2 text-xs text-[#667781]">{data.description}</div>
            <div className="mt-1 text-xs text-[#667781]">{hostname(data.url)}</div>
          </div>
        </div>
        <div className="px-1.5 pt-1 pb-0.5 text-sm break-all text-[#027eb5]">{data.url}</div>
        <div className="pr-1 text-right text-[11px] text-[#667781]">12:00 ✓✓</div>
      </div>
    </div>
  )
}

export function TelegramPreview({ data }: PreviewProps) {
  return (
    <div className="w-full max-w-[380px] rounded-lg bg-[#8fb08c] p-3 text-left font-sans">
      <div className="w-[320px] max-w-full rounded-2xl rounded-bl-sm bg-white p-2.5 shadow-sm">
        <div className="text-sm break-all text-[#168acd]">{data.url}</div>
        <div className="mt-1.5 flex gap-2 rounded-md bg-[#e8f3fb] p-2">
          <div className="w-[3px] shrink-0 rounded bg-[#3390ec]" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#3390ec]">{data.siteName || hostname(data.url)}</div>
            <div className="text-sm font-semibold text-black">{data.title}</div>
            <div className="line-clamp-3 text-sm text-black">{data.description}</div>
            <PreviewImage src={data.image} alt={data.imageAlt} className="mt-1.5 aspect-[1.91/1] w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function IMessagePreview({ data }: PreviewProps) {
  return (
    <div className="w-full max-w-[340px] rounded-lg bg-white p-3 text-left font-sans">
      <div className="ml-auto w-[280px] max-w-full overflow-hidden rounded-[18px] bg-[#e9e9eb]">
        <PreviewImage src={data.image} alt={data.imageAlt} className="aspect-[1.91/1] w-full" />
        <div className="px-3 py-2">
          <div className="line-clamp-2 text-sm font-semibold text-black">{data.title}</div>
          <div className="text-sm text-[#8e8e93]">{hostname(data.url)}</div>
        </div>
      </div>
    </div>
  )
}
