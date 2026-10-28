"use client"

import Link from "next/link"
import { RotateCcwIcon, SparklesIcon } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { hostname, type PreviewData } from "@/lib/types"
import { cn } from "@/lib/utils"

function Counter({ value, max }: { value: string; max: number }) {
  return (
    <span className={cn("text-xs tabular-nums", value.length > max ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
      {value.length}/{max}
    </span>
  )
}

const OG_TYPES = ["website", "article", "product", "profile", "video.other", "music.song", "book"]

export function MetaEditor({
  data,
  onChange,
  onReset,
  dirty,
}: {
  data: PreviewData
  onChange: (patch: Partial<PreviewData>) => void
  onReset: () => void
  dirty: boolean
}) {
  const generatorHref = `/generator?${new URLSearchParams({
    title: data.title,
    description: data.description,
    site: data.siteName || hostname(data.url),
  })}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Edit meta tags</h2>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={!dirty}>
          <RotateCcwIcon /> Reset
        </Button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="title">Title</Label>
          <Counter value={data.title} max={60} />
        </div>
        <Input id="title" value={data.title} onChange={(e) => onChange({ title: e.target.value })} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Description</Label>
          <Counter value={data.description} max={160} />
        </div>
        <Textarea id="description" rows={3} value={data.description} onChange={(e) => onChange({ description: e.target.value })} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" value={data.image} placeholder="https://…/og.png" onChange={(e) => onChange({ image: e.target.value })} />
        <Link href={generatorHref} className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}>
          <SparklesIcon /> Generate an image for this page
        </Link>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imageAlt">Image alt text</Label>
        <Input id="imageAlt" value={data.imageAlt} onChange={(e) => onChange({ imageAlt: e.target.value })} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="url">URL</Label>
        <Input id="url" value={data.url} onChange={(e) => onChange({ url: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="siteName">Site name</Label>
          <Input id="siteName" value={data.siteName} onChange={(e) => onChange({ siteName: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>og:type</Label>
          <Select value={data.type} onValueChange={(v) => onChange({ type: v ?? "website" })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set([data.type, ...OG_TYPES])).map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>twitter:card</Label>
        <Select
          value={data.twitterCard}
          onValueChange={(v) => onChange({ twitterCard: v === "summary" ? "summary" : "summary_large_image" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summary_large_image">summary_large_image</SelectItem>
            <SelectItem value="summary">summary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="twitterSite">twitter:site</Label>
          <Input id="twitterSite" placeholder="@brand" value={data.twitterSite} onChange={(e) => onChange({ twitterSite: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="twitterCreator">twitter:creator</Label>
          <Input id="twitterCreator" placeholder="@author" value={data.twitterCreator} onChange={(e) => onChange({ twitterCreator: e.target.value })} />
        </div>
      </div>
    </div>
  )
}
