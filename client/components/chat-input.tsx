"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUploader } from "./file-uploader"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSubmit?: (message: string, file?: File) => void
  disabled?: boolean
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showFileUploader, setShowFileUploader] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() && !selectedFile) return

    onSubmit?.(message, selectedFile || undefined)
    setMessage("")
    setSelectedFile(null)
    setShowFileUploader(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit(e as any)
    }
  }

  return (
    <div className="space-y-4">
      {showFileUploader && <FileUploader onFileSelect={setSelectedFile} />}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowFileUploader(!showFileUploader)}
            className={cn(
              "p-2 rounded-lg transition",
              showFileUploader
                ? "bg-primary text-primary-foreground"
                : "bg-card/50 border border-border/40 hover:border-border/60 text-foreground/60",
            )}
            title="Upload dataset"
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your analysis goal... (e.g., 'Predict house prices')"
              className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 focus:border-primary focus:outline-none resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={disabled || (!message.trim() && !selectedFile)}
            size="icon"
            className="self-end"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-xs text-foreground/50 text-center">Ctrl + Enter to send</p>
      </form>
    </div>
  )
}
