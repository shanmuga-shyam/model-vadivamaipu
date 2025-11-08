"use client"

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChartData {
  name: string
  accuracy: number
  r2: number
  mse: number
  mae: number
}

interface MetricsChartProps {
  data: ChartData[]
}

export function MetricsChart({ data }: MetricsChartProps) {
  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
      <Tabs defaultValue="accuracy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          <TabsTrigger value="r2">R² Score</TabsTrigger>
          <TabsTrigger value="mse">MSE</TabsTrigger>
          <TabsTrigger value="mae">MAE</TabsTrigger>
        </TabsList>

        <TabsContent value="accuracy" className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-foreground)" opacity={0.7} />
              <YAxis stroke="var(--color-foreground)" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              />
              <Bar dataKey="accuracy" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="r2" className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-foreground)" opacity={0.7} />
              <YAxis stroke="var(--color-foreground)" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              />
              <Line
                type="monotone"
                dataKey="r2"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ fill: "var(--color-accent)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="mse" className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-foreground)" opacity={0.7} />
              <YAxis stroke="var(--color-foreground)" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              />
              <Bar dataKey="mse" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="mae" className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-foreground)" opacity={0.7} />
              <YAxis stroke="var(--color-foreground)" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              />
              <Line
                type="monotone"
                dataKey="mae"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-2)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
