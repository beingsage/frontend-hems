"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { getTotalConsumptionByType } from "@/lib/data"

export function DeviceTypeBreakdown() {
  const data = getTotalConsumptionByType()

  const chartData = Object.entries(data).map(([type, value]) => ({
    type: type.toUpperCase(),
    consumption: value,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumption by Device Type</CardTitle>
        <CardDescription>Energy usage breakdown across device categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            consumption: {
              label: "Consumption (W)",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="type" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="consumption" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
