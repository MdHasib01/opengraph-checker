import type { CSSProperties, ReactElement } from "react"

export const TEMPLATES = [
  { id: "gradient", name: "Gradient" },
  { id: "minimal", name: "Minimal" },
  { id: "split", name: "Split image" },
  { id: "blog", name: "Blog post" },
  { id: "product", name: "Product" },
  { id: "backdrop", name: "AI backdrop" },
] as const

export type TemplateId = (typeof TEMPLATES)[number]["id"]

export const FONTS = ["Inter", "Space Grotesk", "Poppins", "Playfair Display", "JetBrains Mono"] as const
export type FontName = (typeof FONTS)[number]

export type OgParams = {
  template: TemplateId
  title: string
  description: string
  site: string
  logo: string
  image: string
  bg: string
  bg2: string
  fg: string
  accent: string
  font: FontName
  overlay: number
}

export const DEFAULT_PARAMS: OgParams = {
  template: "gradient",
  title: "Make every link look great when it's shared",
  description: "Preview, debug and generate Open Graph tags and images for every platform.",
  site: "opengraph.check",
  logo: "",
  image: "/backgrounds/bg-1.png",
  bg: "#4f46e5",
  bg2: "#db2777",
  fg: "#ffffff",
  accent: "#facc15",
  font: "Inter",
  overlay: 55,
}

const KEYS = Object.keys(DEFAULT_PARAMS) as (keyof OgParams)[]

export function paramsToSearch(p: OgParams) {
  const sp = new URLSearchParams()
  for (const k of KEYS) {
    if (p[k] !== DEFAULT_PARAMS[k]) sp.set(k, String(p[k]))
  }
  return sp.toString()
}

export function searchToParams(sp: URLSearchParams): OgParams {
  const out = { ...DEFAULT_PARAMS }
  for (const k of KEYS) {
    const v = sp.get(k)
    if (v === null) continue
    if (k === "overlay") out.overlay = Math.min(100, Math.max(0, Number(v) || 0))
    else if (k === "template") out.template = TEMPLATES.some((t) => t.id === v) ? (v as TemplateId) : out.template
    else if (k === "font") out.font = (FONTS as readonly string[]).includes(v) ? (v as FontName) : out.font
    else out[k] = v.slice(0, 500)
  }
  return out
}

function titleSize(title: string, base: number) {
  if (title.length > 90) return base * 0.6
  if (title.length > 60) return base * 0.75
  return base
}

const full: CSSProperties = { width: "100%", height: "100%", display: "flex" }

function Logo({ src, size = 56 }: { src: string; size?: number }) {
  if (!src) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} width={size} height={size} style={{ borderRadius: size / 4, objectFit: "cover" }} alt="" />
}

function SiteRow({ p, color }: { p: OgParams; color: string }) {
  if (!p.site && !p.logo) return null
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <Logo src={p.logo} size={52} />
      {p.site ? <div style={{ fontSize: 30, color, opacity: 0.9 }}>{p.site}</div> : null}
    </div>
  )
}

