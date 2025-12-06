"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

const performanceData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  efficiency: 85 + Math.random() * 10,
  load: 60 + Math.random() * 30,
  temperature: 22 + Math.random() * 3,
}))

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Performance (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            efficiency: {
              label: "Efficiency (%)",
              color: "hsl(var(--chart-4))",
            },
            load: {
              label: "Load (%)",
              color: "hsl(var(--chart-1))",
            },
            temperature: {
              label: "Temperature (°C)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="hour" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--chart-4))" strokeWidth={2} />
              <Line type="monotone" dataKey="load" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              <Line type="monotone" dataKey="temperature" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
