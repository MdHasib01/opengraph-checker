import type { CSSProperties, ReactElement } from "react"

// Newest first: this order is the order of the generator's template picker.
export const TEMPLATES = [
  { id: "saas", name: "SaaS launch" },
  { id: "travel", name: "Travel blog" },
  { id: "event", name: "Event" },
  { id: "listing", name: "Real estate" },
  { id: "editorial", name: "Hotel editorial" },
  { id: "restaurant", name: "Restaurant" },
  { id: "shop", name: "Shop product" },
  { id: "news", name: "News article" },
  { id: "device", name: "Tech product" },
  { id: "spotlight", name: "Spotlight" },
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
  eyebrow: string
  cta: string
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
  eyebrow: "",
  cta: "",
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

/** Templates that render `image`; the rest ignore it. */
export const IMAGE_TEMPLATES = new Set<TemplateId>([
  "split", "backdrop", "saas", "travel", "event", "listing", "editorial", "restaurant", "shop", "news", "device", "spotlight",
])

/** Demo content and look for each photo template, so its thumbnail reads like a finished card. */
const PRESETS: Partial<Record<TemplateId, Partial<OgParams>>> = {
  saas: {
    title: "AI agents wired to your tools",
    description: "Connect AI agents to the apps your team already uses and let them work around the clock.",
    eyebrow: "Now in public beta",
    cta: "Start free",
    site: "yourstartup.com",
    image: "/templates/saas.jpg",
    bg: "#f5f3ff",
    bg2: "#ddd6fe",
    fg: "#1e1b4b",
    accent: "#6d28d9",
  },
  travel: {
    title: "My journey from New York to Los Angeles",
    description: "Twelve states, 2,800 miles and one very patient convertible.",
    cta: "Read blog",
    site: "mytrips.blog",
    image: "/templates/roadtrip.jpg",
    bg: "#fffbeb",
    bg2: "#fde68a",
    fg: "#1c1917",
    accent: "#1c1917",
    font: "Poppins",
  },
  event: {
    title: "Build an agentic team with AI",
    description: "Thursday, 12 November · 6:00 pm · Pier 27, San Francisco",
    eyebrow: "Tech Week 2026",
    cta: "Save your seat",
    site: "techweek.events",
    image: "/templates/conference.jpg",
    bg: "#1e1b4b",
    bg2: "#312e81",
    fg: "#ffffff",
    accent: "#f97316",
    font: "Space Grotesk",
  },
  listing: {
    title: "48 Juniper Ridge Rd, Austin, TX 78732",
    description: "4 beds · 3 baths · 2,640 sq ft · 0.4 acre lot",
    eyebrow: "$1,250,000",
    cta: "View listing",
    site: "homesteadrealty.com",
    image: "/templates/house.jpg",
    bg: "#111827",
    bg2: "#1f2937",
    fg: "#f9fafb",
    accent: "#f59e0b",
  },
  editorial: {
    title: "Experience unrivaled comfort",
    description: "Linen-soft suites, a rooftop spa and candlelit dining in the heart of the old town.",
    eyebrow: "Your sanctuary awaits",
    cta: "Reserve your stay",
    site: "The Alder Hotel",
    image: "/templates/hotel.jpg",
    bg: "#f6f1ea",
    bg2: "#e7dccb",
    fg: "#2b2118",
    accent: "#9a6b3c",
    font: "Playfair Display",
  },
  restaurant: {
    title: "Handcrafted desserts & cheesecakes",
    description: "Baked fresh every morning: tortes, brownies and the city's richest chocolate cake.",
    eyebrow: "The new decadence",
    cta: "Order now",
    site: "Cocoa & Crumb",
    image: "/templates/dessert.jpg",
    bg: "#0f0b08",
    bg2: "#2a1d14",
    fg: "#f5ebe0",
    accent: "#d4a373",
    font: "Playfair Display",
  },
  shop: {
    title: "Aura Studio wireless headphones",
    description: "40-hour battery, adaptive noise cancelling and memory-foam comfort.",
    eyebrow: "$249.00",
    cta: "Buy now",
    site: "aura.audio",
    image: "/templates/headphones.jpg",
    bg: "#fdf6ec",
    bg2: "#e9d5b9",
    fg: "#3b2a1a",
    accent: "#b7791f",
    font: "Poppins",
  },
  news: {
    title: "Record autumn rainfall floods downtown streets for a second night",
    description: "Jane Doe · 28 Oct 2026",
    eyebrow: "City desk",
    cta: "Read more",
    site: "dailyledger.news",
    image: "/templates/city.jpg",
    bg: "#7f1d1d",
    bg2: "#450a0a",
    fg: "#ffffff",
    accent: "#fde047",
  },
  device: {
    title: "Find & fix Open Graph issues with ease",
    description: "Preview every platform, catch broken tags and ship cards that get clicked.",
    cta: "Learn more",
    site: "opengraph.check",
    image: "/templates/laptop.jpg",
    bg: "#eef2ff",
    bg2: "#4338ca",
    fg: "#1e1b4b",
    accent: "#4338ca",
    font: "Space Grotesk",
  },
  spotlight: {
    title: "Scale your ads with a three-tier campaign strategy",
    description: "Live with growth lead Dana Reyes · Thursday 4 pm ET",
    eyebrow: "Free masterclass",
    cta: "Save my spot",
    site: "growthlab.co",
    image: "/templates/portrait.jpg",
    bg: "#0f172a",
    bg2: "#1e293b",
    fg: "#ffffff",
    accent: "#fbbf24",
    font: "Poppins",
  },
}

export function presetFor(template: TemplateId): OgParams {
  return { ...DEFAULT_PARAMS, ...PRESETS[template], template }
}

const TEXT_KEYS = ["title", "description", "eyebrow", "cta", "site"] as const

/** Switches to a template's look, keeping any copy the user has already typed. */
export function switchTemplate(p: OgParams, template: TemplateId): OgParams {
  const from = presetFor(p.template)
  const next = presetFor(template)
  for (const k of TEXT_KEYS) if (p[k] !== from[k]) next[k] = p[k]
  return { ...next, logo: p.logo }
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

function SiteRow({ p, color, size = 30 }: { p: OgParams; color: string; size?: number }) {
  if (!p.site && !p.logo) return null
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.6 }}>
      <Logo src={p.logo} size={Math.round(size * 1.7)} />
      {p.site ? <div style={{ fontSize: size, color, opacity: 0.9 }}>{p.site}</div> : null}
    </div>
  )
}

