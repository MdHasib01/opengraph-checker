import Link from "next/link"
import {
  ClipboardCheckIcon,
  CodeIcon,
  ImageIcon,
  LayoutGridIcon,
  PencilLineIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { BrokenPreviews } from "@/components/home/broken-previews"
import { HeroPreviews } from "@/components/home/hero-previews"
import { TemplateShowcase } from "@/components/home/template-showcase"
import { UrlForm } from "@/components/url-form"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const EXAMPLES = ["github.com", "vercel.com", "nextjs.org", "ui.shadcn.com"]

/** Grid tiles (column from centre, row from top) given a faint tint behind the hero. */
const LIT_CELLS = [
  [-11, 1],
  [-8, 4],
  [-3, 0],
  [5, 2],
  [9, 0],
  [12, 5],
]

const FEATURES = [
  { icon: LayoutGridIcon, title: "11 platform previews", body: "Google, Facebook, X, LinkedIn, Discord, Slack, WhatsApp, Telegram, iMessage, Pinterest and Reddit." },
  { icon: PencilLineIcon, title: "Live meta editor", body: "Tweak titles, descriptions and images and watch every preview update instantly." },
  { icon: ClipboardCheckIcon, title: "Validation report", body: "Missing tags, length limits, image size, aspect ratio and duplicate tags, flagged with fixes." },
  { icon: CodeIcon, title: "Copy-ready code", body: "HTML meta tags, a Next.js metadata object, or React Helmet, generated from your edits." },
  { icon: ImageIcon, title: "OG image generator", body: "Six templates, custom fonts and colors, plus AI-made backdrops. Export a 1200×630 PNG." },
  { icon: ShieldCheckIcon, title: "Fetched like a crawler", body: "We request your page the way social crawlers do, follow redirects, and resolve relative URLs." },
]

const FAQ = [
  {
    q: "What is Open Graph?",
    a: "Open Graph is a set of <meta> tags (og:title, og:description, og:image…) that tell social platforms and chat apps how to render a rich preview card when your link is shared.",
  },
  {
    q: "What size should my og:image be?",
    a: "1200×630 pixels (a 1.91:1 ratio) works everywhere. Keep it under 5 MB, use PNG or JPEG, and always use an absolute https URL.",
  },
  {
    q: "Why does my preview look different on a platform?",
    a: "Platforms cache previews aggressively. After fixing your tags, use each platform's own debugger (e.g. Facebook Sharing Debugger, LinkedIn Post Inspector) to refresh their cache.",
  },
  {
    q: "Do I need both Open Graph and Twitter tags?",
    a: "X/Twitter falls back to Open Graph tags for title, description and image, but you still need twitter:card to choose the large image layout.",
  },
]

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b">
        {/* hairline grid; tiles are centred so lit cells line up at 50% - 28px + 56px * col */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-size-[56px_56px] bg-top [--grid-line:color-mix(in_oklab,var(--foreground)_8%,transparent)] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_0%,#000_35%,transparent_80%)]">
          {LIT_CELLS.map(([col, row]) => (
            <span
              key={`${col}:${row}`}
              className="absolute size-[55px] bg-indigo-500/[0.07] dark:bg-indigo-400/[0.08]"
              style={{ left: `calc(50% - 27px + ${col * 56}px)`, top: row * 56 + 1 }}
            />
          ))}
        </div>
        <div className="absolute -top-40 left-1/2 -z-10 h-[420px] w-[min(900px,100%)] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[110px] dark:bg-indigo-500/25" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-indigo-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-indigo-500" />
              </span>
              Free Open Graph debugger &amp; image generator
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              See how your link looks{" "}
              <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">
                before
              </span>{" "}
              you share it
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Paste any URL to preview its card on every major platform, fix missing or broken meta tags, and generate
              the code and images you need.
            </p>
            <div className="relative mt-8 max-w-xl">
              <div className="absolute -inset-3 -z-10 rounded-3xl bg-linear-to-r from-indigo-500/15 via-violet-500/15 to-pink-500/10 blur-xl" />
              <UrlForm />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Try:</span>
              {EXAMPLES.map((ex) => (
                <Link
                  key={ex}
                  href={`/check?url=${encodeURIComponent(`https://${ex}`)}`}
                  className="rounded-full border bg-background/60 px-2.5 py-0.5 backdrop-blur transition-colors hover:bg-muted hover:text-foreground"
                >
                  {ex}
                </Link>
              ))}
            </div>
          </div>
          <HeroPreviews />
        </div>
      </section>

      <BrokenPreviews />

      <TemplateShowcase />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">Everything you need for perfect link previews</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <f.icon className="size-5" />
                </div>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-y bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <ol className="mt-6 space-y-5">
              {[
                ["Enter a URL", "We fetch the page server-side like a social crawler and parse every meta and link tag."],
                ["Review the previews", "See the card on 11 platforms and read the validation report for anything missing or wrong."],
                ["Edit & copy", "Adjust tags in the editor, then copy the generated HTML or Next.js metadata into your site."],
                ["Need an image?", "Open the generator, pick a template and download a 1200×630 PNG or use its dynamic URL."],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-muted-foreground">{body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
            <div className="mt-6 divide-y rounded-xl border bg-background">
              {FAQ.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none font-medium marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">No image yet? Make one in seconds.</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Pick a template, type your title, choose an AI-made backdrop, and download.
        </p>
        <Link href="/generator" className={buttonVariants({ size: "lg", className: "mt-6 h-11 px-6" })}>
          <ImageIcon /> Open the image generator
        </Link>
      </section>
    </>
  )
}
