import { cn } from "@/lib/utils"
import { MascotAvatar } from "./mascot-avatar"
import { User } from "lucide-react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isAssistant = role === "assistant"

  return (
    <div className={cn("flex gap-3 p-4", isAssistant ? "bg-secondary/50" : "bg-transparent")}>
      <div className="flex-shrink-0">
        {isAssistant ? (
          <div className="w-10 h-10">
            <MascotAvatar />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground">{isAssistant ? "Energy Assistant" : "You"}</span>
          {timestamp && <span className="text-xs text-muted-foreground">{timestamp.toLocaleTimeString()}</span>}
        </div>
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )
}
