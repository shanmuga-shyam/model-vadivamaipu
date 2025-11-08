"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, File, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onFileSelect?: (file: File) => void
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "text/csv" || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        setSelectedFile(file)
        onFileSelect?.(file)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files?.length) {
      const file = files[0]
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-border/40 hover:border-border/60 bg-card/30",
        )}
      >
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleInputChange} className="hidden" />

        <div onClick={() => inputRef.current?.click()} className="space-y-2">
          <Upload className="w-8 h-8 mx-auto text-primary/60" />
          <div>
            <p className="font-medium text-sm">Drop your file here or click to browse</p>
            <p className="text-xs text-foreground/60">Supported: CSV, XLSX, XLS</p>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/40">
          <File className="w-4 h-4 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-foreground/60">{(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
          <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-background rounded transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
