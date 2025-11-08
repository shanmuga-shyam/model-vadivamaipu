import { Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-4 mb-6", isUser && "justify-end")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-md lg:max-w-2xl rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card border border-border/40 text-foreground rounded-bl-none",
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className={cn("text-xs mt-1", isUser ? "text-primary-foreground/70" : "text-foreground/50")}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  )
}
