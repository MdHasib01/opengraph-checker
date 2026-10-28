"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react"
import { CheckIcon, DownloadCloudIcon, Loader2Icon, SparklesIcon, UploadIcon, XIcon } from "lucide-react"
import { PLATFORMS } from "@/components/previews"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { shortLinksApi, type LinkFormValues, type ShortLink } from "@/lib/short-links-api"
import { hostname, toPreviewData, type MetaResult, type PreviewData } from "@/lib/types"
import { cn } from "@/lib/utils"

const PREVIEW_PLATFORMS = PLATFORMS.filter((p) =>
  ["facebook", "twitter", "linkedin", "discord", "whatsapp", "slack"].includes(p.id)
)

const noopSubscribe = () => () => {}

const EMPTY: LinkFormValues = {
  destination: "",
  title: "",
  description: "",
  imageUrl: "",
  siteName: "",
  twitterCard: "summary_large_image",
  slug: "",
  imageFile: null,
  removeImage: false,
}

function fromLink(link: ShortLink): LinkFormValues {
  return { ...EMPTY, ...link, imageUrl: link.hasImage ? "" : link.imageUrl, slug: link.slug }
}

function useObjectUrl(file: File | null) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!file) return
    const u = URL.createObjectURL(file)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL must be revoked with the file, so it lives in the effect
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [file])
  return file ? url : null
}

function SlugStatus({ slug }: { slug: string }) {
  const [state, setState] = useState<{ slug: string; available: boolean; reason: string | null } | null>(null)
  useEffect(() => {
    if (!slug) return
    const t = setTimeout(() => {
      shortLinksApi
        .slugAvailable(slug)
        .then((r) => setState({ slug, ...r }))
        .catch(() => {})
    }, 350)
    return () => clearTimeout(t)
  }, [slug])
  if (!slug || state?.slug !== slug) return null
  return state.available ? (
    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
      <CheckIcon className="size-3" /> Available
    </span>
  ) : (
    <span className="text-xs text-red-600 dark:text-red-400">{state.reason}</span>
  )
}

