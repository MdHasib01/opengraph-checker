"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { GlobeIcon, Loader2Icon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function UrlForm({ defaultValue = "", size = "lg", className }: { defaultValue?: string; size?: "lg" | "sm"; className?: string }) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)
  const [pending, setPending] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    setPending(true)
    router.push(`/check?url=${encodeURIComponent(url)}`)
    // navigation to the same route with a new query doesn't unmount us
    setTimeout(() => setPending(false), 800)
  }

  const lg = size === "lg"
  return (
    <form onSubmit={onSubmit} className={cn("flex w-full gap-2", className)}>
      <div className="relative flex-1">
        <GlobeIcon className={cn("pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground", lg ? "size-5" : "size-4")} />
        <Input
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          aria-label="Website URL"
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={cn("bg-background", lg ? "h-12 pl-10 text-base" : "h-9 pl-9")}
        />
      </div>
      <Button type="submit" disabled={pending} className={lg ? "h-12 px-6 text-base" : "h-9 px-4"}>
        {pending ? <Loader2Icon className="animate-spin" /> : <SearchIcon />}
        Check
      </Button>
    </form>
  )
}
