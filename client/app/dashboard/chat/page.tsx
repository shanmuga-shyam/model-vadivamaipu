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
    // ChatInput will perform the request and call onAssistantReply when response arrives.
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

      <ChatInput
        onSubmit={(msg) => handleUserSubmit(msg)}
        disabled={loading}
        onAssistantReply={(reply) => {
          handleAssistantReply(reply)
        }}
      />
    </div>
  )
}
