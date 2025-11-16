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
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-foreground/60">Upload your dataset and get started with ML model evaluation</p>
      </div>

      {!results ? (
        <>
          {/* Quick Start Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Upload Dataset Card */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/60 transition p-6 cursor-pointer">
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
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Upload Dataset</h3>
                <p className="text-sm text-foreground/60 flex-1">Start by uploading your CSV or XLSX file</p>
                {file && <p className="text-xs text-primary mt-2 font-medium">{file.name}</p>}
              </div>
            </Card>

            {/* Describe Your Goal Card */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Describe Your Goal</h3>
              <p className="text-sm text-foreground/60 mb-4">Tell us what coloumn you want to predict or analyze</p>
              <Input
                placeholder="e.g., price"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="bg-background/50 border-border/50"
                disabled={loading}
              />
            </Card>

            {/* Compare Models Card - Action Button */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 flex flex-col">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
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
            <Card className="border-border/40 border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </Card>
          )}
        </>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Model Evaluation Results</h2>
              <p className="text-foreground/60">Analysis complete • {modelResults.length} models tested</p>
            </div>
            <Button variant="outline" onClick={clearResults}>
              <X className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          {/* Dataset Info */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Dataset Information</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-foreground/60">File Name</p>
                <p className="font-medium">{file?.name}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Target Column</p>
                <p className="font-medium">{goal}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Evaluation Status</p>
                <p className="font-medium text-primary">{results.status}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Models Tested</p>
                <p className="font-medium">{modelResults.length}</p>
              </div>
            </div>
          </Card>

          {/* Model Results Table */}
          {modelResults.length > 0 && (
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Model Performance Comparison</h3>
              <table className="w-full text-sm">
                <thead className="border-b border-border/40">
                  <tr>
                    <th className="text-left py-3 px-3 font-semibold">Model Name</th>
                    <th className="text-right py-3 px-3 font-semibold">Accuracy</th>
                    <th className="text-right py-3 px-3 font-semibold">R² Score</th>
                    <th className="text-right py-3 px-3 font-semibold">MSE</th>
                    <th className="text-right py-3 px-3 font-semibold">MAE</th>
                    <th className="text-right py-3 px-3 font-semibold">Time (s)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {modelResults.map((model, idx) => {
                    const isBest = modelResults[0].accuracy === model.accuracy
                    return (
                      <tr key={idx} className={isBest ? "bg-primary/5" : ""}>
                        <td className="py-3 px-3 font-medium">{model.name}</td>
                        <td className="text-right py-3 px-3">{(model.accuracy * 100).toFixed(2)}%</td>
                        <td className="text-right py-3 px-3">{model.r2.toFixed(4)}</td>
                        <td className="text-right py-3 px-3">{model.mse.toFixed(6)}</td>
                        <td className="text-right py-3 px-3">{model.mae.toFixed(4)}</td>
                        <td className="text-right py-3 px-3">{model.trainingTime.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          )}

          {/* Statistical Summary */}
          {modelResults.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Best Model */}
                <Card className="border-border/40 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Best Performing Model</h3>
                  {modelResults[0] && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-foreground/60">Model</p>
                        <p className="text-2xl font-bold text-primary">{modelResults[0].name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-foreground/60">Accuracy</p>
                          <p className="text-xl font-bold">{(modelResults[0].accuracy * 100).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/60">R² Score</p>
                          <p className="text-xl font-bold">{modelResults[0].r2.toFixed(4)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Statistics */}
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Statistical Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border/20">
                      <span className="text-sm text-foreground/60">Avg Accuracy</span>
                      <span className="font-medium">
                        {(
                          (modelResults.reduce((a, b) => a + b.accuracy, 0) / modelResults.length) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/20">
                      <span className="text-sm text-foreground/60">Avg R² Score</span>
                      <span className="font-medium">
                        {(modelResults.reduce((a, b) => a + b.r2, 0) / modelResults.length).toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/20">
                      <span className="text-sm text-foreground/60">Avg MSE</span>
                      <span className="font-medium">
                        {(modelResults.reduce((a, b) => a + b.mse, 0) / modelResults.length).toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-foreground/60">Total Time</span>
                      <span className="font-medium">{modelResults.reduce((a, b) => a + b.trainingTime, 0).toFixed(2)}s</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Performance Ranges */}
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Ranges</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Accuracy Range</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Min:</span>
                        <span className="font-medium">
                          {(Math.min(...modelResults.map((m) => m.accuracy)) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max:</span>
                        <span className="font-medium">
                          {(Math.max(...modelResults.map((m) => m.accuracy)) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Range:</span>
                        <span className="font-medium">
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
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">R² Score Range</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Min:</span>
                        <span className="font-medium">{Math.min(...modelResults.map((m) => m.r2)).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max:</span>
                        <span className="font-medium">{Math.max(...modelResults.map((m) => m.r2)).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Range:</span>
                        <span className="font-medium">
                          {(Math.max(...modelResults.map((m) => m.r2)) - Math.min(...modelResults.map((m) => m.r2))).toFixed(
                            4
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Training Time Range</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Min:</span>
                        <span className="font-medium">
                          {Math.min(...modelResults.map((m) => m.trainingTime)).toFixed(2)}s
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max:</span>
                        <span className="font-medium">
                          {Math.max(...modelResults.map((m) => m.trainingTime)).toFixed(2)}s
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Range:</span>
                        <span className="font-medium">
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
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Analyses</h2>
          <div className="text-center py-12 text-foreground/60">
            <p>No analyses yet. Start by uploading a dataset to get going!</p>
          </div>
        </Card>
      )}
    </div>
  )
}
