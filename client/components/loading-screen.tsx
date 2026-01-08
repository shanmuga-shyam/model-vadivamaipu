"use client"

import React, { useEffect } from "react"

interface LoadingScreenProps {
  type?: string
}

export function LoadingScreen({ type }: LoadingScreenProps) {
  // Resolve GIFs from the local `client/asset` folder via import-meta URL
  const robotHi = new URL("../asset/Robot Says Hi.gif", import.meta.url).toString()
  const searchGif = new URL("../asset/search for employee.gif", import.meta.url).toString()
  const sandy = new URL("../asset/Sandy Loading.gif", import.meta.url).toString()
  const untitled = new URL("../asset/Untitled file.gif", import.meta.url).toString()
  const uploading = new URL("../asset/Uploading to cloud.gif", import.meta.url).toString()

  const gifMap: Record<string, string> = {
    "robot-hi": robotHi,
    search: searchGif,
    sandy,
    untitled,
    uploading,
  }

  const src = (type && gifMap[type]) || uploading

  // minor effect to avoid flash; component is already gated by mounted check in provider
  useEffect(() => {}, [type])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-w-md w-full p-6 bg-card/90 border border-border/40 rounded-2xl flex flex-col items-center gap-4">
        {src ? (
          // Use plain img so developer can drop gifs into public/loading-gifs/
          // Expected filenames: robot-says-hi.gif, search-employee.gif, sandy-loading.gif, untitled.gif, uploading-to-cloud.gif, default-loading.gif
          <img src={src} alt="loading" className="w-48 h-48 object-contain" />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center">Loading...</div>
        )}
        <p className="text-sm text-foreground/70">Please wait — loading</p>
      </div>
    </div>
  )
}