export function LinkForm({
  link,
  onSaved,
  onCancel,
}: {
  /** Edit this link; omit to create a new one. */
  link?: ShortLink
  onSaved: (link: ShortLink) => void
  onCancel?: () => void
}) {
  const [values, setValues] = useState<LinkFormValues>(() => (link ? fromLink(link) : EMPTY))
  const set = (patch: Partial<LinkFormValues>) => setValues((v) => ({ ...v, ...patch }))
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [platform, setPlatform] = useState(PREVIEW_PLATFORMS[0].id)
  const fileInput = useRef<HTMLInputElement>(null)
  const fileUrl = useObjectUrl(values.imageFile)
  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => "")

  const keepsUpload = Boolean(link?.hasImage && !values.removeImage && !values.imageUrl && !values.imageFile)
  const previewImage = fileUrl ?? (keepsUpload ? link!.image : values.imageUrl)
  const shortBase = link ? link.shortUrl.slice(0, -link.slug.length) : `${origin}/s/`
  const preview: PreviewData = {
    url: link?.shortUrl ?? `${shortBase}${values.slug || "your-link"}`,
    title: values.title || "Your title",
    description: values.description,
    image: previewImage,
    siteName: values.siteName,
    type: "website",
    favicon: "",
    twitterCard: values.twitterCard,
    twitterSite: "",
    twitterCreator: "",
    imageAlt: "",
  }

  async function fetchFromDestination() {
    if (!values.destination) return
    const url = /^https?:\/\//i.test(values.destination) ? values.destination : `https://${values.destination}`
    setFetching(true)
    setFetchError(null)
    try {
      const res = await fetch(`/api/meta?url=${encodeURIComponent(url)}`)
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || "Could not fetch that page")
      const d = toPreviewData(body as MetaResult)
      setValues((v) => ({
        ...v,
        destination: url,
        title: d.title,
        description: d.description,
        siteName: d.siteName || hostname(url),
        imageUrl: d.image,
        imageFile: null,
        twitterCard: d.twitterCard,
        removeImage: Boolean(link?.hasImage && d.image),
      }))
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Could not fetch that page")
    } finally {
      setFetching(false)
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const destination = /^https?:\/\//i.test(values.destination) ? values.destination : `https://${values.destination}`
      const payload = { ...values, destination }
      const saved = link ? await shortLinksApi.update(link.slug, payload) : await shortLinksApi.create(payload)
      onSaved(saved)
      if (!link) setValues(EMPTY)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const generatorHref = `/generator?${new URLSearchParams({
    title: values.title || "Your title",
    description: values.description,
    site: values.siteName,
  })}`
  const Preview = PREVIEW_PLATFORMS.find((p) => p.id === platform)!

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="destination">Destination URL</Label>
          <div className="flex gap-2">
            <Input
              id="destination"
              required
              inputMode="url"
              placeholder="https://example.com/very/long/page"
              value={values.destination}
              onChange={(e) => set({ destination: e.target.value })}
            />
            <Button type="button" variant="outline" onClick={fetchFromDestination} disabled={!values.destination || fetching}>
              {fetching ? <Loader2Icon className="animate-spin" /> : <DownloadCloudIcon />}
              Fetch tags
            </Button>
          </div>
          {fetchError ? (
            <p className="text-xs text-red-600 dark:text-red-400">{fetchError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Fetch the page&apos;s current tags, then customise them.</p>
          )}
        </div>

        {!link && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">
                Custom back-half <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <SlugStatus slug={values.slug} />
            </div>
            <div className="flex items-center rounded-lg border focus-within:ring-3 focus-within:ring-ring/50">
              <span className="truncate pl-2.5 text-sm text-muted-foreground">{shortBase}</span>
              <input
                id="slug"
                className="h-8 min-w-0 flex-1 bg-transparent pr-2.5 text-sm outline-none"
                placeholder="random"
                value={values.slug}
                onChange={(e) => set({ slug: e.target.value.replace(/[^a-zA-Z0-9_-]/g, "") })}
                maxLength={40}
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="link-title">Title</Label>
          <Input id="link-title" value={values.title} onChange={(e) => set({ title: e.target.value })} maxLength={300} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="link-description">Description</Label>
          <Textarea
            id="link-description"
            rows={3}
            value={values.description}
            onChange={(e) => set({ description: e.target.value })}
            maxLength={1000}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="link-image">Preview image</Label>
          {values.imageFile ? (
            <div className="flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-sm">
              <span className="truncate">{values.imageFile.name}</span>
              <Button type="button" variant="ghost" size="icon" aria-label="Remove upload" onClick={() => set({ imageFile: null })}>
                <XIcon />
              </Button>
            </div>
          ) : keepsUpload ? (
            <div className="flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-sm">
              <span className="truncate text-muted-foreground">Uploaded image</span>
              <Button type="button" variant="ghost" size="icon" aria-label="Remove image" onClick={() => set({ removeImage: true })}>
                <XIcon />
              </Button>
            </div>
          ) : (
            <Input
              id="link-image"
              placeholder="https://…/image.png"
              value={values.imageUrl}
              onChange={(e) => set({ imageUrl: e.target.value })}
            />
          )}
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) set({ imageFile: file, imageUrl: "" })
                e.target.value = ""
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
              <UploadIcon /> Upload image
            </Button>
            <Link href={generatorHref} target="_blank" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <SparklesIcon /> Design one
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPEG, WebP or GIF up to 5 MB. 1200×630 works best.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="link-site">Site name</Label>
            <Input id="link-site" value={values.siteName} onChange={(e) => set({ siteName: e.target.value })} maxLength={100} />
          </div>
          <div className="space-y-1.5">
            <Label>X card</Label>
            <Select
              items={[
                { value: "summary_large_image", label: "Large image" },
                { value: "summary", label: "Small image" },
              ]}
              value={values.twitterCard}
              onValueChange={(v) => set({ twitterCard: v === "summary" ? "summary" : "summary_large_image" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary_large_image">Large image</SelectItem>
                <SelectItem value="summary">Small image</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        <div className="flex gap-2">
          <Button type="submit" disabled={saving || !values.destination} className="h-9 px-4">
            {saving ? <Loader2Icon className="animate-spin" /> : null}
            {link ? "Save changes" : "Create short link"}
          </Button>
          {onCancel ? (
            <Button type="button" variant="outline" className="h-9" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </div>

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {PREVIEW_PLATFORMS.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                platform === p.id ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className={cn("flex min-h-72 items-center justify-center rounded-xl border p-5", Preview.surface)}>
          <Preview.Component data={preview} />
        </div>
        <p className="text-xs text-muted-foreground">
          Crawlers that unfurl the short link see these tags; people who click it are redirected to the destination.
        </p>
      </div>
    </form>
  )
}
