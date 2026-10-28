import type { ReactNode } from "react"
import Image from "next/image"
import { CheckIcon, ImageOffIcon, MousePointerClickIcon, TriangleAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Broken =
  | { kind: "missing" }
  | { kind: "crop" }
  | { kind: "fallback"; title: string; description: string }
  | { kind: "tiny" }

type Example = {
  platform: string
  domain: string
  title: string
  description: string
  image: string
  issue: string
  broken: Broken
  /** Shown already fixed, so the row mixes before and after without any hovering. */
  fixed?: boolean
}

const EXAMPLES: Example[] = [
  {
    platform: "LinkedIn",
    domain: "pinecrest.dev",
    title: "Postgres indexes, explained with one diagram",
    description: "B-trees, partial indexes and when to skip them.",
    image: "/showcase/fix-postgres.png",
    issue: "No og:title, fallback used",
    broken: { kind: "fallback", title: "Home", description: "We use cookies to improve your experience. By continuing you agree to…" },
  },
  {
    platform: "X",
    domain: "fieldnotes.travel",
    title: "Chasing the aurora: 7 nights in northern Iceland",
    description: "A photo journal from the edge of the Arctic Circle.",
    image: "/showcase/fix-aurora.png",
    issue: "og:image missing",
    broken: { kind: "missing" },
    fixed: true,
  },
  {
    platform: "Slack",
    domain: "logbook.app",
    title: "Release notes your users actually read",
    description: "Changelogs, announcements and in-app updates in one place.",
    image: "/showcase/fix-release.png",
    issue: "Cropped to a square",
    broken: { kind: "crop" },
  },
  {
    platform: "iMessage",
    domain: "emberandoak.kitchen",
    title: "Summer supper club: tickets now open",
    description: "Six courses, one long table, every Friday in July.",
    image: "/showcase/fix-supper.png",
    issue: "Image 240×126, too small",
    broken: { kind: "tiny" },
    fixed: true,
  },
]

/**
 * Resting pose per slot, so reordering cards keeps the row's rhythm. The tilt is sm-and-up so
 * narrow screens never clip it; the stagger sits on the wrapper so it can't fight the hover lift.
 */
const POSES = [
  { tilt: "sm:-rotate-3", offset: "lg:mt-6", delay: "0s" },
  { tilt: "sm:rotate-2", offset: "", delay: "-2s" },
  { tilt: "sm:-rotate-2", offset: "lg:mt-10", delay: "-4s" },
  { tilt: "sm:rotate-3", offset: "lg:mt-2", delay: "-1s" },
]

const IMAGE_SIZES = "(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"

/** Both states share one grid cell so the card keeps the taller one's height. */
const layer = "col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none"

/** Same frame for both states, so the swap on hover doesn't jump. */
function CardBody({ domain, title, description, children }: { domain: string; title: string; description: string; children: ReactNode }) {
  return (
    <div>
      <div className="relative aspect-[1.91/1] overflow-hidden bg-muted">{children}</div>
      <div className="space-y-0.5 p-3 text-sm">
        <div className="text-xs text-muted-foreground">{domain}</div>
        <div className="truncate font-semibold">{title}</div>
        <div className="line-clamp-2 min-h-8 text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

const missingImage = (
  <div className="flex size-full items-center justify-center text-muted-foreground/60">
    <ImageOffIcon className="size-8" />
  </div>
)

function BrokenState({ ex }: { ex: Example }) {
  const { broken } = ex
  switch (broken.kind) {
    case "missing":
      // with no tags at all, platforms fall back to the bare URL
      return <CardBody domain={ex.domain} title={`https://${ex.domain}/journal/aurora`} description="">{missingImage}</CardBody>
    case "fallback":
      return <CardBody domain={ex.domain} title={broken.title} description={broken.description}>{missingImage}</CardBody>
    case "crop":
      return (
        <CardBody domain={ex.domain} title={ex.title} description={ex.description}>
          <div className="relative mx-auto aspect-square h-full overflow-hidden">
            <Image src={ex.image} alt="" fill sizes="160px" className="object-cover object-left" />
          </div>
        </CardBody>
      )
    case "tiny":
      return (
        <CardBody domain={ex.domain} title={ex.title} description={ex.description}>
          {/* a tiny source scaled up: blurry and washed out */}
          <Image src={ex.image} alt="" fill sizes="32px" className="scale-110 object-cover blur-[3px] saturate-50" />
        </CardBody>
      )
  }
}

function FixedState({ ex }: { ex: Example }) {
  return (
    <CardBody domain={ex.domain} title={ex.title} description={ex.description}>
      <Image src={ex.image} alt={`Generated preview: ${ex.title}`} fill sizes={IMAGE_SIZES} className="object-cover" />
    </CardBody>
  )
}

function PreviewCard({ ex, pose }: { ex: Example; pose: (typeof POSES)[number] }) {
  const brokenLayer = ex.fixed ? "opacity-0" : "group-hover:opacity-0 group-focus:opacity-0"
  const fixedLayer = ex.fixed ? "" : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"
  return (
    <div className={cn("animate-float motion-reduce:animate-none", pose.offset)} style={{ animationDelay: pose.delay }}>
      <div
        tabIndex={0}
        aria-label={
          ex.fixed
            ? `${ex.platform} preview for ${ex.domain}, fixed with OG Checker.`
            : `${ex.platform} preview for ${ex.domain}: ${ex.issue}. Hover or focus to see it fixed.`
        }
        className={cn(
          "group rounded-2xl border bg-card p-2.5 shadow-sm outline-none transition-[rotate,translate,scale,box-shadow] duration-500 ease-out motion-reduce:transition-none",
          // focus (not just focus-visible) so a tap flips the card on touch screens
          "hover:-translate-y-3 hover:scale-[1.04] hover:shadow-2xl hover:shadow-indigo-500/20 sm:hover:rotate-0",
          "focus:-translate-y-3 focus:scale-[1.04] focus:shadow-2xl focus:shadow-indigo-500/20 focus-visible:ring-2 focus-visible:ring-indigo-500 sm:focus:rotate-0",
          pose.tilt
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-2 px-1 text-xs">
          <span className="font-medium text-muted-foreground">{ex.platform}</span>
          <span className="grid">
            <span
              className={cn(
                layer,
                "inline-flex items-center gap-1 justify-self-end rounded-full bg-red-500/10 px-2 py-0.5 font-medium text-red-600 dark:text-red-400",
                brokenLayer
              )}
            >
              <TriangleAlertIcon className="size-3" /> {ex.issue}
            </span>
            <span
              className={cn(
                layer,
                "inline-flex items-center gap-1 justify-self-end rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400",
                fixedLayer
              )}
            >
              <CheckIcon className="size-3" /> Fixed
            </span>
          </span>
        </div>
        <div className="grid overflow-hidden rounded-xl border bg-background">
          <div className={cn(layer, brokenLayer)}>
            <BrokenState ex={ex} />
          </div>
          <div className={cn(layer, fixedLayer)}>
            <FixedState ex={ex} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BrokenPreviews() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-x-0 top-1/3 -z-10 h-2/3 bg-[radial-gradient(ellipse_at_center,rgb(99_102_241/0.12),transparent_65%)]" />
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Before &amp; after</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            A broken preview costs you the click
          </h2>
          <p className="mt-4 text-muted-foreground">
            Missing images, awkward crops and fallback titles make a great page look like spam. Two of these links
            have been through OG Checker. Hover the other two.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
            <MousePointerClickIcon className="size-3.5" /> Hover a broken card to fix it
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {EXAMPLES.map((ex, i) => (
            <PreviewCard key={ex.domain} ex={ex} pose={POSES[i]} />
          ))}
        </div>
      </div>
    </section>
  )
}
