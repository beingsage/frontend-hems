"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function PeakLoadChart() {
  const data = [
    { day: "Mon", peak: 2800, threshold: 3000 },
    { day: "Tue", peak: 2950, threshold: 3000 },
    { day: "Wed", peak: 2700, threshold: 3000 },
    { day: "Thu", peak: 3100, threshold: 3000 },
    { day: "Fri", peak: 2850, threshold: 3000 },
    { day: "Sat", peak: 1900, threshold: 3000 },
    { day: "Sun", peak: 1800, threshold: 3000 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}W`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          formatter={(value: any) => [`${value}W`, "Peak Load"]}
        />
        <Bar dataKey="peak" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="threshold" fill="#ef4444" fillOpacity={0.2} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
