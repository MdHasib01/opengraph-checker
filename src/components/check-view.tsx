"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  ExternalLinkIcon,
  TriangleAlertIcon,
  XCircleIcon,
} from "lucide-react"
import { CodeBlock, CopyButton } from "@/components/code-block"
import { MetaEditor } from "@/components/meta-editor"
import { PLATFORMS } from "@/components/previews"
import { Favicon, PreviewImage } from "@/components/previews/shared"
import { UrlForm } from "@/components/url-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateHtml, generateNextMetadata, generateReactHelmet } from "@/lib/generate-code"
import { hostname, toPreviewData, type MetaResult, type PreviewData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { validate, type ImageInfo, type Issue } from "@/lib/validate"

type State =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; meta: MetaResult }

export function CheckView({ url }: { url: string }) {
  const [state, setState] = useState<State>({ status: "loading" })
  const [edits, setEdits] = useState<Partial<PreviewData>>({})

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/meta?url=${encodeURIComponent(url)}`, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
        setState({ status: "ready", meta: body })
      })
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error", error: err.message })
      })
    return () => controller.abort()
  }, [url])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <UrlForm defaultValue={url} size="sm" className="max-w-2xl" />
      {state.status === "loading" && <LoadingState />}
      {state.status === "error" && (
        <Alert variant="destructive" className="mt-8 max-w-2xl">
          <AlertCircleIcon />
          <AlertTitle>Couldn&apos;t check {hostname(url)}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.status === "ready" && (
        <Results meta={state.meta} edits={edits} onEdit={(p) => setEdits((e) => ({ ...e, ...p }))} onReset={() => setEdits({})} />
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        <Skeleton className="aspect-[1.91/1] w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    </div>
  )
}

function useImageInfo(src: string) {
  const [info, setInfo] = useState<{ src: string; info: ImageInfo } | null>(null)
  useEffect(() => {
    if (!/^https?:\/\//.test(src)) return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetch(`/api/image-info?url=${encodeURIComponent(src)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((info: ImageInfo) => setInfo({ src, info }))
        .catch(() => {})
    }, 500)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [src])
  if (!src) return null
  return info?.src === src ? info.info : null
}

