"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface Props {
  deviceId: string
  timeWindow: string
}

interface DataPoint {
  timestamp: string
  power: number
}

export function DeviceTimeSeriesChart({ deviceId, timeWindow }: Props) {
  const [data, setData] = useState<DataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data based on timeWindow
    setIsLoading(true)
    const points = []
    const now = Date.now()
    const intervals = {
      "1h": { count: 60, step: 60 * 1000 }, // 1 minute intervals
      "24h": { count: 24, step: 60 * 60 * 1000 }, // 1 hour intervals
      "7d": { count: 7, step: 24 * 60 * 60 * 1000 }, // 1 day intervals
    }[timeWindow]

    for (let i = intervals.count - 1; i >= 0; i--) {
      const timestamp = new Date(now - i * intervals.step)
      points.push({
        timestamp: timestamp.toISOString(),
        power: Math.round(500 + Math.random() * 1000),
      })
    }

    setData(points)
    setIsLoading(false)
  }, [deviceId, timeWindow])

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => {
              const date = new Date(value)
              return timeWindow === "1h"
                ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : timeWindow === "24h"
                ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : date.toLocaleDateString([], { month: "short", day: "numeric" })
            }}
          />
          <YAxis tickFormatter={(value) => `${value}W`} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value: number) => [`${value}W`, "Power"]}
          />
          <Line
            type="monotone"
            dataKey="power"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}