function Photo({ p, style }: { p: OgParams; style: CSSProperties }) {
  if (!p.image) return <div style={{ display: "flex", backgroundColor: p.bg2, ...style }} />
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={p.image} width={1200} height={630} style={{ objectFit: "cover", ...style }} alt="" />
}

type CtaProps = { p: OgParams; bg?: string; color?: string; size?: number; radius?: number }

function Cta({ p, bg = p.accent, color = "#ffffff", size = 24, radius = 999 }: CtaProps) {
  if (!p.cta) return null
  return (
    <div
      style={{
        display: "flex",
        fontSize: size,
        fontWeight: 700,
        padding: `${size * 0.6}px ${size * 1.3}px`,
        borderRadius: radius,
        backgroundColor: bg,
        color,
      }}
    >
      {p.cta}
    </div>
  )
}

function Eyebrow({ p, color = p.accent, size = 22, style }: { p: OgParams; color?: string; size?: number; style?: CSSProperties }) {
  if (!p.eyebrow) return null
  return (
    <div style={{ display: "flex", fontSize: size, fontWeight: 700, textTransform: "uppercase", letterSpacing: size * 0.12, color, ...style }}>
      {p.eyebrow}
    </div>
  )
}

const cover: CSSProperties = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }

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

  saas: (p) => (
    <div
      style={{
        ...full,
        alignItems: "center",
        gap: 56,
        padding: "0 72px",
        backgroundColor: p.bg,
        backgroundImage: `radial-gradient(circle at 82% 50%, ${p.bg2} 0%, ${p.bg} 60%)`,
        color: p.fg,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, gap: 24 }}>
        <SiteRow p={p} color={p.fg} size={24} />
        <Eyebrow p={p} size={17} style={{ padding: "8px 16px", borderRadius: 999, border: `2px solid ${p.accent}` }} />
        <div style={{ fontSize: titleSize(p.title, 64), fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>{p.title}</div>
        {p.description ? <div style={{ fontSize: 26, opacity: 0.7, lineHeight: 1.4 }}>{p.description}</div> : null}
        <Cta p={p} size={22} radius={12} />
      </div>
      <Photo p={p} style={{ flexShrink: 0, width: 460, height: 460, borderRadius: 36, boxShadow: "0 30px 60px rgba(30,27,75,0.3)" }} />
    </div>
  ),

  travel: (p) => (
    <div
      style={{
        ...full,
        alignItems: "center",
        gap: 72,
        padding: "0 80px",
        backgroundImage: `linear-gradient(135deg, ${p.bg} 50%, ${p.bg2} 100%)`,
        color: p.fg,
      }}
    >
      <div
        style={{
          display: "flex",
          flexShrink: 0,
          padding: 14,
          borderRadius: 24,
          backgroundColor: "#ffffff",
          transform: "rotate(-4deg)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
        }}
      >
        <Photo p={p} style={{ width: 460, height: 400, borderRadius: 14 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, gap: 24 }}>
        <SiteRow p={p} color={p.fg} size={22} />
        <div style={{ fontSize: titleSize(p.title, 58), fontWeight: 700, lineHeight: 1.12, letterSpacing: -1 }}>{p.title}</div>
        {p.description ? <div style={{ fontSize: 26, opacity: 0.7, lineHeight: 1.4 }}>{p.description}</div> : null}
        <Cta p={p} color={p.bg} size={22} />
      </div>
    </div>
  ),

  event: (p) => (
    <div style={{ ...full, backgroundColor: p.bg, color: p.fg }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: 640,
          padding: 64,
          backgroundImage: `linear-gradient(160deg, ${p.bg} 0%, ${p.bg2} 100%)`,
        }}
      >
        <SiteRow p={p} color={p.fg} size={24} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22 }}>
          <Eyebrow p={p} size={18} color={p.bg} style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: p.accent }} />
          <div style={{ fontSize: titleSize(p.title, 62), fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>{p.title}</div>
          {p.description ? <div style={{ fontSize: 26, opacity: 0.8, lineHeight: 1.4 }}>{p.description}</div> : null}
        </div>
        <Cta p={p} size={22} radius={12} />
      </div>
      <div style={{ display: "flex", position: "relative", flex: 1 }}>
        <Photo p={p} style={{ width: "100%", height: "100%" }} />
        <div style={{ display: "flex", position: "absolute", left: -56, bottom: 56, width: 112, height: 112, borderRadius: 999, backgroundColor: p.accent }} />
      </div>
    </div>
  ),

  listing: (p) => (
    <div style={{ ...full, gap: 48, padding: 40, backgroundColor: p.bg, color: p.fg }}>
      <Photo p={p} style={{ flexShrink: 0, width: 600, height: 550, borderRadius: 28 }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", flex: 1, padding: "12px 0" }}>
        <SiteRow p={p} color={p.fg} size={22} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
          <Eyebrow p={p} size={52} style={{ letterSpacing: -1, textTransform: "none" }} />
          <div style={{ fontSize: titleSize(p.title, 40), fontWeight: 700, lineHeight: 1.2 }}>{p.title}</div>
          {p.description ? <div style={{ fontSize: 24, opacity: 0.7, lineHeight: 1.4 }}>{p.description}</div> : null}
        </div>
        <Cta p={p} color={p.bg} size={22} radius={12} />
      </div>
    </div>
  ),

  editorial: (p) => (
    <div style={{ ...full, backgroundColor: p.bg, color: p.fg }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", width: 600, padding: "56px 64px" }}>
        <SiteRow p={p} color={p.fg} size={22} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22 }}>
          <div style={{ display: "flex", width: 64, height: 3, backgroundColor: p.accent }} />
          <Eyebrow p={p} size={17} />
          <div style={{ fontSize: titleSize(p.title, 64), lineHeight: 1.1 }}>{p.title}</div>
          {p.description ? <div style={{ fontSize: 24, opacity: 0.75, lineHeight: 1.45 }}>{p.description}</div> : null}
        </div>
        <Cta p={p} size={18} radius={4} />
      </div>
      <div style={{ display: "flex", flex: 1, padding: "28px 28px 28px 0" }}>
        <Photo p={p} style={{ width: "100%", height: "100%", borderRadius: 4 }} />
      </div>
    </div>
  ),

  restaurant: (p) => (
    <div style={{ ...full, position: "relative", backgroundColor: p.bg, color: p.fg }}>
      <Photo p={p} style={{ position: "absolute", top: 0, right: 0, width: 720, height: 630 }} />
      <div style={{ ...cover, display: "flex", backgroundImage: `linear-gradient(90deg, ${p.bg} 0%, ${p.bg} 42%, transparent 75%)` }} />
      <div
        style={{
          ...full,
          position: "relative",
          width: 680,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 22,
          padding: 72,
        }}
      >
        <SiteRow p={p} color={p.accent} size={24} />
        <Eyebrow p={p} size={17} style={{ marginTop: 12 }} />
        <div style={{ fontSize: titleSize(p.title, 64), lineHeight: 1.1 }}>{p.title}</div>
        {p.description ? <div style={{ fontSize: 24, opacity: 0.75, lineHeight: 1.45 }}>{p.description}</div> : null}
        <Cta p={p} color={p.bg} size={20} radius={4} />
      </div>
    </div>
  ),

  shop: (p) => (
    <div
      style={{
        ...full,
        alignItems: "center",
        gap: 64,
        padding: "0 72px",
        backgroundImage: `linear-gradient(120deg, ${p.bg} 0%, ${p.bg} 45%, ${p.bg2} 100%)`,
        color: p.fg,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, gap: 22 }}>
        <SiteRow p={p} color={p.fg} size={22} />
        <div style={{ fontSize: titleSize(p.title, 58), fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{p.title}</div>
        <Eyebrow p={p} size={36} style={{ letterSpacing: 0, textTransform: "none" }} />
        {p.description ? <div style={{ fontSize: 24, opacity: 0.7, lineHeight: 1.4 }}>{p.description}</div> : null}
        <Cta p={p} bg={p.fg} color={p.bg} size={22} />
      </div>
      <div style={{ display: "flex", flexShrink: 0, padding: 16, borderRadius: 40, backgroundColor: "#ffffff", boxShadow: "0 30px 60px rgba(59,42,26,0.25)" }}>
        <Photo p={p} style={{ width: 440, height: 440, borderRadius: 28 }} />
      </div>
    </div>
  ),

  news: (p) => (
    <div style={{ ...full, flexDirection: "column", backgroundColor: p.bg, color: p.fg }}>
      <div style={{ display: "flex", position: "relative", height: 360 }}>
        <Photo p={p} style={{ width: "100%", height: "100%" }} />
        <Eyebrow p={p} size={18} color={p.bg} style={{ position: "absolute", top: 32, left: 40, padding: "8px 16px", backgroundColor: p.accent }} />
        {p.site || p.logo ? (
          <div style={{ display: "flex", position: "absolute", top: 28, right: 40, padding: "8px 18px", borderRadius: 999, backgroundColor: "rgba(0,0,0,0.6)" }}>
            <SiteRow p={p} color="#ffffff" size={20} />
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, gap: 18, padding: "0 40px" }}>
        <div style={{ fontSize: titleSize(p.title, 52), fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.5 }}>{p.title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 22, opacity: 0.8 }}>{p.description}</div>
          <Cta p={p} bg={p.fg} color={p.bg} size={18} />
        </div>
      </div>
    </div>
  ),

  device: (p) => (
    <div
      style={{
        ...full,
        alignItems: "center",
        backgroundImage: `linear-gradient(105deg, ${p.bg2} 0%, ${p.bg2} 38%, ${p.bg} 38%, ${p.bg} 100%)`,
        color: p.fg,
      }}
    >
      <div
        style={{
          display: "flex",
          flexShrink: 0,
          marginLeft: 64,
          padding: 10,
          borderRadius: 24,
          backgroundColor: "#ffffff",
          transform: "rotate(-3deg)",
          boxShadow: "0 30px 60px rgba(15,23,42,0.35)",
        }}
      >
        <Photo p={p} style={{ width: 520, height: 360, borderRadius: 16 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, gap: 22, padding: "0 64px 0 72px" }}>
        <SiteRow p={p} color={p.fg} size={22} />
        <div style={{ fontSize: titleSize(p.title, 54), fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{p.title}</div>
        {p.description ? <div style={{ fontSize: 24, opacity: 0.7, lineHeight: 1.4 }}>{p.description}</div> : null}
        <Cta p={p} size={20} radius={10} />
      </div>
    </div>
  ),

  spotlight: (p) => (
    <div style={{ ...full, position: "relative", backgroundColor: p.bg, color: p.fg }}>
      <Photo p={p} style={{ position: "absolute", top: 0, right: 0, width: 600, height: 630 }} />
      <div
        style={{
          ...cover,
          display: "flex",
          backgroundImage: `linear-gradient(105deg, ${p.bg} 0%, ${p.bg} 58%, ${p.accent} 58%, ${p.accent} 61%, transparent 61%)`,
        }}
      />
      <div
        style={{
          ...full,
          position: "relative",
          width: 640,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 22,
          padding: 72,
        }}
      >
        <SiteRow p={p} color={p.fg} size={22} />
        <Eyebrow p={p} size={17} style={{ marginTop: 8 }} />
        <div style={{ fontSize: titleSize(p.title, 52), fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{p.title}</div>
        {p.description ? <div style={{ fontSize: 24, opacity: 0.75, lineHeight: 1.4 }}>{p.description}</div> : null}
        <Cta p={p} color={p.bg} size={20} radius={8} />
      </div>
    </div>
  ),
}

export function renderTemplate(p: OgParams) {
  return <div style={{ ...full, fontFamily: p.font }}>{templates[p.template](p)}</div>
}
