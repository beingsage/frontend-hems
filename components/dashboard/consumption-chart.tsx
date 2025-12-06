"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  consumption: Math.floor(Math.random() * 3000) + 5000 + Math.sin(i / 3) * 2000,
  cost: 0,
})).map((d) => ({ ...d, cost: (d.consumption * 0.12) / 1000 }))

export function ConsumptionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>24-Hour Consumption</CardTitle>
        <CardDescription>Real-time energy usage and cost tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            consumption: {
              label: "Consumption (W)",
              color: "hsl(var(--chart-1))",
            },
            cost: {
              label: "Cost ($)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="hour" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="consumption"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorConsumption)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
