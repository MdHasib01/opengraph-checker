import type { MetaResult, PreviewData } from "./types"

export type ImageInfo = {
  ok: boolean
  contentType?: string
  bytes?: number
  width?: number
  height?: number
  error?: string
}

export type Issue = {
  level: "error" | "warning" | "success"
  title: string
  detail?: string
}

const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"]

export function validate(meta: MetaResult, data: PreviewData, image?: ImageInfo | null): Issue[] {
  const issues: Issue[] = []
  const has = (k: string) => Boolean(meta.og[k] || meta.twitter[k])

  for (const key of ["og:title", "og:description", "og:image", "og:url", "og:type"]) {
    if (!meta.og[key]) {
      issues.push({
        level: key === "og:type" || key === "og:url" ? "warning" : "error",
        title: `Missing ${key}`,
        detail: `Add <meta property="${key}" content="..."> to your page head.`,
      })
    }
  }
  if (!meta.og["og:site_name"]) {
    issues.push({
      level: "warning",
      title: "Missing og:site_name",
      detail: "Facebook, Discord and Slack show the site name above the title.",
    })
  }
  if (!has("twitter:card")) {
    issues.push({
      level: "warning",
      title: "Missing twitter:card",
      detail: "X/Twitter falls back to a small summary card without it. Use summary_large_image for big previews.",
    })
  }
  if (!meta.description) {
    issues.push({
      level: "warning",
      title: "Missing meta description",
      detail: 'Google uses <meta name="description"> for search snippets.',
    })
  }
  if (!meta.title) issues.push({ level: "error", title: "Missing <title> tag" })

  const t = data.title.length
  if (t > 0 && t < 15) issues.push({ level: "warning", title: `Title is short (${t} chars)`, detail: "Aim for 40–60 characters." })
  if (t > 60) issues.push({ level: "warning", title: `Title is long (${t} chars)`, detail: "Titles over 60 characters get truncated on most platforms." })

  const d = data.description.length
  if (d > 0 && d < 50) issues.push({ level: "warning", title: `Description is short (${d} chars)`, detail: "Aim for 110–160 characters." })
  if (d > 160) issues.push({ level: "warning", title: `Description is long (${d} chars)`, detail: "Descriptions over 160 characters get truncated." })

  if (data.image && !/^https?:\/\//.test(data.image)) {
    issues.push({ level: "error", title: "og:image must be an absolute URL", detail: data.image })
  }
  if (data.image.startsWith("http://")) {
    issues.push({ level: "warning", title: "og:image uses http://", detail: "Some platforms only load images over HTTPS." })
  }

  if (image) {
    if (!image.ok) {
      issues.push({ level: "error", title: "og:image could not be loaded", detail: image.error })
    } else {
      const type = image.contentType
      if (type && !SUPPORTED_IMAGE_TYPES.some((s) => type.startsWith(s))) {
        issues.push({ level: "warning", title: `Image type ${type} may not be supported`, detail: "Use PNG, JPEG, GIF or WebP." })
      }
      const mb = (image.bytes ?? 0) / 1024 / 1024
      if (mb > 5) {
        issues.push({ level: "error", title: `Image is ${mb.toFixed(1)} MB`, detail: "X/Twitter rejects images over 5 MB." })
      } else if (mb > 1) {
        issues.push({ level: "warning", title: `Image is ${mb.toFixed(1)} MB`, detail: "Large images load slowly in previews. Keep under 1 MB if you can." })
      }
      if (image.width && image.height) {
        const ratio = image.width / image.height
        if (image.width < 200 || image.height < 200) {
          issues.push({ level: "error", title: `Image is too small (${image.width}×${image.height})`, detail: "Facebook requires at least 200×200." })
        } else if (image.width < 1200 || image.height < 630) {
          issues.push({ level: "warning", title: `Image is ${image.width}×${image.height}`, detail: "1200×630 is recommended for sharp large previews." })
        }
        if (Math.abs(ratio - 1.91) > 0.15 && data.twitterCard === "summary_large_image") {
          issues.push({ level: "warning", title: `Image aspect ratio is ${ratio.toFixed(2)}:1`, detail: "Large cards crop to 1.91:1, so parts of the image may be cut off." })
        }
      }
    }
  }

  for (const dup of meta.duplicates) {
    issues.push({ level: "warning", title: `Duplicate ${dup} tag`, detail: "Platforms usually read the first one; remove the others." })
  }

  const passed = [
    meta.og["og:title"] && "og:title is set",
    meta.og["og:description"] && "og:description is set",
    meta.og["og:image"] && "og:image is set",
    has("twitter:card") && "twitter:card is set",
    meta.canonical && "Canonical URL is set",
    image?.ok && (image.width ?? 0) >= 1200 && (image.height ?? 0) >= 630 && "Image is at least 1200×630",
  ].filter((p): p is string => typeof p === "string")
  for (const p of passed) issues.push({ level: "success", title: p })

  return issues
}
