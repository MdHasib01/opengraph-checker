"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Checker" },
  { href: "/generator", label: "Image generator" },
  { href: "/short-links", label: "Short links" },
  { href: "/#how-it-works", label: "How it works" },
]

function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav className="hidden items-center gap-1 sm:flex">
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              active && "bg-muted text-foreground"
            )}
          >
            {item.label}
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
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="" width={28} height={28} className="rounded-md" />
          <span>OG Checker</span>
        </Link>
        {/* the pathname is unknown while prerendering dynamic routes like /short-links/[slug] */}
        <Suspense fallback={<NavLinks pathname={null} />}>
          <ActiveNavLinks />
        </Suspense>
        <div className="ml-auto flex items-center gap-1">
          <Link href="/generator" className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:hidden">
            Generator
          </Link>
          <Link href="/short-links" className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:hidden">
            Links
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
