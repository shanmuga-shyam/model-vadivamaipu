"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelTable } from "@/components/model-table"
import { MetricsChart } from "@/components/metrics-chart"
import { DatasetPreview } from "@/components/dataset-preview"
import { Download, FileText } from "lucide-react"

export default function ResultsPage() {
  // Mock data
  const modelResults = [
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

  const chartData = modelResults.map(({ name, accuracy, r2, mse, mae }) => ({
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
          <p className="text-foreground/60">Analysis of Loan Approval Dataset - 12 Features</p>
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
          <ModelTable results={modelResults} />

          {/* Best Model Details */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recommended Model: Random Forest</h2>
            <p className="text-foreground/60 mb-4">
              The Random Forest model achieved the highest accuracy (92%) with excellent generalization. It combines
              multiple decision trees to reduce overfitting and provides robust predictions.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-foreground/60">Accuracy</p>
                <p className="text-2xl font-bold text-primary">92.00%</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Training Time</p>
                <p className="text-2xl font-bold text-primary">2.34s</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Best Metric</p>
                <p className="text-2xl font-bold text-primary">R² = 0.90</p>
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
