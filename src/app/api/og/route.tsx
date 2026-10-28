import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "next/og"
import { renderTemplate, searchToParams, type FontName } from "@/lib/og-templates"
import { readLimited, safeFetch } from "@/lib/ssrf"

const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const PUBLIC_DIR = path.join(process.cwd(), "public")

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
}

/**
 * Satori fetches <img> sources itself, so every image is resolved here first:
 * local paths from /public, remote URLs through the SSRF-guarded fetcher.
 */
async function toDataUrl(src: string) {
  if (!src) return ""
  try {
    if (src.startsWith("/")) {
      const file = path.normalize(path.join(PUBLIC_DIR, src))
      if (!file.startsWith(PUBLIC_DIR)) return ""
      const buf = await readFile(file)
      const type = MIME[path.extname(file).toLowerCase()] ?? "image/png"
      return `data:${type};base64,${buf.toString("base64")}`
    }
    const { res } = await safeFetch(src, { accept: "image/*", timeoutMs: 8000 })
    const type = res.headers.get("content-type") || ""
    if (!res.ok || !type.startsWith("image/")) return ""
    const buf = await readLimited(res, MAX_IMAGE_BYTES)
    return `data:${type};base64,${Buffer.from(buf).toString("base64")}`
  } catch {
    return ""
  }
}

const fontCache = new Map<string, Promise<ArrayBuffer | null>>()

/** Loads a TTF from Google Fonts (an old UA gets truetype instead of woff2). */
function loadFont(family: FontName, weight: number) {
  const key = `${family}:${weight}`
  if (!fontCache.has(key)) {
    const promise = (async () => {
      const css = await fetch(
        `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
        { headers: { "user-agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30 (KHTML, like Gecko)" } }
      ).then((r) => r.text())
      const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1]
      if (!url) return null
      return fetch(url).then((r) => r.arrayBuffer())
    })().catch(() => null)
    fontCache.set(key, promise)
  }
  return fontCache.get(key)!
}

export async function GET(request: Request) {
  const params = searchToParams(new URL(request.url).searchParams)
  const [logo, image, regular, bold] = await Promise.all([
    toDataUrl(params.logo),
    toDataUrl(params.image),
    loadFont(params.font, 400),
    loadFont(params.font, 700),
  ])
  const fonts = [
    regular && { name: params.font, data: regular, weight: 400 as const, style: "normal" as const },
    bold && { name: params.font, data: bold, weight: 700 as const, style: "normal" as const },
  ].filter((f) => !!f)

  try {
    return new ImageResponse(renderTemplate({ ...params, logo, image }), {
      width: 1200,
      height: 630,
      fonts: fonts.length ? fonts : undefined,
      headers: { "cache-control": "public, max-age=86400, immutable" },
    })
  } catch (err) {
    console.error(err)
    return new Response("Failed to generate the image", { status: 500 })
  }
}
