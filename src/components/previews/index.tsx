"use client"

import type { ComponentType } from "react"
import type { PreviewData } from "@/lib/types"
import { DiscordPreview } from "./discord"
import { FacebookPreview } from "./facebook"
import { GooglePreview } from "./google"
import { LinkedInPreview } from "./linkedin"
import { IMessagePreview, TelegramPreview, WhatsAppPreview } from "./messengers"
import { PinterestPreview, RedditPreview } from "./pinterest-reddit"
import { SlackPreview } from "./slack"
import { TwitterPreview } from "./twitter"

export type Platform = {
  id: string
  name: string
  Component: ComponentType<{ data: PreviewData; themeColor?: string }>
  /** Platform-specific background the preview sits on. */
  surface: string
}

export const PLATFORMS: Platform[] = [
  { id: "google", name: "Google", Component: GooglePreview, surface: "bg-white" },
  { id: "facebook", name: "Facebook", Component: FacebookPreview, surface: "bg-[#f0f2f5]" },
  { id: "twitter", name: "X / Twitter", Component: TwitterPreview, surface: "bg-white" },
  { id: "linkedin", name: "LinkedIn", Component: LinkedInPreview, surface: "bg-[#f4f2ee]" },
  { id: "discord", name: "Discord", Component: DiscordPreview, surface: "bg-[#313338]" },
  { id: "slack", name: "Slack", Component: SlackPreview, surface: "bg-white" },
  { id: "whatsapp", name: "WhatsApp", Component: WhatsAppPreview, surface: "bg-[#efeae2]" },
  { id: "telegram", name: "Telegram", Component: TelegramPreview, surface: "bg-[#8fb08c]" },
  { id: "imessage", name: "iMessage", Component: IMessagePreview, surface: "bg-white" },
  { id: "pinterest", name: "Pinterest", Component: PinterestPreview, surface: "bg-white" },
  { id: "reddit", name: "Reddit", Component: RedditPreview, surface: "bg-[#dae0e6]" },
]
