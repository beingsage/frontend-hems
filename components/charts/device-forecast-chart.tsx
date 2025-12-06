"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface Props {
  deviceId: string
}

interface DataPoint {
  timestamp: string
  forecast: number
  upperBound: number
  lowerBound: number
}

export function DeviceForecastChart({ deviceId }: Props) {
  const [data, setData] = useState<DataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching forecast data
    setIsLoading(true)
    const points = []
    const now = Date.now()
    const hourInMs = 60 * 60 * 1000

    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now + i * hourInMs)
      const basePower = 750 + Math.sin(i * Math.PI / 12) * 250 // Create a sine wave pattern
      const uncertainty = 100 + (i * 10) // Increasing uncertainty over time
      
      points.push({
        timestamp: timestamp.toISOString(),
        forecast: Math.round(basePower),
        upperBound: Math.round(basePower + uncertainty),
        lowerBound: Math.round(basePower - uncertainty),
      })
    }

    setData(points)
    setIsLoading(false)
  }, [deviceId])

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          />
          <YAxis tickFormatter={(value) => `${value}W`} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value: number) => [`${value}W`, "Power"]}
          />
          <Area
            type="monotone"
            dataKey="upperBound"
            stroke="transparent"
            fill="hsl(var(--primary))"
            fillOpacity={0.1}
          />
          <Area
            type="monotone"
            dataKey="lowerBound"
            stroke="transparent"
            fill="hsl(var(--primary))"
            fillOpacity={0.1}
          />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}