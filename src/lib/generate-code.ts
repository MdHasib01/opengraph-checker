import type { PreviewData } from "./types"

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
}

export function generateHtml(d: PreviewData) {
  const lines: string[] = ["<!-- HTML Meta Tags -->"]
  if (d.title) lines.push(`<title>${esc(d.title)}</title>`)
  if (d.description) lines.push(`<meta name="description" content="${esc(d.description)}">`)
  lines.push("", "<!-- Facebook / Open Graph Meta Tags -->")
  const og: [string, string][] = [
    ["og:url", d.url],
    ["og:type", d.type],
    ["og:site_name", d.siteName],
    ["og:title", d.title],
    ["og:description", d.description],
    ["og:image", d.image],
    ["og:image:alt", d.imageAlt],
  ]
  for (const [k, v] of og) if (v) lines.push(`<meta property="${k}" content="${esc(v)}">`)
  lines.push("", "<!-- Twitter Meta Tags -->")
  const tw: [string, string][] = [
    ["twitter:card", d.twitterCard],
    ["twitter:site", d.twitterSite],
    ["twitter:creator", d.twitterCreator],
    ["twitter:title", d.title],
    ["twitter:description", d.description],
    ["twitter:image", d.image],
  ]
  for (const [k, v] of tw) if (v) lines.push(`<meta name="${k}" content="${esc(v)}">`)
  lines.push("", "<!-- Meta Tags Generated via OG Checker -->")
  return lines.join("\n")
}

export function generateNextMetadata(d: PreviewData) {
  const q = (s: string) => JSON.stringify(s)
  const opt = (cond: string, line: string) => (cond ? line : null)
  const alt = d.imageAlt ? `, alt: ${q(d.imageAlt)}` : ""
  const out = [
    'import type { Metadata } from "next"',
    "",
    "export const metadata: Metadata = {",
    `  title: ${q(d.title)},`,
    `  description: ${q(d.description)},`,
    "  openGraph: {",
    `    title: ${q(d.title)},`,
    `    description: ${q(d.description)},`,
    opt(d.url, `    url: ${q(d.url)},`),
    opt(d.siteName, `    siteName: ${q(d.siteName)},`),
    `    type: ${q(d.type || "website")},`,
    opt(d.image, `    images: [{ url: ${q(d.image)}, width: 1200, height: 630${alt} }],`),
    "  },",
    "  twitter: {",
    `    card: ${q(d.twitterCard)},`,
    opt(d.twitterSite, `    site: ${q(d.twitterSite)},`),
    opt(d.twitterCreator, `    creator: ${q(d.twitterCreator)},`),
    `    title: ${q(d.title)},`,
    `    description: ${q(d.description)},`,
    opt(d.image, `    images: [${q(d.image)}],`),
    "  },",
    "}",
  ]
  return out.filter((l) => l !== null).join("\n")
}

export function generateReactHelmet(d: PreviewData) {
  return [
    'import { Helmet } from "react-helmet-async"',
    "",
    "export function Seo() {",
    "  return (",
    "    <Helmet>",
    generateHtml(d)
      .split("\n")
      .filter((l) => l && !l.startsWith("<!--"))
      .map((l) => `      ${l.replace(/">$/, '" />')}`)
      .join("\n"),
    "    </Helmet>",
    "  )",
    "}",
  ].join("\n")
}
