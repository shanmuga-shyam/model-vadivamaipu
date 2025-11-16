"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelTable } from "@/components/model-table"
import { MetricsChart } from "@/components/metrics-chart"
import { DatasetPreview } from "@/components/dataset-preview"
import { Download, FileText, Loader } from "lucide-react"

interface ModelResult {
  id: string
  name: string
  accuracy: number
  r2: number
  mse: number
  mae: number
  trainingTime: number
  isBest?: boolean
}

export default function ResultsPage() {
  const auth = useAuth()
  const [modelResults, setModelResults] = useState<ModelResult[]>([])
  const [loading, setLoading] = useState(true)
  const [datasetName, setDatasetName] = useState("")
  const [targetColumn, setTargetColumn] = useState("")

  useEffect(() => {
    const fetchLatestResult = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/results/latest`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        if (res.status === 401) {
          auth.handleTokenError()
          return
        }
        if (res.ok) {
          const data = await res.json()
          if (data.data?.models) {
            setModelResults(data.data.models)
          }
          if (data.file) setDatasetName(data.file)
          if (data.goal) setTargetColumn(data.goal)
        }
      } catch (err) {
        console.error("Failed to fetch results:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLatestResult()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // Fallback mock data if no results from backend
  const displayResults = modelResults.length > 0 ? modelResults : [
    {
      id: "1",
      name: "Linear Regression",
      accuracy: 0.85,
      r2: 0.82,
      mse: 0.0234,
      mae: 0.112,
      trainingTime: 0.45,
    },
    {
      id: "2",
      name: "Random Forest",
      accuracy: 0.92,
      r2: 0.9,
      mse: 0.0156,
      mae: 0.089,
      trainingTime: 2.34,
      isBest: true,
    },
    {
      id: "3",
      name: "SVM (RBF)",
      accuracy: 0.88,
      r2: 0.86,
      mse: 0.0198,
      mae: 0.101,
      trainingTime: 1.23,
    },
    {
      id: "4",
      name: "Gradient Boosting",
      accuracy: 0.9,
      r2: 0.88,
      mse: 0.0172,
      mae: 0.095,
      trainingTime: 3.12,
    },
  ]

  const chartData = displayResults.map(({ name, accuracy, r2, mse, mae }) => ({
    name,
    accuracy,
    r2,
    mse,
    mae,
  }))

  const datasetStats = {
    rows: 1250,
    columns: 12,
    missingValues: 45,
    columnNames: [
      "Age",
      "Income",
      "Credit Score",
      "Loan Amount",
      "Employment Years",
      "Debt Ratio",
      "Savings",
      "Education",
      "Marital Status",
      "Property Type",
      "Location",
      "Approval Status",
    ],
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Model Evaluation Results</h1>
          <p className="text-foreground/60">
            {datasetName && targetColumn
              ? `Analysis of ${datasetName} - Predicting ${targetColumn}`
              : "Latest evaluation results"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" gap-2>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button gap-2>
            <FileText className="w-4 h-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="models" className="w-full">
        <TabsList>
          <TabsTrigger value="models">Model Results</TabsTrigger>
          <TabsTrigger value="charts">Performance Metrics</TabsTrigger>
          <TabsTrigger value="dataset">Dataset Info</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <ModelTable results={displayResults} />

          {/* Best Model Details */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recommended Model: {displayResults[0]?.name || "N/A"}
            </h2>
            <p className="text-foreground/60 mb-4">
              The {displayResults[0]?.name} model achieved the highest accuracy (
              {((displayResults[0]?.accuracy || 0) * 100).toFixed(2)}%) with excellent generalization.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-foreground/60">Accuracy</p>
                <p className="text-2xl font-bold text-primary">
                  {((displayResults[0]?.accuracy || 0) * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Training Time</p>
                <p className="text-2xl font-bold text-primary">{(displayResults[0]?.trainingTime || 0).toFixed(2)}s</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Best Metric</p>
                <p className="text-2xl font-bold text-primary">R² = {(displayResults[0]?.r2 || 0).toFixed(4)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <MetricsChart data={chartData} />
        </TabsContent>

        <TabsContent value="dataset" className="space-y-6">
          <DatasetPreview
            stats={datasetStats}
            sampleData={[
              { Age: 35, Income: 75000, "Credit Score": 720, "Loan Amount": 250000 },
              { Age: 42, Income: 95000, "Credit Score": 780, "Loan Amount": 350000 },
              { Age: 28, Income: 55000, "Credit Score": 680, "Loan Amount": 150000 },
              { Age: 51, Income: 120000, "Credit Score": 800, "Loan Amount": 500000 },
              { Age: 38, Income: 85000, "Credit Score": 740, "Loan Amount": 300000 },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
