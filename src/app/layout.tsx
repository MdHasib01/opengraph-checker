import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"
import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OG Checker — Preview & generate Open Graph meta tags",
    template: "%s · OG Checker",
  },
  description:
    "Check how your links look on Google, Facebook, X, LinkedIn, Discord, Slack and more. Debug Open Graph tags, copy generated code and design OG images.",
  openGraph: {
    type: "website",
    siteName: "OG Checker",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "OG Checker" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-default.png"] },
  icons: {
    icon: [
      // fallback for Safari, which doesn't support SVG favicons
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
      // listed last so browsers that support it prefer it: swaps between an indigo and a white
      // mark to match the browser's light/dark theme
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <AnnouncementBar />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-8 text-sm text-muted-foreground">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
                <span>© OG Checker. Built with Next.js & shadcn/ui.</span>
                <nav className="flex gap-4">
                  <Link href="/" className="hover:text-foreground">Checker</Link>
                  <Link href="/generator" className="hover:text-foreground">Image generator</Link>
                  <Link href="/short-links" className="hover:text-foreground">Short links</Link>
                </nav>
              </div>
            </footer>
            <Toaster richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
