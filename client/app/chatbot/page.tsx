"use client"

import React, { useRef, useEffect, useState } from "react"
import { RobotMascot } from "@/components/robot-mascot"

export default function ChatbotPage() {
  const chatRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Slight delay to ensure layout paint before triggering flight
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8 flex items-center justify-center">
      <div ref={chatRef} className="w-full max-w-3xl h-[520px] bg-white/5 rounded-2xl p-6 relative z-20">
        <h2 className="text-2xl font-semibold mb-4">Model Chatbot</h2>
        <p className="text-sm text-slate-300">This chatbot knows about the project's models. Start a conversation below.</p>

        <div className="mt-6 h-[360px] bg-white/5 rounded-lg p-4 overflow-auto text-slate-200">
          {/* Chat UI stub - implement actual chat interactions here */}
          <div className="italic text-slate-400">Chat UI placeholder</div>
        </div>
      </div>

      {mounted && (
        <RobotMascot variant="holding" targetCard={chatRef.current} onAnimationComplete={() => { /* optional hook */ }} />
      )}
    </div>
  )
}
