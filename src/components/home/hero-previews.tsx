import type { ReactNode } from "react"
import Image from "next/image"
import { DiscordIcon, FacebookIcon, LinkedInIcon, SlackIcon, WhatsAppIcon, XIcon } from "@/components/home/social-icons"
import { cn } from "@/lib/utils"

/**
 * The images are real /api/og renders of the generator's template presets (saas, device, event),
 * saved to /public/hero so the hero doesn't wait on font fetches.
 */
const IMAGE_SIZES = "(min-width: 1024px) 420px, 75vw"

/** Float lives on the wrapper and tilt on the card, so the two transforms don't overwrite each other. */
function Floating({ className, delay, tilt, children }: { className: string; delay: string; tilt: string; children: ReactNode }) {
  return (
    <div className={cn("absolute animate-float motion-reduce:animate-none", className)} style={{ animationDelay: delay }}>
      <div className={cn("overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl shadow-indigo-950/15", tilt)}>
        {children}
      </div>
    </div>
  )
}

function OgImage({ src, alt, className, priority }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <Image src={src} alt={alt} width={1200} height={630} sizes={IMAGE_SIZES} priority={priority} className={cn("aspect-[1200/630] w-full object-cover", className)} />
  )
}

function LinkedInPost() {
  return (
    <>
      <div className="flex items-center gap-2 p-2.5 sm:p-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white sm:size-8">OG</span>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[11px] font-semibold sm:text-xs">OG Checker</div>
          <div className="truncate text-[10px] text-muted-foreground">2,140 followers · 1h</div>
        </div>
        <LinkedInIcon className="size-4 shrink-0 text-[#0A66C2] dark:text-[#4C9BE8]" />
      </div>
      <OgImage src="/hero/device.png" alt="Tech product template: Find & fix Open Graph issues with ease" />
      <div className="bg-muted/60 px-3 py-2">
        <div className="truncate text-[11px] font-semibold sm:text-xs">Find &amp; fix Open Graph issues with ease</div>
        <div className="text-[10px] text-muted-foreground">opengraph.check</div>
      </div>
    </>
  )
}

function SlackUnfurl() {
  return (
    <div className="flex gap-2 p-2.5 sm:p-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-orange-500 text-[11px] font-bold text-white sm:size-8">T</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
          <span className="font-semibold">Priya</span>
          <span className="text-[10px] text-muted-foreground">10:42 AM</span>
          <SlackIcon className="ml-auto size-3.5 shrink-0" />
        </div>
        <div className="truncate text-[11px] text-sky-600 sm:text-xs dark:text-sky-400">techweek.events/sf</div>
        <div className="mt-1.5 border-l-[3px] border-border pl-2">
          <div className="text-[10px] font-semibold">Tech Week 2026</div>
          <div className="truncate text-[11px] font-semibold text-sky-600 sm:text-xs dark:text-sky-400">Build an agentic team with AI</div>
          <OgImage src="/hero/event.png" alt="Event template: Build an agentic team with AI" className="mt-1.5 rounded-md" />
        </div>
      </div>
    </div>
  )
}

function XPost() {
  return (
    <div className="p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <span className="size-8 shrink-0 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 sm:size-9" />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-xs font-semibold sm:text-sm">Your Startup</div>
          <div className="truncate text-[11px] text-muted-foreground">@yourstartup · 2m</div>
        </div>
        <XIcon className="size-4 shrink-0" />
      </div>
      <p className="mt-2 text-xs sm:text-sm">We&apos;re live in public beta 🚀</p>
      <div className="mt-2.5 overflow-hidden rounded-xl border">
        <OgImage src="/hero/saas.png" alt="SaaS launch template: AI agents wired to your tools" priority />
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">From yourstartup.com</div>
    </div>
  )
}

const CHIPS = [
  { icon: FacebookIcon, label: "Facebook", color: "text-[#0866FF]", pos: "top-[-1%] right-[3%]", delay: "-3s" },
  { icon: DiscordIcon, label: "Discord", color: "text-[#5865F2]", pos: "bottom-[24%] right-[1%]", delay: "-5s" },
  { icon: WhatsAppIcon, label: "WhatsApp", color: "text-[#25D366]", pos: "bottom-[14%] left-[1%]", delay: "-1s" },
]

/** Back cards sit high and the X post low, so only their edges overlap and every OG image stays readable. */
export function HeroPreviews() {
  return (
    <div className="relative mx-auto aspect-[1/1.05] w-full max-w-xl">
      <div className="absolute inset-[10%] -z-10 rounded-full bg-linear-to-tr from-indigo-500/30 via-violet-500/25 to-pink-400/20 blur-3xl" />

      <Floating className="top-[1%] left-[0%] w-[55%]" tilt="-rotate-5" delay="-2s">
        <LinkedInPost />
      </Floating>
      <Floating className="top-[7%] right-[0%] w-[51%]" tilt="rotate-4" delay="-4s">
        <SlackUnfurl />
      </Floating>
      <Floating className="top-[43%] left-[17%] z-10 w-[66%]" tilt="-rotate-1" delay="0s">
        <XPost />
      </Floating>

      {CHIPS.map(({ icon: Icon, label, color, pos, delay }) => (
        <span
          key={label}
          title={label}
          className={cn(
            "absolute z-20 flex size-9 animate-float items-center justify-center rounded-xl border border-white/70 bg-white/80 shadow-lg shadow-indigo-500/15 backdrop-blur-md motion-reduce:animate-none sm:size-11 sm:rounded-2xl dark:border-white/10 dark:bg-white/10",
            pos
          )}
          style={{ animationDelay: delay }}
        >
          <Icon className={cn("size-4 sm:size-5", color)} />
        </span>
      ))}
    </div>
  )
}
