"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { Loader } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function AnalyzePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your ML Model Assistant. Upload a dataset and describe what you want to predict or analyze, and I'll automatically test multiple algorithms to find the best one for your use case.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (message: string, file?: File) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Great! I've received your dataset${file ? ` (${file.name})` : ""} and understand you want to "${message}". Let me analyze the data and test multiple ML algorithms for you...`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Model Analysis</h1>
        <p className="text-foreground/60">Upload your dataset and describe your analysis goal</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <p className="text-foreground/60">Start a new analysis</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
          ))
        )}

        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Loader className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="bg-card border border-border/40 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
        <ChatInput onSubmit={handleSubmit} disabled={loading} />
      </Card>
    </div>
  )
}
