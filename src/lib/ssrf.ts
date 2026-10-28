import { lookup } from "node:dns/promises"
import { isIP } from "node:net"

const MAX_REDIRECTS = 5

function isPrivateV4(ip: string) {
  const [a, b] = ip.split(".").map(Number)
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  )
}

function isPrivateIp(ip: string) {
  if (isIP(ip) === 4) return isPrivateV4(ip)
  const v6 = ip.toLowerCase()
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return isPrivateV4(mapped[1])
  return (
    v6 === "::" ||
    v6 === "::1" ||
    v6.startsWith("fc") ||
    v6.startsWith("fd") ||
    v6.startsWith("fe80") ||
    v6.startsWith("ff")
  )
}

export class UnsafeUrlError extends Error {}

/** Throws if the URL is not http(s) or resolves to a private/loopback address. */
export async function assertPublicUrl(raw: string) {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new UnsafeUrlError("Invalid URL")
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Only http and https URLs are supported")
  }
  if (url.username || url.password) {
    throw new UnsafeUrlError("URLs with credentials are not allowed")
  }
  const host = url.hostname.replace(/^\[|\]$/g, "")
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal")) {
    throw new UnsafeUrlError("Private addresses are not allowed")
  }
  const addresses = isIP(host)
    ? [{ address: host }]
    : await lookup(host, { all: true }).catch(() => {
        throw new UnsafeUrlError(`Could not resolve ${host}`)
      })
  if (addresses.some((a) => isPrivateIp(a.address))) {
    throw new UnsafeUrlError("Private addresses are not allowed")
  }
  return url
}

export const USER_AGENT =
  "Mozilla/5.0 (compatible; OGChecker/1.0; +https://github.com/) facebookexternalhit/1.1 Twitterbot/1.0"

/**
 * fetch() that validates every hop of a redirect chain against private
 * addresses and aborts after `timeoutMs`.
 */
export async function safeFetch(
  raw: string,
  init: { accept?: string; timeoutMs?: number } = {}
) {
  let current = raw
  const signal = AbortSignal.timeout(init.timeoutMs ?? 10_000)
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertPublicUrl(current)
    const res = await fetch(current, {
      redirect: "manual",
      signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: init.accept ?? "text/html,application/xhtml+xml,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    })
    const location = res.headers.get("location")
    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, current).toString()
      continue
    }
    return { res, finalUrl: current }
  }
  throw new UnsafeUrlError("Too many redirects")
}

/** Reads a response body, stopping at `maxBytes`. */
export async function readLimited(res: Response, maxBytes: number) {
  if (!res.body) return new Uint8Array()
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    total += value.byteLength
    if (total >= maxBytes) {
      await reader.cancel()
      break
    }
  }
  const out = new Uint8Array(Math.min(total, maxBytes))
  let offset = 0
  for (const c of chunks) {
    const slice = c.subarray(0, out.length - offset)
    out.set(slice, offset)
    offset += slice.length
    if (offset >= out.length) break
  }
  return out
}
