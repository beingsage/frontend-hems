"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { getSDGMetrics } from "@/lib/data"
import { Leaf, TrendingDown } from "lucide-react"

const monthlyData = [
  { month: "Jan", emissions: 2800, offset: 1200 },
  { month: "Feb", emissions: 2600, offset: 1300 },
  { month: "Mar", emissions: 2400, offset: 1400 },
  { month: "Apr", emissions: 2200, offset: 1500 },
  { month: "May", emissions: 2100, offset: 1600 },
  { month: "Jun", emissions: 1900, offset: 1700 },
]

export function CarbonFootprint() {
  const metrics = getSDGMetrics()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-accent" />
              Carbon Footprint Analysis
            </CardTitle>
            <CardDescription>Monthly CO₂ emissions and offset tracking</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{metrics.co2EmissionsPerDay.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">kg CO₂/day</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer
          config={{
            emissions: {
              label: "Emissions (kg CO₂)",
              color: "hsl(var(--chart-1))",
            },
            offset: {
              label: "Carbon Offset (kg CO₂)",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="emissions"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorEmissions)"
              />
              <Area
                type="monotone"
                dataKey="offset"
                stroke="hsl(var(--chart-4))"
                fillOpacity={1}
                fill="url(#colorOffset)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground mb-1">Annual Emissions</p>
            <p className="text-lg font-bold text-foreground">{metrics.co2EmissionsPerYear.toFixed(0)} kg</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground mb-1">Trees to Offset</p>
            <p className="text-lg font-bold text-foreground">{Math.ceil(metrics.co2EmissionsPerYear / 411)}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-accent/10">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingDown className="h-3 w-3 text-accent" />
              <p className="text-xs text-muted-foreground">Reduction</p>
            </div>
            <p className="text-lg font-bold text-accent">32%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
