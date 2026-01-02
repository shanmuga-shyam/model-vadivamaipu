"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { LoadingScreen } from "./loading-screen"

interface LoadingContextType {
  isLoading: boolean
  showLoading: () => void
  hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true) // Start with true to show on load
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(Date.now())
  const [mounted, setMounted] = useState(false)

  // Show loading screen on initial page load for 3 seconds minimum
  useEffect(() => {
    setMounted(true)
    
    // Auto-hide after 3 seconds if nothing else manages it
    const timer = setTimeout(() => {
      setIsLoading(false)
      setLoadingStartTime(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const showLoading = () => {
    setIsLoading(true)
    setLoadingStartTime(Date.now())
  }

  const hideLoading = () => {
    if (loadingStartTime === null) {
      setIsLoading(false)
      return
    }

    const elapsedTime = Date.now() - loadingStartTime
    const minDuration = 3000 // 3 seconds minimum

    if (elapsedTime < minDuration) {
      // Wait for remaining time
      setTimeout(() => {
        setIsLoading(false)
        setLoadingStartTime(null)
      }, minDuration - elapsedTime)
    } else {
      setIsLoading(false)
      setLoadingStartTime(null)
    }
  }

  // Only show loading if mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {isLoading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within LoadingProvider")
  }
  return context
}
