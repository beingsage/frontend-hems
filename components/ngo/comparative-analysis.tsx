"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

const comparisonData = [
  { institution: "Our Campus", consumption: 8500, efficiency: 78, cost: 2800 },
  { institution: "State Average", consumption: 12000, efficiency: 62, cost: 4200 },
  { institution: "National Average", consumption: 14500, efficiency: 58, cost: 5100 },
  { institution: "Best Practice", consumption: 6500, efficiency: 92, cost: 2100 },
]

export function ComparativeAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparative Performance Analysis</CardTitle>
        <CardDescription>Benchmarking against regional and national standards</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            consumption: {
              label: "Consumption (kWh)",
              color: "hsl(var(--chart-1))",
            },
            efficiency: {
              label: "Efficiency Score",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="institution" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="consumption" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="efficiency" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-accent/10">
            <p className="text-xs text-muted-foreground mb-1">vs State Average</p>
            <p className="text-lg font-bold text-accent">-29% consumption</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-accent/10">
            <p className="text-xs text-muted-foreground mb-1">vs National Average</p>
            <p className="text-lg font-bold text-accent">-41% consumption</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground mb-1">Gap to Best Practice</p>
            <p className="text-lg font-bold text-foreground">+31% to optimize</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
