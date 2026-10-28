import { imageSize } from "image-size"
import { readLimited, safeFetch } from "@/lib/ssrf"

const MAX_BYTES = 15 * 1024 * 1024

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url")
  if (!url) return Response.json({ ok: false, error: "Missing url" }, { status: 400 })
  try {
    const { res } = await safeFetch(url, { accept: "image/*" })
    if (!res.ok) {
      await res.body?.cancel()
      return Response.json({ ok: false, error: `Image request returned HTTP ${res.status}` })
    }
    const contentType = res.headers.get("content-type") || undefined
    const declared = Number(res.headers.get("content-length")) || undefined
    const buf = await readLimited(res, MAX_BYTES)
    let width: number | undefined
    let height: number | undefined
    try {
      ;({ width, height } = imageSize(buf))
    } catch {
      // unknown format (e.g. SVG without dimensions); report size only
    }
    return Response.json({ ok: true, contentType, bytes: declared ?? buf.byteLength, width, height })
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : "Failed to load image" })
  }
}
