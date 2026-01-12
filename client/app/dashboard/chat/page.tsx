"use client"

import React, { useState } from "react"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [loading, setLoading] = useState(false)

  const handleUserSubmit = (message: string) => {
    if (!message) return
    setMessages((m) => [...m, { role: "user", content: message }])
    setLoading(true)

    ;(async () => {
      try {
        const res = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context: "", message, mode: "model", model_name: "gemini-pro" }),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || res.statusText)
        }

        const data = await res.json()
        const reply = data.reply || data.summary || ""
        if (reply) setMessages((m) => [...m, { role: "assistant", content: reply }])
      } catch (err) {
        setMessages((m) => [...m, { role: "assistant", content: "Error: could not get reply from assistant." }])
        console.error("chat error", err)
      } finally {
        setLoading(false)
      }
    })()
  }

  const handleAssistantReply = (reply: string) => {
    setMessages((m) => [...m, { role: "assistant", content: reply }])
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Assistant Chat</h2>

      <div className="mb-6">
        {messages.length === 0 && <p className="text-sm text-foreground/60">Ask the assistant about datasets, models or results.</p>}
        <div className="mt-4">
          {messages.map((m, idx) => (
            <ChatMessage key={idx} role={m.role} content={m.content} />
          ))}
        </div>
      </div>

      <ChatInput onSubmit={(_, __) => handleUserSubmit(_ as string)} disabled={loading} onAssistantReply={handleAssistantReply} />
    </div>
  )
}
