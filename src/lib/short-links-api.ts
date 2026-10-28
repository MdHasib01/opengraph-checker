"use client"

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "")

export type ShortLink = {
  slug: string
  shortUrl: string
  destination: string
  title: string
  description: string
  imageUrl: string
  hasImage: boolean
  image: string
  siteName: string
  twitterCard: "summary" | "summary_large_image"
  clicks: number
  crawls: number
  lastClickAt: string | null
  createdAt: string
  updatedAt: string
}

export type Breakdown = { name: string; count: number }[]

export type LinkStats = {
  daily: { date: string; clicks: number }[]
  referrers: Breakdown
  devices: Breakdown
  countries: Breakdown
  crawlers: Breakdown
}

export type LinkFormValues = {
  destination: string
  title: string
  description: string
  imageUrl: string
  siteName: string
  twitterCard: "summary" | "summary_large_image"
  slug: string
  imageFile: File | null
  removeImage: boolean
}

const TOKEN_KEY = "og-checker:owner-token"

/**
 * Links are owned by an anonymous token kept in this browser. Clearing site
 * data (or switching browsers) loses access to the links, so the UI lets
 * people export and import it.
 */
export function getOwnerToken() {
  let token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    token = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "")
    localStorage.setItem(TOKEN_KEY, token)
  }
  return token
}

export function setOwnerToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "x-owner-token": getOwnerToken(), ...init.headers },
    })
  } catch {
    throw new Error(`Can't reach the short-link API at ${API_URL}. Is the server running?`)
  }
  if (res.status === 204) return undefined as T
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body as T
}

function toFormData(values: LinkFormValues, includeSlug: boolean) {
  const fd = new FormData()
  fd.set("destination", values.destination)
  fd.set("title", values.title)
  fd.set("description", values.description)
  fd.set("imageUrl", values.imageFile ? "" : values.imageUrl)
  fd.set("siteName", values.siteName)
  fd.set("twitterCard", values.twitterCard)
  if (includeSlug && values.slug) fd.set("slug", values.slug)
  if (values.imageFile) fd.set("image", values.imageFile)
  if (values.removeImage) fd.set("removeImage", "true")
  return fd
}

export const shortLinksApi = {
  list: () => request<{ links: ShortLink[] }>("/api/links").then((r) => r.links),
  create: (values: LinkFormValues) =>
    request<{ link: ShortLink }>("/api/links", { method: "POST", body: toFormData(values, true) }).then((r) => r.link),
  update: (slug: string, values: LinkFormValues) =>
    request<{ link: ShortLink }>(`/api/links/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      body: toFormData(values, false),
    }).then((r) => r.link),
  remove: (slug: string) => request<void>(`/api/links/${encodeURIComponent(slug)}`, { method: "DELETE" }),
  stats: (slug: string, days: number) =>
    request<{ link: ShortLink; stats: LinkStats }>(`/api/links/${encodeURIComponent(slug)}/stats?days=${days}`),
  slugAvailable: (slug: string) =>
    request<{ available: boolean; reason: string | null }>(`/api/slugs/${encodeURIComponent(slug)}/available`),
}
