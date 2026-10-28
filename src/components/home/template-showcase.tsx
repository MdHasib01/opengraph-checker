"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowRightIcon, Link2Icon, MousePointerClickIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ROWS = [
  {
    slug: "calm-ui",
    title: "Designing calm interfaces",
    author: "Ana Ruiz",
    read: "6 min",
    cover: "/backgrounds/bg-3.png",
    image: "/showcase/series-calm.png",
    clicks: [12, 18, 15, 22, 30, 26, 34, 41, 38, 45, 52, 48, 57, 63],
  },
  {
    slug: "dark-mode",
    title: "A field guide to dark mode",
    author: "Theo Park",
    read: "9 min",
    cover: "/backgrounds/bg-6.png",
    image: "/showcase/series-dark.png",
    clicks: [40, 36, 44, 39, 31, 35, 29, 33, 41, 47, 44, 52, 49, 55],
  },
  {
    slug: "color",
    title: "Color systems that scale",
    author: "Mira Okafor",
    read: "7 min",
    cover: "/backgrounds/bg-1.png",
    image: "/showcase/series-color.png",
    clicks: [8, 10, 9, 14, 21, 35, 62, 58, 44, 39, 36, 41, 37, 40],
  },
  {
    slug: "journeys",
    title: "Mapping user journeys",
    author: "Sam Lindqvist",
    read: "5 min",
    cover: "/backgrounds/bg-4.png",
    image: "/showcase/series-maps.png",
    clicks: [20, 24, 22, 27, 25, 29, 31, 28, 33, 36, 34, 38, 42, 46],
  },
]

const VARIABLES = ["{title}", "{author}", "{read}", "{cover}"]

export function TemplateShowcase() {
  const [active, setActive] = useState(0)
  const [spread, setSpread] = useState(false)
  const row = ROWS[active]
  const total = row.clicks.reduce((a, b) => a + b, 0)
  const peak = Math.max(...row.clicks)

  return (
    <section className="overflow-x-clip border-b bg-muted/40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Templates + short links</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Design one card. Ship one for every page.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Build a template once, drop in variables, and every page gets its own on-brand image from a single URL. Wrap
            the link in a short link to see who clicks, and from where.
          </p>

          <div className="mt-8 overflow-hidden rounded-xl border bg-background">
            <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-3 font-mono text-xs text-muted-foreground">
              <span>/api/og?template=split</span>
              {VARIABLES.map((v) => (
                <span key={v} className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-indigo-600 dark:text-indigo-400">
                  {v}
                </span>
              ))}
            </div>
            <ul>
              {ROWS.map((r, i) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    aria-pressed={i === active}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left text-sm transition-colors",
                      i === active ? "border-indigo-500 bg-indigo-500/5" : "border-transparent hover:bg-muted/60"
                    )}
                  >
                    <Image src={r.cover} alt="" width={48} height={25} className="h-6 w-11 shrink-0 rounded object-cover" />
                    <span className="min-w-0 flex-1 truncate font-medium">{r.title}</span>
                    <span className="hidden shrink-0 text-muted-foreground sm:inline">{r.author}</span>
                    <span className="w-12 shrink-0 text-right text-muted-foreground">{r.read}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MousePointerClickIcon className="size-3.5" /> Hover a row to see the image it generates
          </p>
        </div>

        <div className="min-w-0">
          <div
            className="relative mt-[16%] mr-[16%] aspect-[1.91/1]"
            onMouseEnter={() => setSpread(true)}
            onMouseLeave={() => setSpread(false)}
          >
            {ROWS.map((r, i) => {
              const depth = (i - active + ROWS.length) % ROWS.length
              const step = spread ? 11 : 6
              return (
                <button
                  key={r.slug}
                  type="button"
                  tabIndex={-1}
                  aria-hidden={depth !== 0}
                  onClick={() => setActive(i)}
                  className="absolute inset-0 overflow-hidden rounded-xl border bg-background shadow-xl transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none"
                  style={{
                    zIndex: ROWS.length - depth,
                    opacity: 1 - depth * 0.18,
                    transform: `translate(${depth * step}%, ${-depth * step * 0.9}%) rotate(${depth * (spread ? 4 : 2.5)}deg) scale(${1 - depth * 0.06})`,
                  }}
                >
                  <Image src={r.image} alt={depth === 0 ? `Generated image: ${r.title}` : ""} fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
                </button>
              )
            })}
          </div>

          <div className="group mx-auto mt-10 max-w-md rounded-xl border bg-background p-4 shadow-sm transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex min-w-0 items-center gap-1.5 font-medium">
                <Link2Icon className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span className="truncate">opengraph.check/s/{row.slug}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">Last 14 days</span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <div className="text-2xl font-bold tabular-nums">{total.toLocaleString("en-US")}</div>
                <div className="text-xs text-muted-foreground">clicks (example)</div>
              </div>
              <div className="flex h-14 flex-1 items-end gap-1" aria-hidden>
                {row.clicks.map((c, i) => (
                  <span
                    key={i}
                    className="flex-1 origin-bottom rounded-sm bg-indigo-500/30 transition-[height,background-color] duration-500 group-hover:bg-indigo-500/60 last:bg-indigo-600! dark:last:bg-indigo-400!"
                    style={{ height: `${(c / peak) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-4 pb-16">
        <Link href="/generator" className={buttonVariants({ size: "lg", className: "h-11 px-6" })}>
          Design a template <ArrowRightIcon />
        </Link>
        <Link href="/short-links" className={buttonVariants({ size: "lg", variant: "outline", className: "h-11 px-6" })}>
          Create a short link
        </Link>
      </div>
    </section>
  )
}
