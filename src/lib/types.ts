export type RawTag = {
  tag: "meta" | "link" | "title"
  key: string
  value: string
}

export type MetaResult = {
  requestedUrl: string
  finalUrl: string
  status: number
  timingMs: number
  title: string
  description: string
  canonical: string
  favicon: string
  themeColor: string
  og: Record<string, string>
  twitter: Record<string, string>
  allTags: RawTag[]
  duplicates: string[]
}

/** The editable fields every platform preview is rendered from. */
export type PreviewData = {
  url: string
  title: string
  description: string
  image: string
  siteName: string
  type: string
  favicon: string
  twitterCard: "summary" | "summary_large_image"
  twitterSite: string
  twitterCreator: string
  imageAlt: string
}

export function toPreviewData(meta: MetaResult): PreviewData {
  const card = meta.twitter["twitter:card"]
  return {
    url: meta.og["og:url"] || meta.canonical || meta.finalUrl,
    title: meta.og["og:title"] || meta.twitter["twitter:title"] || meta.title,
    description:
      meta.og["og:description"] ||
      meta.twitter["twitter:description"] ||
      meta.description,
    image:
      meta.og["og:image"] ||
      meta.og["og:image:url"] ||
      meta.og["og:image:secure_url"] ||
      meta.twitter["twitter:image"] ||
      meta.twitter["twitter:image:src"] ||
      "",
    siteName: meta.og["og:site_name"] || "",
    type: meta.og["og:type"] || "website",
    favicon: meta.favicon,
    twitterCard: card === "summary" ? "summary" : "summary_large_image",
    twitterSite: meta.twitter["twitter:site"] || "",
    twitterCreator: meta.twitter["twitter:creator"] || "",
    imageAlt: meta.og["og:image:alt"] || meta.twitter["twitter:image:alt"] || "",
  }
}

export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}
