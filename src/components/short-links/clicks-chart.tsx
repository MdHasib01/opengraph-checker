"use client"

import { useCallback, useState } from "react"

const BAR = "#6366f1"
const HEIGHT = 220
const PAD = { top: 12, right: 8, bottom: 28, left: 36 }

/** Smallest "nice" axis top (4 equal steps of 1/2/2.5/5 × 10ⁿ) covering n. */
function niceMax(n: number) {
  if (n <= 4) return 4
  const pow = 10 ** Math.floor(Math.log10(n / 4))
  const step = [1, 2, 2.5, 5, 10].map((s) => s * pow).find((s) => s * 4 >= n)!
  return step * 4
}

/** Tracks an element's width so the SVG draws at real pixels and text stays 11px. */
function useWidth() {
  const [width, setWidth] = useState(0)
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

function label(date: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { ...opts, timeZone: "UTC" })
}

/** Single-series daily bar chart: one hue, no legend, hover tooltip per bar. */
export function ClicksChart({ data }: { data: { date: string; clicks: number }[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const [ref, measured] = useWidth()
  const width = measured || 720
  const plotW = width - PAD.left - PAD.right
  const plotH = HEIGHT - PAD.top - PAD.bottom
  const max = niceMax(Math.max(0, ...data.map((d) => d.clicks)))
  const slot = plotW / data.length
  const barW = Math.max(2, slot - 2) // 2px surface gap between bars
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t))
  const labelEvery = Math.ceil(data.length / Math.max(2, Math.floor(plotW / 90)))
  const hovered = hover === null ? null : data[hover]

  return (
    <div ref={ref} className="relative">
      <svg width={width} height={HEIGHT} className="block" role="img" aria-label="Clicks per day">
        {ticks.map((t) => {
          const y = PAD.top + plotH - (t / max) * plotH
          return (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y} y2={y} className="stroke-border" strokeWidth={1} />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="fill-muted-foreground text-[11px] tabular-nums">
                {t}
              </text>
            </g>
          )
        })}
        {data.map((d, i) => {
          const h = (d.clicks / max) * plotH
          const x = PAD.left + i * slot + (slot - barW) / 2
          const y = PAD.top + plotH - h
          const r = Math.min(4, barW / 2, h)
          return (
            <g key={d.date}>
              {h > 0 && (
                // rounded data-end, square at the baseline
                <path
                  d={`M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${y + h} Z`}
                  fill={BAR}
                  opacity={hover === null || hover === i ? 1 : 0.45}
                />
              )}
              {i % labelEvery === 0 && (
                <text x={x + barW / 2} y={HEIGHT - 8} textAnchor="middle" className="fill-muted-foreground text-[11px]">
                  {label(d.date, { month: "short", day: "numeric" })}
                </text>
              )}
              {/* hit target: the whole column, larger than the bar */}
              <rect
                x={PAD.left + i * slot}
                y={PAD.top}
                width={slot}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          )
        })}
      </svg>
      {hovered && hover !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: `${((PAD.left + (hover + 0.5) * slot) / width) * 100}%` }}
        >
          <div className="text-muted-foreground">{label(hovered.date, { weekday: "short", month: "short", day: "numeric" })}</div>
          <div className="font-semibold tabular-nums">
            {hovered.clicks} {hovered.clicks === 1 ? "click" : "clicks"}
          </div>
        </div>
      )}
    </div>
  )
}

export function BreakdownList({ title, rows, empty }: { title: string; rows: { name: string; count: number }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.name} className="space-y-1">
              <div className="flex justify-between gap-2 text-sm">
                <span className="truncate">{r.name}</span>
                <span className="tabular-nums text-muted-foreground">{r.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: `${(r.count / max) * 100}%`, backgroundColor: BAR }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
