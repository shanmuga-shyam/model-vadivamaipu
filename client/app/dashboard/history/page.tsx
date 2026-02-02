"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface HistoryItem {
  timestamp?: string
  file?: string
  goal?: string
  status?: string
  message?: string
  data?: any
}

export default function HistoryPage() {
  const auth = useAuth()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Only fetch after token is available
    if (!auth.token) return

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/results/history`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        if (res.status === 401) {
          auth.handleTokenError()
          return
        }
        if (res.ok) {
          const data = await res.json()
          if (data.history) {
            setHistory(Array.isArray(data.history) ? data.history : [])
          }
        } else {
          setError("Failed to fetch history")
        }
      } catch (err) {
        console.error("Failed to fetch history:", err)
        setError("Error loading history")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [auth.token])

  const handleDelete = async (index: number) => {
    const newHistory = history.filter((_, i) => i !== index)
    setHistory(newHistory)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analysis History</h1>
        <p className="text-foreground/60">View all your previous model evaluations</p>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {history.length === 0 ? (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-12 text-center">
          <p className="text-foreground/60 mb-4">No analysis history yet</p>
          <Button asChild>
            <Link href="/dashboard">Start a new analysis</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <Card
              key={idx}
              className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-lg">
                      {item.file ? `${item.file}` : `Analysis ${idx + 1}`}
                    </h3>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                      {item.status || "completed"}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-foreground/60">Target Column</p>
                      <p className="font-medium">{item.goal || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Date</p>
                      <p className="font-medium">
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground/60">Time</p>
                      <p className="font-medium">
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleTimeString()
                          : new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Model Stats */}
                  {item.data?.models && (
                    <div className="grid md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-background/50 rounded p-3">
                        <p className="text-foreground/60">Best Accuracy</p>
                        <p className="text-xl font-bold text-primary">
                          {(Math.max(...item.data.models.map((m: any) => m.accuracy || 0)) * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div className="bg-background/50 rounded p-3">
                        <p className="text-foreground/60">Avg Accuracy</p>
                        <p className="text-xl font-bold">
                          {(
                            (item.data.models.reduce((a: number, m: any) => a + (m.accuracy || 0), 0) /
                              item.data.models.length) *
                            100
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                      <div className="bg-background/50 rounded p-3">
                        <p className="text-foreground/60">Models Tested</p>
                        <p className="text-xl font-bold">{item.data.models.length}</p>
                      </div>
                      <div className="bg-background/50 rounded p-3">
                        <p className="text-foreground/60">Avg Time</p>
                        <p className="text-xl font-bold">
                          {(
                            item.data.models.reduce((a: number, m: any) => a + (m.trainingTime || 0), 0) /
                            item.data.models.length
                          ).toFixed(2)}
                          s
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/results">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(idx)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {history.length > 0 && (
        <Card className="border-border/40 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Overall Statistics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-foreground/60">Total Analyses</p>
              <p className="text-3xl font-bold text-primary">{history.length}</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Avg Best Accuracy</p>
              <p className="text-3xl font-bold">
                {(
                  history.length > 0
                    ? (
                        history
                          .filter((h) => h.data?.models && h.data.models.length > 0)
                          .reduce(
                            (acc, h) => acc + Math.max(...h.data!.models.map((m: any) => m.accuracy || 0)),
                            0
                          ) / history.filter((h) => h.data?.models && h.data.models.length > 0).length
                      ) * 100
                    : 0
                ).toFixed(2)}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Total Models Tested</p>
              <p className="text-3xl font-bold">
                {history.reduce((acc, h) => acc + (h.data?.models?.length || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Datasets Analyzed</p>
              <p className="text-3xl font-bold">{history.filter((h) => h.file).length}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
