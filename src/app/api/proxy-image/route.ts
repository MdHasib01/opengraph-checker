import { safeFetch } from "@/lib/ssrf"

const MAX_BYTES = 15 * 1024 * 1024

/** Streams a remote image so previews aren't blocked by hotlink protection. */
export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url")
  if (!url) return new Response("Missing url", { status: 400 })
  try {
    const { res } = await safeFetch(url, { accept: "image/*" })
    const type = res.headers.get("content-type") || ""
    if (!res.ok || !res.body || !type.startsWith("image/")) {
      await res.body?.cancel()
      return new Response("Not an image", { status: 404 })
    }
    if (Number(res.headers.get("content-length")) > MAX_BYTES) {
      await res.body.cancel()
      return new Response("Image too large", { status: 413 })
    }
    return new Response(res.body, {
      headers: {
        "content-type": type,
        "cache-control": "public, max-age=3600",
        "x-content-type-options": "nosniff",
        // SVGs can carry script; never let them execute on our origin.
        "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    })
  } catch {
    return new Response("Failed to load image", { status: 502 })
  }
}
