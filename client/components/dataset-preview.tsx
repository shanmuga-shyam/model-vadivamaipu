import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DatasetStats {
  rows: number
  columns: number
  missingValues: number
  columnNames: string[]
}

interface DatasetPreviewProps {
  stats: DatasetStats
  sampleData?: Record<string, string | number>[]
}

export function DatasetPreview({ stats, sampleData }: DatasetPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-4">
          <p className="text-sm text-foreground/60 mb-1">Total Rows</p>
          <p className="text-2xl font-bold text-primary">{stats.rows.toLocaleString()}</p>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-4">
          <p className="text-sm text-foreground/60 mb-1">Columns</p>
          <p className="text-2xl font-bold text-primary">{stats.columns}</p>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-4">
          <p className="text-sm text-foreground/60 mb-1">Missing Values</p>
          <p className="text-2xl font-bold text-accent">{stats.missingValues}</p>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-4">
          <p className="text-sm text-foreground/60 mb-1">Data Quality</p>
          <p className="text-2xl font-bold text-primary">
            {(((stats.rows * stats.columns - stats.missingValues) / (stats.rows * stats.columns)) * 100).toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Column Names */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6">
        <h3 className="font-semibold mb-4">Columns ({stats.columns})</h3>
        <div className="flex flex-wrap gap-2">
          {stats.columnNames.map((col) => (
            <Badge key={col} variant="secondary">
              {col}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Sample Data */}
      {sampleData && sampleData.length > 0 && (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm p-6 overflow-x-auto">
          <h3 className="font-semibold mb-4">Sample Data (First 5 Rows)</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                {Object.keys(sampleData[0]).map((key) => (
                  <th key={key} className="text-left py-2 px-3 font-semibold">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, idx) => (
                <tr key={idx} className="border-b border-border/40 hover:bg-background/50">
                  {Object.values(row).map((val, colIdx) => (
                    <td key={colIdx} className="py-2 px-3">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
