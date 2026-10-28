"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import {
  BarChart3Icon,
  ExternalLinkIcon,
  KeyRoundIcon,
  Link2Icon,
  MousePointerClickIcon,
  PencilIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"
import { CopyButton } from "@/components/code-block"
import { PreviewImage } from "@/components/previews/shared"
import { LinkForm } from "@/components/short-links/link-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getOwnerToken, setOwnerToken, shortLinksApi, type ShortLink } from "@/lib/short-links-api"
import { hostname } from "@/lib/types"

export function DeleteLinkButton({ slug, onDeleted }: { slug: string; onDeleted: () => void }) {
  async function remove() {
    try {
      await shortLinksApi.remove(slug)
      toast.success("Link deleted")
      onDeleted()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the link")
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" size="icon" aria-label="Delete link" />}>
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete /s/{slug}?</AlertDialogTitle>
          <AlertDialogDescription>
            The short link stops working immediately and its click history is deleted. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={remove}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function AccessKeyDialog({ onChanged }: { onChanged: () => void }) {
  const [token, setToken] = useState("")
  const [draft, setDraft] = useState("")
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setToken(getOwnerToken())
      }}
    >
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <KeyRoundIcon /> Access key
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your access key</DialogTitle>
          <DialogDescription>
            There are no accounts: your links belong to this key, which is stored in this browser. Save it somewhere safe
            to manage your links from another device, or after clearing browser data.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input readOnly value={token} className="font-mono text-xs" />
          <CopyButton value={token} />
        </div>
        <form
          className="space-y-2 border-t pt-4"
          onSubmit={(e) => {
            e.preventDefault()
            const value = draft.trim()
            if (!/^[A-Za-z0-9_-]{32,128}$/.test(value)) {
              toast.error("That doesn't look like an access key")
              return
            }
            setOwnerToken(value)
            setToken(value)
            setDraft("")
            toast.success("Access key switched")
            onChanged()
          }}
        >
          <div className="text-sm font-medium">Use a different key</div>
          <div className="flex gap-2">
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Paste an access key" className="font-mono text-xs" />
            <Button type="submit">
              Switch
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function LinkRow({ link, onChange }: { link: ShortLink; onChange: () => void }) {
  const [editing, setEditing] = useState(false)
  if (editing) {
    return (
      <Card>
        <CardContent>
          <LinkForm
            link={link}
            onCancel={() => setEditing(false)}
            onSaved={() => {
              toast.success("Link updated")
              setEditing(false)
              onChange()
            }}
          />
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="py-0">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <PreviewImage src={link.image} className="aspect-[1.91/1] w-full shrink-0 rounded-md sm:w-36" />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="truncate font-medium">{link.title || hostname(link.destination)}</div>
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 truncate text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {link.shortUrl.replace(/^https?:\/\//, "")}
            <ExternalLinkIcon className="size-3 shrink-0" />
          </a>
          <div className="truncate text-xs text-muted-foreground">→ {link.destination}</div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MousePointerClickIcon className="size-3.5" /> {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
            </span>
            <span>
              {link.crawls} preview {link.crawls === 1 ? "fetch" : "fetches"}
            </span>
            <span>Created {formatDate(link.createdAt)}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <CopyButton value={link.shortUrl} />
          <Link href={`/short-links/${link.slug}`} aria-label="Analytics" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <BarChart3Icon />
          </Link>
          <Button variant="ghost" size="icon" aria-label="Edit link" onClick={() => setEditing(true)}>
            <PencilIcon />
          </Button>
          <DeleteLinkButton slug={link.slug} onDeleted={onChange} />
        </div>
      </div>
    </Card>
  )
}

export function ShortLinksView() {
  const [links, setLinks] = useState<ShortLink[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<ShortLink | null>(null)

  const load = useCallback(() => {
    shortLinksApi
      .list()
      .then((l) => {
        setLinks(l)
        setError(null)
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your links"))
  }, [])

  useEffect(load, [load])

  return (
    <div className="space-y-10">
      <Card>
        <CardHeader>
          <CardTitle>Create a short link</CardTitle>
          <CardDescription>Choose exactly how your link previews, whatever the destination page says.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {created ? (
            <Alert className="border-emerald-500/40 bg-emerald-500/5">
              <Link2Icon />
              <AlertTitle>Your short link is ready</AlertTitle>
              <AlertDescription>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">{created.shortUrl}</code>
                  <CopyButton value={created.shortUrl} />
                  <Link href={`/check?url=${encodeURIComponent(created.shortUrl)}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Check its preview
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          ) : null}
          <LinkForm
            onSaved={(link) => {
              setCreated(link)
              toast.success("Short link created")
              load()
            }}
          />
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Your links {links ? <span className="text-muted-foreground">({links.length})</span> : null}</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={load}>
              <RefreshCwIcon /> Refresh
            </Button>
            <AccessKeyDialog onChanged={load} />
          </div>
        </div>
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn&apos;t load your links</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : links === null ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : links.length === 0 ? (
          <Card className="items-center py-12 text-center text-sm text-muted-foreground">
            <Link2Icon className="size-8" />
            No short links yet. Create your first one above.
          </Card>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <LinkRow key={link.slug} link={link} onChange={load} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
