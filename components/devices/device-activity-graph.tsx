"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"

interface ActivityData {
  date: string
  value: number
}

interface DeviceActivityGraphProps {
  data: ActivityData[]
  maxValue?: number
}

export function DeviceActivityGraph({ data, maxValue }: DeviceActivityGraphProps) {
  const weeks = 12 // Show last 12 weeks of activity
  const daysPerWeek = 7
  
  const normalizedData = useMemo(() => {
    const max = maxValue || Math.max(...data.map(d => d.value))
    return data.map(d => ({
      ...d,
      intensity: Math.min(Math.floor((d.value / max) * 4), 4) // 0-4 intensity levels
    }))
  }, [data, maxValue])

  const getIntensityClass = (intensity: number) => {
    const classes = [
      "bg-gray-100",
      "bg-green-100",
      "bg-green-300",
      "bg-green-500",
      "bg-green-700"
    ]
    return classes[intensity] || classes[0]
  }

  return (
    <div className="w-full p-2">
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: weeks * daysPerWeek }).map((_, index) => {
          const day = normalizedData[index] || { intensity: 0 }
          return (
            <div
              key={index}
              className={`w-3 h-3 rounded-sm ${getIntensityClass(day.intensity)} hover:ring-2 hover:ring-offset-1 hover:ring-blue-400 transition-all`}
              title={day.date ? `${day.date}: ${data[index]?.value.toFixed(2)} kWh` : "No data"}
            />
          )
        })}
      </div>
    </div>
  )
}