function Results({
  meta,
  edits,
  onEdit,
  onReset,
}: {
  meta: MetaResult
  edits: Partial<PreviewData>
  onEdit: (patch: Partial<PreviewData>) => void
  onReset: () => void
}) {
  const original = useMemo(() => toPreviewData(meta), [meta])
  const data = { ...original, ...edits }
  const imageInfo = useImageInfo(data.image)
  const issues = validate(meta, data, imageInfo)
  const errors = issues.filter((i) => i.level === "error").length
  const warnings = issues.filter((i) => i.level === "warning").length
  const [platform, setPlatform] = useState("all")
  const shown = platform === "all" ? PLATFORMS : PLATFORMS.filter((p) => p.id === platform)

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-6">
        <Card className="overflow-hidden pt-0">
          <PreviewImage src={data.image} alt={data.imageAlt} className="aspect-[1.91/1] w-full" />
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Favicon src={data.favicon} className="size-4" />
              <a href={meta.finalUrl} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-1 hover:text-foreground">
                <span className="truncate">{hostname(meta.finalUrl)}</span>
                <ExternalLinkIcon className="size-3 shrink-0" />
              </a>
            </div>
            <div className="font-semibold leading-snug">{data.title || "No title"}</div>
            <p className="line-clamp-3 text-sm text-muted-foreground">{data.description || "No description"}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={meta.status < 400 ? "secondary" : "destructive"}>HTTP {meta.status}</Badge>
              <Badge variant="outline">
                <ClockIcon /> {meta.timingMs} ms
              </Badge>
              {imageInfo?.ok && imageInfo.width ? (
                <Badge variant="outline">
                  {imageInfo.width}×{imageInfo.height}
                </Badge>
              ) : null}
              {imageInfo?.ok && imageInfo.bytes ? (
                <Badge variant="outline">{Math.round(imageInfo.bytes / 1024)} KB</Badge>
              ) : null}
            </div>
            {meta.finalUrl !== meta.requestedUrl ? (
              <p className="text-xs break-all text-muted-foreground">Redirected to {meta.finalUrl}</p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <MetaEditor data={data} onChange={onEdit} onReset={onReset} dirty={Object.keys(edits).length > 0} />
          </CardContent>
        </Card>
      </aside>

      <Tabs defaultValue="previews" className="min-w-0">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
          <TabsTrigger value="previews">Previews</TabsTrigger>
          <TabsTrigger value="report">
            Report
            {errors > 0 ? (
              <Badge variant="destructive" className="h-4 px-1.5">{errors}</Badge>
            ) : warnings > 0 ? (
              <Badge className="h-4 bg-amber-500 px-1.5 text-white">{warnings}</Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="tags">All tags ({meta.allTags.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="previews" className="mt-4">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {[{ id: "all", name: "All" }, ...PLATFORMS].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  platform === p.id ? "border-foreground bg-foreground text-background" : "hover:bg-muted"
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className={cn("grid gap-4", platform === "all" && "xl:grid-cols-2")}>
            {shown.map(({ id, name, Component, surface }) => (
              <Card key={id} className="gap-0 overflow-hidden py-0">
                <div className="border-b px-4 py-2.5 text-sm font-medium">{name}</div>
                <div className={cn("flex min-h-48 flex-1 items-center justify-center p-5", surface)}>
                  <Component data={data} themeColor={meta.themeColor} />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="report" className="mt-4">
          <Report issues={issues} />
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <CodeTabs data={data} />
        </TabsContent>

        <TabsContent value="tags" className="mt-4">
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Tag</TableHead>
                  <TableHead className="w-56">Name</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meta.allTags.map((t, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.tag}</TableCell>
                    <TableCell className="font-mono text-xs">{t.key}</TableCell>
                    <TableCell className="max-w-0 truncate text-xs" title={t.value}>
                      {t.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const ISSUE_STYLE = {
  error: { icon: XCircleIcon, className: "text-red-600 dark:text-red-400" },
  warning: { icon: TriangleAlertIcon, className: "text-amber-600 dark:text-amber-400" },
  success: { icon: CheckCircle2Icon, className: "text-emerald-600 dark:text-emerald-400" },
}

function Report({ issues }: { issues: Issue[] }) {
  const counts = { error: 0, warning: 0, success: 0 }
  for (const i of issues) counts[i.level]++
  const total = counts.error + counts.warning + counts.success
  const score = total ? Math.round(((counts.success + counts.warning * 0.5) / total) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Score" value={`${score}`} />
        <Stat label="Errors" value={counts.error} className={ISSUE_STYLE.error.className} />
        <Stat label="Warnings" value={counts.warning} className={ISSUE_STYLE.warning.className} />
        <Stat label="Passed" value={counts.success} className={ISSUE_STYLE.success.className} />
      </div>
      <Card className="divide-y py-0">
        {issues.map((issue, i) => {
          const { icon: Icon, className } = ISSUE_STYLE[issue.level]
          return (
            <div key={i} className="flex gap-3 px-4 py-3">
              <Icon className={cn("mt-0.5 size-4 shrink-0", className)} />
              <div className="min-w-0">
                <div className="text-sm font-medium">{issue.title}</div>
                {issue.detail ? <div className="text-xs break-words text-muted-foreground">{issue.detail}</div> : null}
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}

function Stat({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <Card className="gap-1 px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("text-2xl font-semibold tabular-nums", className)}>{value}</div>
    </Card>
  )
}

function CodeTabs({ data }: { data: PreviewData }) {
  const html = generateHtml(data)
  return (
    <Tabs defaultValue="html">
      <div className="flex items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="next">Next.js</TabsTrigger>
          <TabsTrigger value="helmet">React Helmet</TabsTrigger>
        </TabsList>
        <CopyButton value={html} label="Copy HTML" />
      </div>
      <TabsContent value="html" className="mt-3">
        <CodeBlock code={html} />
      </TabsContent>
      <TabsContent value="next" className="mt-3">
        <CodeBlock code={generateNextMetadata(data)} />
      </TabsContent>
      <TabsContent value="helmet" className="mt-3">
        <CodeBlock code={generateReactHelmet(data)} />
      </TabsContent>
    </Tabs>
  )
}
