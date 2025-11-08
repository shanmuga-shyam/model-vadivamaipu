import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

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

interface ModelTableProps {
  results: ModelResult[]
}

export function ModelTable({ results }: ModelTableProps) {
  const bestModel = results.reduce((best, current) => (current.accuracy > best.accuracy ? current : best))

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left py-3 px-4 font-semibold">Model</th>
            <th className="text-right py-3 px-4 font-semibold">Accuracy</th>
            <th className="text-right py-3 px-4 font-semibold">R² Score</th>
            <th className="text-right py-3 px-4 font-semibold">MSE</th>
            <th className="text-right py-3 px-4 font-semibold">MAE</th>
            <th className="text-right py-3 px-4 font-semibold">Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr
              key={result.id}
              className={cn(
                "border-b border-border/40 hover:bg-background/50 transition",
                result.id === bestModel.id && "bg-primary/5",
              )}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {result.id === bestModel.id && <Trophy className="w-4 h-4 text-primary" />}
                  <span className="font-medium">{result.name}</span>
                  {result.id === bestModel.id && (
                    <Badge variant="default" className="text-xs">
                      Best
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-right">{(result.accuracy * 100).toFixed(2)}%</td>
              <td className="py-3 px-4 text-right">{result.r2.toFixed(4)}</td>
              <td className="py-3 px-4 text-right">{result.mse.toFixed(4)}</td>
              <td className="py-3 px-4 text-right">{result.mae.toFixed(4)}</td>
              <td className="py-3 px-4 text-right">{result.trainingTime.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