const templates: Record<TemplateId, (p: OgParams) => ReactElement> = {
  gradient: (p) => (
    <div
      style={{
        ...full,
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        backgroundImage: `linear-gradient(135deg, ${p.bg} 0%, ${p.bg2} 100%)`,
        color: p.fg,
      }}
    >
      <SiteRow p={p} color={p.fg} />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: titleSize(p.title, 72), fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 }}>{p.title}</div>
        {p.description ? <div style={{ fontSize: 32, opacity: 0.85, lineHeight: 1.35 }}>{p.description}</div> : null}
      </div>
      <div style={{ display: "flex", width: 140, height: 10, borderRadius: 5, backgroundColor: p.accent }} />
    </div>
  ),

  minimal: (p) => (
    <div style={{ ...full, backgroundColor: p.bg, color: p.fg, padding: 80, flexDirection: "column", justifyContent: "center" }}>
      <div style={{ display: "flex", width: 80, height: 8, backgroundColor: p.accent, marginBottom: 40 }} />
      <div style={{ fontSize: titleSize(p.title, 76), fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>{p.title}</div>
      {p.description ? <div style={{ fontSize: 32, marginTop: 28, opacity: 0.7, lineHeight: 1.35 }}>{p.description}</div> : null}
      <div style={{ display: "flex", marginTop: "auto" }}>
        <SiteRow p={p} color={p.fg} />
      </div>
    </div>
  ),

  split: (p) => (
    <div style={{ ...full, backgroundColor: p.bg, color: p.fg }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "55%", padding: 64 }}>
        <SiteRow p={p} color={p.fg} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: titleSize(p.title, 60), fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{p.title}</div>
          {p.description ? <div style={{ fontSize: 26, opacity: 0.75, lineHeight: 1.4 }}>{p.description}</div> : null}
        </div>
        <div style={{ display: "flex", width: 90, height: 8, borderRadius: 4, backgroundColor: p.accent }} />
      </div>
      <div style={{ display: "flex", width: "45%", height: "100%", backgroundColor: p.bg2 }}>
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} width={540} height={630} style={{ objectFit: "cover", width: "100%", height: "100%" }} alt="" />
        ) : null}
      </div>
    </div>
  ),

  blog: (p) => (
    <div style={{ ...full, backgroundColor: p.bg, padding: 40 }}>
      <div
        style={{
          ...full,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          borderRadius: 32,
          border: `4px solid ${p.accent}`,
          color: p.fg,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 3,
              padding: "8px 18px",
              borderRadius: 999,
              backgroundColor: p.accent,
              color: p.bg,
            }}
          >
            Article
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: titleSize(p.title, 64), fontWeight: 700, lineHeight: 1.12 }}>{p.title}</div>
          {p.description ? <div style={{ fontSize: 28, opacity: 0.75 }}>{p.description}</div> : null}
        </div>
        <SiteRow p={p} color={p.fg} />
      </div>
    </div>
  ),

  product: (p) => (
    <div
      style={{
        ...full,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 80,
        backgroundColor: p.bg,
        backgroundImage: `radial-gradient(circle at 50% 0%, ${p.bg2} 0%, ${p.bg} 70%)`,
        color: p.fg,
      }}
    >
      {p.logo ? <Logo src={p.logo} size={120} /> : null}
      <div style={{ fontSize: titleSize(p.title, 72), fontWeight: 700, lineHeight: 1.1, marginTop: p.logo ? 36 : 0, letterSpacing: -1.5 }}>
        {p.title}
      </div>
      {p.description ? (
        <div style={{ fontSize: 30, opacity: 0.8, marginTop: 24, maxWidth: 900, lineHeight: 1.35 }}>{p.description}</div>
      ) : null}
      {p.site ? (
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 26,
            padding: "12px 28px",
            borderRadius: 999,
            backgroundColor: p.accent,
            color: p.bg,
            fontWeight: 700,
          }}
        >
          {p.site}
        </div>
      ) : null}
    </div>
  ),

  backdrop: (p) => (
    <div style={{ ...full, position: "relative", backgroundColor: p.bg, color: p.fg }}>
      {p.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, objectFit: "cover" }} alt="" />
      ) : null}
      <div
        style={{
          ...full,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,${(p.overlay / 100) * 0.4}) 0%, rgba(0,0,0,${p.overlay / 100}) 100%)`,
        }}
      />
      <div style={{ ...full, position: "relative", flexDirection: "column", justifyContent: "flex-end", padding: 72, gap: 22 }}>
        <SiteRow p={p} color={p.fg} />
        <div style={{ fontSize: titleSize(p.title, 72), fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>{p.title}</div>
        {p.description ? <div style={{ fontSize: 30, opacity: 0.88, lineHeight: 1.35 }}>{p.description}</div> : null}
      </div>
    </div>
  ),
}

export function renderTemplate(p: OgParams) {
  return <div style={{ ...full, fontFamily: p.font }}>{templates[p.template](p)}</div>
}
