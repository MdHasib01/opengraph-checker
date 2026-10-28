"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { ArrowLeftIcon, ExternalLinkIcon, PencilIcon, TableIcon } from "lucide-react"
import { toast } from "sonner"
import { CopyButton } from "@/components/code-block"
import { PreviewImage } from "@/components/previews/shared"
import { BreakdownList, ClicksChart } from "@/components/short-links/clicks-chart"
import { LinkForm } from "@/components/short-links/link-form"
import { DeleteLinkButton } from "@/components/short-links/short-links-view"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { shortLinksApi, type LinkStats, type ShortLink } from "@/lib/short-links-api"
import { cn } from "@/lib/utils"

const RANGES = [7, 30, 90]

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="gap-1 px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
    </Card>
  )
}

export function LinkAnalytics({ slug }: { slug: string }) {
  const router = useRouter()
  const [days, setDays] = useState(30)
  const [data, setData] = useState<{ link: ShortLink; stats: LinkStats } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [asTable, setAsTable] = useState(false)

  const load = useCallback(() => {
    shortLinksApi
      .stats(slug, days)
      .then((d) => {
        setData(d)
        setError(null)
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load analytics"))
  }, [slug, days])

  useEffect(load, [load])

  const back = (
    <Link href="/short-links" className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-2" })}>
      <ArrowLeftIcon /> All short links
    </Link>
  )

  if (error) {
    return (
      <div className="space-y-4">
        {back}
        <Alert variant="destructive">
          <AlertTitle>Couldn&apos;t load this link</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="space-y-4">
        {back}
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const { link, stats } = data
  const periodClicks = stats.daily.reduce((sum, d) => sum + d.clicks, 0)

  return (
    <div className="space-y-6">
      {back}
      <Card className="py-0">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <PreviewImage src={link.image} className="aspect-[1.91/1] w-full shrink-0 rounded-md sm:w-48" />
          <div className="min-w-0 flex-1 space-y-1">
            <h1 className="truncate text-xl font-semibold">{link.title || link.slug}</h1>
            <a
              href={link.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 truncate text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {link.shortUrl.replace(/^https?:\/\//, "")} <ExternalLinkIcon className="size-3 shrink-0" />
            </a>
            <div className="truncate text-xs text-muted-foreground">→ {link.destination}</div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <CopyButton value={link.shortUrl} />
            <Button variant="ghost" size="icon" aria-label="Edit link" onClick={() => setEditing((e) => !e)}>
              <PencilIcon />
            </Button>
            <DeleteLinkButton slug={link.slug} onDeleted={() => router.push("/short-links")} />
          </div>
        </div>
      </Card>

      {editing && (
        <Card>
          <CardContent>
            <LinkForm
              link={link}
              onCancel={() => setEditing(false)}
              onSaved={() => {
                toast.success("Link updated")
                setEditing(false)
                load()
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total clicks" value={link.clicks} />
        <Stat label={`Clicks, last ${days} days`} value={periodClicks} />
        <Stat label="Preview fetches" value={link.crawls} />
        <Stat label="Last click" value={link.lastClickAt ? new Date(link.lastClickAt).toLocaleDateString() : "—"} />
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle>Clicks per day</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border p-0.5">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setDays(r)}
                  className={cn("rounded-md px-2.5 py-1 text-xs font-medium", days === r ? "bg-muted" : "text-muted-foreground")}
                >
                  {r}d
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setAsTable((t) => !t)}>
              <TableIcon /> {asTable ? "Chart" : "Table"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {asTable ? (
            <div className="max-h-72 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...stats.daily].reverse().map((d) => (
                    <TableRow key={d.date}>
                      <TableCell>{d.date}</TableCell>
                      <TableCell className="text-right tabular-nums">{d.clicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <ClicksChart data={stats.daily} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="grid gap-8 sm:grid-cols-2">
            <BreakdownList title="Referrers" rows={stats.referrers} empty="No clicks yet." />
            <BreakdownList title="Devices" rows={stats.devices} empty="No clicks yet." />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-8 sm:grid-cols-2">
            <BreakdownList title="Countries" rows={stats.countries} empty="No clicks yet." />
            <BreakdownList title="Platforms that fetched the preview" rows={stats.crawlers} empty="No crawler has unfurled this link yet." />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
