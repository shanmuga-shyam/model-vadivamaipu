"use client"

import { Card } from "@/components/ui/card"
import { Upload, MessageSquare, BarChart3 } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-foreground/60">Upload your dataset and get started with ML model evaluation</p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-6 cursor-pointer">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Upload Dataset</h3>
          <p className="text-sm text-foreground/60">Start by uploading your CSV or XLSX file</p>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-6 cursor-pointer">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Describe Your Goal</h3>
          <p className="text-sm text-foreground/60">Tell us what you want to predict or analyze</p>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition p-6 cursor-pointer">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Compare Models</h3>
          <p className="text-sm text-foreground/60">See results from multiple ML algorithms</p>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Analyses</h2>
        <div className="text-center py-12 text-foreground/60">
          <p>No analyses yet. Start by uploading a dataset to get going!</p>
        </div>
      </Card>
    </div>
  )
}
