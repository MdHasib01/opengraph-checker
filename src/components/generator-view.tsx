"use client"

import Image from "next/image"
import { useEffect, useState, useSyncExternalStore } from "react"
import { BanIcon, DownloadIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { CodeBlock, CopyButton } from "@/components/code-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { FONTS, TEMPLATES, paramsToSearch, type FontName, type OgParams } from "@/lib/og-templates"
import { cn } from "@/lib/utils"

const BACKGROUNDS = Array.from({ length: 6 }, (_, i) => `/backgrounds/bg-${i + 1}.png`)

const PALETTES: Pick<OgParams, "bg" | "bg2" | "fg" | "accent">[] = [
  { bg: "#4f46e5", bg2: "#db2777", fg: "#ffffff", accent: "#facc15" },
  { bg: "#0f172a", bg2: "#1e3a8a", fg: "#f8fafc", accent: "#38bdf8" },
  { bg: "#ffffff", bg2: "#e0e7ff", fg: "#0f172a", accent: "#4f46e5" },
  { bg: "#052e16", bg2: "#15803d", fg: "#f0fdf4", accent: "#a3e635" },
  { bg: "#fff7ed", bg2: "#fdba74", fg: "#431407", accent: "#ea580c" },
  { bg: "#18181b", bg2: "#3f3f46", fg: "#fafafa", accent: "#f43f5e" },
]

const noopSubscribe = () => () => {}

function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="size-6 cursor-pointer rounded border-0 bg-transparent p-0" aria-label={label} />
        <span className="font-mono text-xs uppercase">{value}</span>
      </div>
    </div>
  )
}

export function GeneratorView({ initial }: { initial: OgParams }) {
  const [params, setParams] = useState(initial)
  const set = (patch: Partial<OgParams>) => setParams((p) => ({ ...p, ...patch }))
  const query = useDebounced(paramsToSearch(params), 400)
  const src = `/api/og${query ? `?${query}` : ""}`
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => "")
  const [downloading, setDownloading] = useState(false)

  // Keep the URL shareable without adding history entries on every keystroke.
  useEffect(() => {
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname)
  }, [query])

  const usesImage = params.template === "backdrop" || params.template === "split"
  const absoluteUrl = `${origin}${src}`

  async function download() {
    setDownloading(true)
    try {
      const res = await fetch(src)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `og-${params.template}.png`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      toast.error("Could not generate the image")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-6">
        <Card className="overflow-hidden py-0">
          <div className="relative aspect-[1200/630] w-full bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Generated Open Graph image"
              className="absolute inset-0 size-full"
              // the first image can finish loading before hydration attaches onLoad
              ref={(el) => {
                if (el?.complete) setLoadedSrc(src)
              }}
              onLoad={() => setLoadedSrc(src)}
              onError={() => setLoadedSrc(src)}
            />
            {loadedSrc !== src && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs shadow">
                <Loader2Icon className="size-3 animate-spin" /> Rendering
              </div>
            )}
          </div>
        </Card>
        <div className="flex flex-wrap gap-2">
          <Button onClick={download} disabled={downloading}>
            {downloading ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />} Download PNG
          </Button>
          <CopyButton value={absoluteUrl} label="Copy image URL" />
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Use it in your page</h2>
          <CodeBlock
            code={[
              `<meta property="og:image" content="${absoluteUrl.replace(/&/g, "&amp;")}">`,
              `<meta property="og:image:width" content="1200">`,
              `<meta property="og:image:height" content="630">`,
              `<meta name="twitter:card" content="summary_large_image">`,
            ].join("\n")}
          />
          <p className="text-xs text-muted-foreground">
            The dynamic URL renders on request. For production, download the PNG and host it with your site.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Template</Label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => set({ template: t.id })}
                  className={cn(
                    "overflow-hidden rounded-lg border-2 text-left transition-colors",
                    params.template === t.id ? "border-primary" : "border-transparent hover:border-border"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/og?template=${t.id}`} alt="" loading="lazy" className="aspect-[1200/630] w-full bg-muted" />
                  <div className="truncate px-1.5 py-1 text-[11px] font-medium">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="g-title">Title</Label>
            <Textarea id="g-title" rows={2} value={params.title} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-desc">Description</Label>
            <Textarea id="g-desc" rows={2} value={params.description} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="g-site">Site / author</Label>
              <Input id="g-site" value={params.site} onChange={(e) => set({ site: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Font</Label>
              <Select value={params.font} onValueChange={(v) => v && set({ font: v as FontName })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-logo">Logo URL</Label>
            <Input id="g-logo" placeholder="https://…/logo.png" value={params.logo} onChange={(e) => set({ logo: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Colors</Label>
            <div className="flex gap-1.5">
              {PALETTES.map((p, i) => (
                <button
                  key={i}
                  aria-label={`Palette ${i + 1}`}
                  onClick={() => set(p)}
                  className="size-7 rounded-full border shadow-sm"
                  style={{ backgroundImage: `linear-gradient(135deg, ${p.bg} 50%, ${p.accent} 50%)` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ColorField label="Background" value={params.bg} onChange={(bg) => set({ bg })} />
              <ColorField label="Background 2" value={params.bg2} onChange={(bg2) => set({ bg2 })} />
              <ColorField label="Text" value={params.fg} onChange={(fg) => set({ fg })} />
              <ColorField label="Accent" value={params.accent} onChange={(accent) => set({ accent })} />
            </div>
          </div>

          <div className={cn("space-y-2", !usesImage && "opacity-60")}>
            <Label>
              AI backdrop <span className="font-normal text-muted-foreground">(Split &amp; AI backdrop templates)</span>
            </Label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => set({ image: "" })}
                aria-label="No image"
                className={cn(
                  "flex aspect-square items-center justify-center rounded-md border-2 bg-muted",
                  !params.image ? "border-primary" : "border-transparent"
                )}
              >
                <BanIcon className="size-4 text-muted-foreground" />
              </button>
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => set({ image: bg })}
                  className={cn("overflow-hidden rounded-md border-2", params.image === bg ? "border-primary" : "border-transparent")}
                >
                  <Image src={bg} alt="" width={96} height={96} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
            <Input placeholder="…or paste an image URL" value={BACKGROUNDS.includes(params.image) ? "" : params.image} onChange={(e) => set({ image: e.target.value })} />
            {params.template === "backdrop" && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span>Overlay darkness</span>
                  <span className="tabular-nums text-muted-foreground">{params.overlay}%</span>
                </div>
                <Slider value={[params.overlay]} min={0} max={100} onValueChange={(v) => set({ overlay: Array.isArray(v) ? v[0] : v })} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
