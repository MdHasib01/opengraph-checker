"use client"

import { PreviewImage, type PreviewProps } from "./shared"

export function DiscordPreview({ data, themeColor }: PreviewProps & { themeColor?: string }) {
  return (
    <div className="w-full max-w-[432px] rounded-[4px] bg-[#2b2d31] p-0 text-left font-sans">
      <div className="grid gap-2 rounded-[4px] border-l-4 py-3 pr-4 pl-3" style={{ borderColor: themeColor || "#1e1f22" }}>
        {data.siteName ? <div className="text-xs text-[#dbdee1]">{data.siteName}</div> : null}
        <div className="text-base font-semibold text-[#00a8fc] hover:underline">{data.title}</div>
        {data.description ? <div className="line-clamp-3 text-sm text-[#dbdee1]">{data.description}</div> : null}
        <PreviewImage src={data.image} alt={data.imageAlt} className="mt-2 aspect-[1.91/1] w-full rounded" />
      </div>
    </div>
  )
}
