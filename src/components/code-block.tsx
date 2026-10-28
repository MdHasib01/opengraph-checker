"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Clipboard access was blocked")
    }
  }
  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      {label}
    </Button>
  )
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <CopyButton value={code} />
      </div>
      <pre className="max-h-[520px] overflow-auto rounded-lg border bg-muted/50 p-4 pr-24 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
