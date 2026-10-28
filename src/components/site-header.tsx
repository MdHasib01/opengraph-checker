"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense } from "react"
import { CircleHelpIcon, ImageIcon, Link2Icon, MoonIcon, ScanSearchIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const BADGE_STYLE = {
  Free: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  New: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
}

const NAV: { href: string; label: string; icon: typeof ImageIcon; badge?: keyof typeof BADGE_STYLE; wideOnly?: boolean }[] = [
  { href: "/", label: "Checker", icon: ScanSearchIcon, badge: "Free" },
  { href: "/generator", label: "Image generator", icon: ImageIcon, badge: "Free" },
  { href: "/short-links", label: "Short links", icon: Link2Icon, badge: "New" },
  { href: "/#how-it-works", label: "How it works", icon: CircleHelpIcon, wideOnly: true },
]

function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              item.wideOnly ? "hidden lg:inline-flex" : "inline-flex",
              active && "bg-muted text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
            {item.badge ? (
              <Badge className={cn("h-4 px-1.5 text-[10px]", BADGE_STYLE[item.badge])}>{item.badge}</Badge>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}

function ActiveNavLinks() {
  return <NavLinks pathname={usePathname()} />
}

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold whitespace-nowrap">
          {/* indigo mark matches the hero accent; it's turned white in dark mode */}
          <Image src="/og-logo.png" alt="" width={50} height={22} className="h-[22px] w-auto dark:brightness-0 dark:invert" />
          <span>OG Checker</span>
        </Link>
        {/* the pathname is unknown while prerendering dynamic routes like /short-links/[slug] */}
        <Suspense fallback={<NavLinks pathname={null} />}>
          <ActiveNavLinks />
        </Suspense>
        <div className="ml-auto flex items-center gap-1">
          <Link href="/generator" aria-label="Image generator" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground md:hidden">
            <ImageIcon className="size-4" />
            <span className="hidden sm:inline">Generator</span>
          </Link>
          <Link href="/short-links" aria-label="Short links" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground md:hidden">
            <Link2Icon className="size-4" />
            <span className="hidden sm:inline">Links</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="hidden dark:block" />
            <MoonIcon className="dark:hidden" />
          </Button>
        </div>
      </div>
    </header>
  )
}
