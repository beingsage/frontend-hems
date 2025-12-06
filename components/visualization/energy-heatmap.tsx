"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HeatmapProps {
  data: number[][]
  labels: { x: string[]; y: string[] }
  title: string
  description?: string
}

export function EnergyHeatmap({ data, labels, title, description }: HeatmapProps) {
  const maxValue = Math.max(...data.flat())

  const getColor = (value: number) => {
    const intensity = value / maxValue
    if (intensity > 0.8) return "bg-red-500"
    if (intensity > 0.6) return "bg-orange-500"
    if (intensity > 0.4) return "bg-yellow-500"
    if (intensity > 0.2) return "bg-green-500"
    return "bg-blue-500"
  }

  const getOpacity = (value: number) => {
    return (value / maxValue) * 0.9 + 0.1
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="w-20" />
            {labels.x.map((label) => (
              <div key={label} className="flex-1 text-center text-xs text-muted-foreground">
                {label}
              </div>
            ))}
          </div>
          {data.map((row, y) => (
            <div key={y} className="flex gap-2">
              <div className="w-20 text-xs text-muted-foreground flex items-center">{labels.y[y]}</div>
              {row.map((value, x) => (
                <div
                  key={x}
                  className={`flex-1 h-12 rounded ${getColor(value)} transition-all hover:scale-105 cursor-pointer relative group`}
                  style={{ opacity: getOpacity(value) }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white drop-shadow-lg">{value.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className="text-xs text-muted-foreground">Low</span>
          <div className="flex gap-1">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((intensity) => (
              <div
                key={intensity}
                className={`w-8 h-4 rounded ${
                  intensity > 0.8
                    ? "bg-red-500"
                    : intensity > 0.6
                      ? "bg-orange-500"
                      : intensity > 0.4
                        ? "bg-yellow-500"
                        : intensity > 0.2
                          ? "bg-green-500"
                          : "bg-blue-500"
                }`}
                style={{ opacity: intensity }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </CardContent>
    </Card>
  )
}
