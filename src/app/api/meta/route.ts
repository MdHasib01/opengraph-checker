import { z } from "zod"
import { fetchMeta } from "@/lib/fetch-meta"
import { UnsafeUrlError } from "@/lib/ssrf"

const query = z.object({ url: z.string().min(1).max(2048) })

export async function GET(request: Request) {
  const parsed = query.safeParse(Object.fromEntries(new URL(request.url).searchParams))
  if (!parsed.success) {
    return Response.json({ error: "Missing or invalid url parameter" }, { status: 400 })
  }
  try {
    const meta = await fetchMeta(parsed.data.url)
    return Response.json(meta, { headers: { "cache-control": "no-store" } })
  } catch (err) {
    const status = err instanceof UnsafeUrlError ? 400 : 502
    let message = "Failed to fetch URL"
    if (err instanceof Error) {
      message = err.name === "TimeoutError" ? "The site took too long to respond (10s timeout)" : err.message
    }
    return Response.json({ error: message }, { status })
  }
}
