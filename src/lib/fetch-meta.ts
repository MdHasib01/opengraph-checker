import * as cheerio from "cheerio"
import { readLimited, safeFetch } from "./ssrf"
import type { MetaResult, RawTag } from "./types"

const MAX_HTML_BYTES = 5 * 1024 * 1024

const URL_KEYS = new Set([
  "og:image",
  "og:image:url",
  "og:image:secure_url",
  "og:url",
  "og:video",
  "og:video:url",
  "og:audio",
  "twitter:image",
  "twitter:image:src",
  "twitter:player",
])

function absolutize(value: string, base: string) {
  try {
    return new URL(value, base).toString()
  } catch {
    return value
  }
}

export function normalizeUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ""
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function parseMeta(html: string, baseUrl: string) {
  const $ = cheerio.load(html)
  const allTags: RawTag[] = []
  const og: Record<string, string> = {}
  const twitter: Record<string, string> = {}
  const seen = new Map<string, number>()
  let description = ""
  let themeColor = ""

  const title = $("head title").first().text().trim() || $("title").first().text().trim()
  if (title) allTags.push({ tag: "title", key: "title", value: title })

  $("meta").each((_, el) => {
    const attrs = $(el).attr()
    if (!attrs) return
    const key = (attrs.property || attrs.name || attrs.itemprop || attrs["http-equiv"] || attrs.charset && "charset" || "").trim()
    const value = (attrs.content ?? attrs.charset ?? "").trim()
    if (!key) return
    allTags.push({ tag: "meta", key, value })
    const lower = key.toLowerCase()
    seen.set(lower, (seen.get(lower) ?? 0) + 1)

    if (lower.startsWith("og:") || lower.startsWith("article:") || lower.startsWith("fb:")) {
      // keep the first occurrence; later duplicates are reported separately
      if (!(lower in og)) og[lower] = URL_KEYS.has(lower) ? absolutize(value, baseUrl) : value
    } else if (lower.startsWith("twitter:")) {
      if (!(lower in twitter)) {
        twitter[lower] = URL_KEYS.has(lower) ? absolutize(value, baseUrl) : value
      }
    } else if (lower === "description" && !description) {
      description = value
    } else if (lower === "theme-color" && !themeColor) {
      themeColor = value
    }
  })

  let canonical = ""
  let favicon = ""
  $("link[rel]").each((_, el) => {
    const rel = ($(el).attr("rel") || "").toLowerCase()
    const href = $(el).attr("href")
    if (!href) return
    if (!["canonical", "icon", "shortcut icon", "apple-touch-icon", "manifest", "alternate"].includes(rel)) return
    allTags.push({ tag: "link", key: rel, value: absolutize(href, baseUrl) })
    if (rel === "canonical" && !canonical) canonical = absolutize(href, baseUrl)
    if ((rel === "icon" || rel === "shortcut icon") && !favicon) favicon = absolutize(href, baseUrl)
    if (rel === "apple-touch-icon" && !favicon) favicon = absolutize(href, baseUrl)
  })
  if (!favicon) favicon = absolutize("/favicon.ico", baseUrl)

  // Multiple og:image tags are legitimate (image arrays); only flag the singletons.
  const singletons = ["og:title", "og:description", "og:url", "og:type", "og:site_name", "twitter:card", "twitter:title", "twitter:description", "description"]
  const duplicates = singletons.filter((k) => (seen.get(k) ?? 0) > 1)

  return { title, description, canonical, favicon, themeColor, og, twitter, allTags, duplicates }
}

export async function fetchMeta(rawUrl: string): Promise<MetaResult> {
  const requestedUrl = normalizeUrl(rawUrl)
  const started = Date.now()
  const { res, finalUrl } = await safeFetch(requestedUrl)
  const contentType = res.headers.get("content-type") || ""
  if (contentType && !/html|xml/i.test(contentType)) {
    await res.body?.cancel()
    throw new Error(`URL returned ${contentType}, not an HTML page`)
  }
  const bytes = await readLimited(res, MAX_HTML_BYTES)
  const html = new TextDecoder("utf-8").decode(bytes)
  const parsed = parseMeta(html, finalUrl)
  return {
    requestedUrl,
    finalUrl,
    status: res.status,
    timingMs: Date.now() - started,
    ...parsed,
  }
}
