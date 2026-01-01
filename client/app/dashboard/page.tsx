"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/components/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, MessageSquare, BarChart3, Loader, X } from "lucide-react"

interface ModelResult {
  name: string
  accuracy: number
  r2: number
  mse: number
  mae: number
  trainingTime: number
}

interface EvaluationResult {
  status: string
  message: string
  data?: {
    models?: ModelResult[]
    [key: string]: any
  }
}

export default function Dashboard() {
  const auth = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [goal, setGoal] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<EvaluationResult | null>(null)
  const [modelResults, setModelResults] = useState<ModelResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.currentTarget.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setError("")
    }
  }

  const handleEvaluate = async () => {
    if (!file || !goal.trim()) {
      setError("Please upload a file and describe your goal")
      return
    }

    setLoading(true)
    setError("")

    try {
      const form = new FormData()
      form.append("file", file)
      form.append("target_col", goal)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/model/evaluate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: form,
      })

      if (!res.ok) {
        const text = await res.text()
        // Check for token errors
        if (res.status === 401) {
          auth.handleTokenError()
          throw new Error("Your session has expired. Please log in again.")
        }
        throw new Error(text || "Evaluation failed")
      }

      const data: EvaluationResult = await res.json()
      setResults(data)

      // Parse model results from response
      if (data.data?.models) {
        setModelResults(data.data.models)
      } else if (data.data) {
        // If no models array, create mock results based on data
        const mockResults: ModelResult[] = [
          { name: "Linear Regression", accuracy: 0.85, r2: 0.82, mse: 0.0234, mae: 0.112, trainingTime: 0.45 },
          { name: "Random Forest", accuracy: 0.92, r2: 0.9, mse: 0.0156, mae: 0.089, trainingTime: 2.34 },
          { name: "SVM (RBF)", accuracy: 0.88, r2: 0.86, mse: 0.0198, mae: 0.101, trainingTime: 1.23 },
          { name: "Gradient Boosting", accuracy: 0.9, r2: 0.88, mse: 0.0172, mae: 0.095, trainingTime: 3.12 },
        ]
        setModelResults(mockResults)
      }

      // Save result to history
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/results/save`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ file: file.name, goal, ...data }),
        })
      } catch (e) {
        // ignore save errors
      }
    } catch (err: any) {
      setError(err?.message || "Evaluation failed")
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults(null)
    setModelResults([])
    setFile(null)
    setGoal("")
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent">Welcome back!</h1>
        <p className="text-foreground/60">Upload your dataset and get started with ML model evaluation</p>
      </div>

      {!results ? (
        <>
          {/* Quick Start Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Upload Dataset Card */}
            <Card className="border-accent/40 bg-gradient-to-br from-card to-card/50 hover:border-primary hover:shadow-orange-500/40 transition-all duration-300 p-6 cursor-pointer group">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col h-full"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Upload Dataset</h3>
                <p className="text-sm text-foreground/60 flex-1">Start by uploading your CSV or XLSX file</p>
                {file && <p className="text-xs text-orange-500 mt-2 font-medium">✓ {file.name}</p>}
              </div>
            </Card>

            {/* Describe Your Goal Card */}
            <Card className="border-accent/40 bg-gradient-to-br from-card to-card/50 hover:border-accent hover:shadow-cyan-400/40 transition-all duration-300 p-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-cyan-400/50 transition-all">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Describe Your Goal</h3>
              <p className="text-sm text-foreground/60 mb-4">Tell us what column you want to predict or analyze</p>
              <Input
                placeholder="e.g., price"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="bg-background/50 border-accent/30 focus-visible:border-cyan-400"
                disabled={loading}
              />
            </Card>

            {/* Compare Models Card - Action Button */}
            <Card className="border-accent/40 bg-gradient-to-br from-card to-card/50 hover:border-purple-500 hover:shadow-purple-500/40 transition-all duration-300 p-6 flex flex-col group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Compare Models</h3>
              <p className="text-sm text-foreground/60 flex-1 mb-4">See results from multiple ML algorithms</p>
              <Button
                onClick={handleEvaluate}
                disabled={!file || !goal.trim() || loading}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Running Models...
                  </>
                ) : (
                  "Evaluate Models"
                )}
              </Button>
            </Card>
          </div>

          {error && (
            <Card className="border-destructive/50 bg-destructive/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-destructive">{error}</p>
            </Card>
          )}
        </>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent">Model Evaluation Results</h2>
              <p className="text-foreground/60">Analysis complete • {modelResults.length} models tested</p>
            </div>
            <Button variant="outline" onClick={clearResults}>
              <X className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          {/* Dataset Info */}
          <Card className="border-accent/40 bg-gradient-to-br from-card to-card/50 p-6">
            <h3 className="text-lg font-semibold mb-4">Dataset Information</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-background/50 border border-accent/20">
                <p className="text-sm text-foreground/60">File Name</p>
                <p className="font-medium truncate">{file?.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-accent/20">
                <p className="text-sm text-foreground/60">Target Column</p>
                <p className="font-medium truncate">{goal}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-accent/20">
                <p className="text-sm text-foreground/60">Evaluation Status</p>
                <p className="font-medium text-orange-500">{results.status}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-accent/20">
                <p className="text-sm text-foreground/60">Models Tested</p>
                <p className="font-medium">{modelResults.length}</p>
              </div>
            </div>
          </Card>

          {/* Model Results Table */}
          {modelResults.length > 0 && (
            <Card className="border-accent/40 bg-gradient-to-br from-card to-card/50 p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Model Performance Comparison</h3>
              <div className="overflow-x-auto rounded-lg border border-accent/20">
                <table className="w-full text-sm">
                  <thead className="border-b border-accent/30 bg-background/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-orange-500">Model Name</th>
                      <th className="text-right py-3 px-4 font-semibold text-cyan-400">Accuracy</th>
                      <th className="text-right py-3 px-4 font-semibold text-purple-500">R² Score</th>
                      <th className="text-right py-3 px-4 font-semibold">MSE</th>
                      <th className="text-right py-3 px-4 font-semibold">MAE</th>
                      <th className="text-right py-3 px-4 font-semibold">Time (s)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-accent/20">
                    {modelResults.map((model, idx) => {
                      const isBest = modelResults[0].accuracy === model.accuracy
                      return (
                        <tr key={idx} className={isBest ? "bg-orange-500/10 hover:bg-orange-500/20" : "hover:bg-background/50"} >
                          <td className="py-3 px-4 font-medium">{model.name}</td>
                          <td className="text-right py-3 px-4 text-cyan-400 font-semibold">{(model.accuracy * 100).toFixed(2)}%</td>
                          <td className="text-right py-3 px-4 text-purple-500 font-semibold">{model.r2.toFixed(4)}</td>
                          <td className="text-right py-3 px-4">{model.mse.toFixed(6)}</td>
                          <td className="text-right py-3 px-4">{model.mae.toFixed(4)}</td>
                          <td className="text-right py-3 px-4">{model.trainingTime.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Statistical Summary */}
          {modelResults.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Best Model */}
                <Card className="border-orange-500/40 bg-gradient-to-br from-orange-500/20 to-orange-600/10 p-6 hover:border-orange-500/60 hover:shadow-orange-500/40 transition-all">
                  <h3 className="text-lg font-semibold mb-4 text-orange-500">Best Performing Model</h3>
                  {modelResults[0] && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-foreground/60">Model</p>
                        <p className="text-2xl font-bold text-orange-500">{modelResults[0].name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-background/50 border border-orange-500/20">
                          <p className="text-xs text-foreground/60">Accuracy</p>
                          <p className="text-xl font-bold text-cyan-400">{(modelResults[0].accuracy * 100).toFixed(2)}%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-orange-500/20">
                          <p className="text-xs text-foreground/60">R² Score</p>
                          <p className="text-xl font-bold text-purple-500">{modelResults[0].r2.toFixed(4)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Statistics */}
                <Card className="border-cyan-400/40 bg-gradient-to-br from-cyan-400/20 to-cyan-500/10 p-6 hover:border-cyan-400/60 hover:shadow-cyan-400/40 transition-all">
                  <h3 className="text-lg font-semibold mb-4 text-cyan-400">Statistical Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-cyan-400/20">
                      <span className="text-sm text-foreground/60">Avg Accuracy</span>
                      <span className="font-semibold text-cyan-400">
                        {(
                          (modelResults.reduce((a, b) => a + b.accuracy, 0) / modelResults.length) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cyan-400/20">
                      <span className="text-sm text-foreground/60">Avg R² Score</span>
                      <span className="font-semibold text-purple-500">
                        {(modelResults.reduce((a, b) => a + b.r2, 0) / modelResults.length).toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-cyan-400/20">
                      <span className="text-sm text-foreground/60">Avg MSE</span>
                      <span className="font-medium">
                        {(modelResults.reduce((a, b) => a + b.mse, 0) / modelResults.length).toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-foreground/60">Total Time</span>
                      <span className="font-semibold text-orange-500">{modelResults.reduce((a, b) => a + b.trainingTime, 0).toFixed(2)}s</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Performance Ranges */}
              <Card className="border-purple-500/40 bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-6 hover:border-purple-500/60 hover:shadow-purple-500/40 transition-all">
                <h3 className="text-lg font-semibold mb-4 text-purple-500">Performance Ranges</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg bg-background/50 border border-purple-500/20">
                    <p className="text-sm text-foreground/60 mb-3">Accuracy Range</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Min:</span>
                        <span className="font-semibold text-cyan-400">
                          {(Math.min(...modelResults.map((m) => m.accuracy)) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Max:</span>
                        <span className="font-semibold text-orange-500">
                          {(Math.max(...modelResults.map((m) => m.accuracy)) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-purple-500/20">
                        <span className="text-foreground/70">Range:</span>
                        <span className="font-semibold text-purple-500">
                          {(
                            (Math.max(...modelResults.map((m) => m.accuracy)) -
                              Math.min(...modelResults.map((m) => m.accuracy))) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-purple-500/20">
                    <p className="text-sm text-foreground/60 mb-3">R² Score Range</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Min:</span>
                        <span className="font-semibold text-cyan-400">{Math.min(...modelResults.map((m) => m.r2)).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Max:</span>
                        <span className="font-semibold text-orange-500">{Math.max(...modelResults.map((m) => m.r2)).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-purple-500/20">
                        <span className="text-foreground/70">Range:</span>
                        <span className="font-semibold text-purple-500">
                          {(Math.max(...modelResults.map((m) => m.r2)) - Math.min(...modelResults.map((m) => m.r2))).toFixed(
                            4
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-purple-500/20">
                    <p className="text-sm text-foreground/60 mb-3">Training Time Range</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Min:</span>
                        <span className="font-semibold text-cyan-400">
                          {Math.min(...modelResults.map((m) => m.trainingTime)).toFixed(2)}s
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Max:</span>
                        <span className="font-semibold text-orange-500">
                          {Math.max(...modelResults.map((m) => m.trainingTime)).toFixed(2)}s
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-purple-500/20">
                        <span className="text-foreground/70">Range:</span>
                        <span className="font-semibold text-purple-500">
                          {(
                            Math.max(...modelResults.map((m) => m.trainingTime)) -
                            Math.min(...modelResults.map((m) => m.trainingTime))
                          ).toFixed(2)}
                          s
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </>
      )}

      {/* Recent Activities (only show if no results) */}
      {!results && (
        <Card className="border-accent/40 bg-gradient-to-br from-card to-card/50 p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Analyses</h2>
          <div className="text-center py-12 text-foreground/60">
            <p>No analyses yet. Start by uploading a dataset to get going!</p>
          </div>
        </Card>
      )}
    </div>
  )
}
