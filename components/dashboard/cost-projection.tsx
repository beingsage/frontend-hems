"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

const projectionData = [
  { month: "Jan", actual: 2400, projected: 2200, optimized: 1800 },
  { month: "Feb", actual: 2600, projected: 2400, optimized: 1900 },
  { month: "Mar", actual: 2800, projected: 2600, optimized: 2000 },
  { month: "Apr", actual: 3000, projected: 2800, optimized: 2100 },
  { month: "May", actual: 0, projected: 3000, optimized: 2200 },
  { month: "Jun", actual: 0, projected: 3200, optimized: 2300 },
]

export function CostProjection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Projection & Savings</CardTitle>
        <CardDescription>Monthly cost trends with optimization potential</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            actual: {
              label: "Actual Cost",
              color: "hsl(var(--chart-1))",
            },
            projected: {
              label: "Projected",
              color: "hsl(var(--chart-2))",
            },
            optimized: {
              label: "With Optimization",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
              <Line type="monotone" dataKey="optimized" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
