"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { EnergyHeatmap } from "@/components/visualization/energy-heatmap"
import { SankeyDiagram } from "@/components/visualization/sankey-diagram"
import { ComparisonChart } from "@/components/visualization/comparison-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"

export default function VisualizationsPage() {
  // Feature 57: Hourly heatmap data
  const heatmapData = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => Math.random() * 5 + 1))

  const heatmapLabels = {
    x: Array.from({ length: 24 }, (_, i) => `${i}h`),
    y: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  }

  // Feature 58: Energy flow Sankey data
  const sankeyNodes = [
    { id: "grid", label: "Grid", value: 100 },
    { id: "solar", label: "Solar Panels", value: 30 },
    { id: "battery", label: "Battery", value: 15 },
    { id: "hvac", label: "HVAC", value: 45 },
    { id: "lighting", label: "Lighting", value: 25 },
    { id: "appliances", label: "Appliances", value: 40 },
    { id: "ev", label: "EV Charging", value: 35 },
  ]

  const sankeyLinks = [
    { source: "grid", target: "hvac", value: 30 },
    { source: "grid", target: "lighting", value: 15 },
    { source: "grid", target: "appliances", value: 25 },
    { source: "grid", target: "ev", value: 30 },
    { source: "solar", target: "hvac", value: 15 },
    { source: "solar", target: "lighting", value: 10 },
    { source: "solar", target: "appliances", value: 15 },
    { source: "battery", target: "appliances", value: 10 },
    { source: "battery", target: "ev", value: 5 },
  ]

  // Feature 59: Comparative analysis data
  const comparisonData = [
    { category: "HVAC", current: 450, previous: 520, target: 400 },
    { category: "Lighting", current: 180, previous: 200, target: 150 },
    { category: "Appliances", current: 320, previous: 310, target: 280 },
    { category: "EV Charging", current: 280, previous: 250, target: 300 },
  ]

  // Feature 60: Radar chart for efficiency metrics
  const efficiencyData = [
    { metric: "Energy Efficiency", value: 85, fullMark: 100 },
    { metric: "Cost Optimization", value: 78, fullMark: 100 },
    { metric: "Carbon Reduction", value: 92, fullMark: 100 },
    { metric: "Peak Shaving", value: 70, fullMark: 100 },
    { metric: "Load Balancing", value: 88, fullMark: 100 },
    { metric: "Renewable Usage", value: 65, fullMark: 100 },
  ]

  // Feature 61: Scatter plot for correlation analysis
  const scatterData = Array.from({ length: 50 }, () => ({
    temperature: Math.random() * 30 + 10,
    consumption: Math.random() * 4 + 1,
    efficiency: Math.random() * 100,
  }))

  return (
        <ProtectedRoute>
    
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Advanced Visualizations</h1>
            <p className="text-muted-foreground mt-2">Interactive charts and custom dashboards</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="heatmap" className="space-y-6">
          <TabsList>
            <TabsTrigger value="heatmap">Heatmaps</TabsTrigger>
            <TabsTrigger value="flow">Energy Flow</TabsTrigger>
            <TabsTrigger value="comparison">Comparisons</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="space-y-6">
            <EnergyHeatmap
              data={heatmapData}
              labels={heatmapLabels}
              title="Weekly Consumption Heatmap"
              description="Hourly energy consumption patterns throughout the week"
            />
          </TabsContent>

          <TabsContent value="flow" className="space-y-6">
            <SankeyDiagram
              nodes={sankeyNodes}
              links={sankeyLinks}
              title="Energy Flow Diagram"
              description="Visualize how energy flows from sources to consumption points"
            />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <ComparisonChart
              data={comparisonData}
              title="Period-over-Period Comparison"
              description="Compare current consumption against previous period and targets"
            />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Radar</CardTitle>
                  <CardDescription>Multi-dimensional performance analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={efficiencyData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Radar
                        name="Performance"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temperature vs Consumption</CardTitle>
                  <CardDescription>Correlation analysis between temperature and energy usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        type="number"
                        dataKey="temperature"
                        name="Temperature"
                        unit="°C"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis
                        type="number"
                        dataKey="consumption"
                        name="Consumption"
                        unit="kWh"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Scatter name="Data Points" data={scatterData} fill="hsl(var(--primary))">
                        {scatterData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.efficiency > 50 ? "hsl(var(--primary))" : "#ef4444"}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
        </ProtectedRoute>
  )
}
