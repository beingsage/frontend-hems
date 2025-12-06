"use client"

import { useState } from "react"
import type { ApplianceData } from "@/lib/types/analytics"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  RefreshCw,
  Brain,
  Zap,
  DollarSign,
  Lightbulb,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useEnhancedAnalytics } from "@/lib/hooks/use-enhanced-analytics"
import { Progress } from "@/components/ui/progress"

export default function EnhancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("24h")
  const [selectedDevice, setSelectedDevice] = useState("all")
  const [selectedTab, setSelectedTab] = useState("overview")
  const { data, loading } = useEnhancedAnalytics(timeRange, selectedDevice)

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </main>
      </div>
    )
  }

  // Feature 29: Energy flow analysis
  const energyFlow = [
    { source: "Grid", value: 75 },
    { source: "Solar", value: 15 },
    { source: "Battery", value: 10 },
  ]

    // Feature 30: Appliance-level breakdown
  const applianceBreakdown = data?.applianceBreakdown ?? [
    { name: "No Data", consumption: 0, cost: 0, efficiency: 0 }
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Advanced Analytics</h1>
              <p className="text-muted-foreground mt-2">Deep insights into your energy consumption patterns</p>
            </div>
            <div className="flex gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

        <Tabs defaultValue="realtime" className="space-y-6">
          <TabsList>
            <TabsTrigger value="realtime">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="load">Load Analysis</TabsTrigger>
            <TabsTrigger value="quality">Power Quality</TabsTrigger>
            <TabsTrigger value="appliances">Appliance Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              {(() => {
                const latestData = data?.timeSeriesData?.[data?.timeSeriesData?.length - 1]
                const firstData = data?.timeSeriesData?.[0]
                
                const currentPower = parseFloat(latestData?.power || "0")
                const initialPower = parseFloat(firstData?.power || "1")
                const powerTrend = ((currentPower / initialPower) - 1) * 100
                
                const metrics = [
                  {
                    title: "Real-time Power",
                    value: `${(currentPower / 1000).toFixed(2)} kW`,
                    trend: powerTrend.toFixed(1),
                    status: "from avg",
                    showTrend: true
                  },
                  {
                    title: "Voltage",
                    value: `${parseFloat(latestData?.voltage || "0").toFixed(1)} V`,
                    status: parseFloat(latestData?.voltage || "0") > 215 && parseFloat(latestData?.voltage || "0") < 235 
                      ? "Within normal range" 
                      : "Out of range"
                  },
                  {
                    title: "Current",
                    value: `${parseFloat(latestData?.current || "0").toFixed(1)} A`,
                    status: parseFloat(latestData?.current || "0") > 0 ? "Stable" : "No load"
                  },
                  {
                    title: "Frequency",
                    value: `${parseFloat(latestData?.frequency || "0").toFixed(1)} Hz`,
                    status: Math.abs(parseFloat(latestData?.frequency || "0") - 50) < 0.5 ? "Optimal" : "Check"
                  }
                ]

                return metrics.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{item.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.showTrend ? (
                          <>
                            {powerTrend > 0 ? (
                              <TrendingUp className="inline h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="inline h-3 w-3 text-red-500" />
                            )}
                            {` ${Math.abs(powerTrend).toFixed(1)}% ${item.status}`}
                          </>
                        ) : item.status}
                      </p>
                    </CardContent>
                  </Card>
                ))
              })()}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Parameter Monitoring</CardTitle>
                <CardDescription>Real-time electrical parameters over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={data?.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(val) => new Date(val).toLocaleTimeString()} 
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="power"
                      stroke="hsl(var(--primary))"
                      name="Power (kW)"
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="voltage" stroke="#10b981" name="Voltage (V)" strokeWidth={2} />
                    <Line type="monotone" dataKey="current" stroke="#f59e0b" name="Current (A)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="load" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Load Profile Analysis</CardTitle>
                <CardDescription>Base load, peak load, and average consumption patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={data?.loadProfiles}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="hsl(var(--muted-foreground)"
                      tickFormatter={(val) => new Date(val).toLocaleTimeString()}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="peakLoad"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Peak Load"
                    />
                    <Area
                      type="monotone"
                      dataKey="avgLoad"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                      name="Avg Load"
                    />
                    <Area
                      type="monotone"
                      dataKey="baseLoad"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Base Load"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Voltage Quality",
                  metricName: "voltageQuality",
                  threshold: 5,
                  unit: "%"
                },
                {
                  title: "Current Quality",
                  metricName: "currentQuality",
                  threshold: 10,
                  unit: "%"
                },
                {
                  title: "THD",
                  metricName: "thd",
                  threshold: 3,
                  unit: "%"
                },
                {
                  title: "Power Factor",
                  metricName: "powerFactor",
                  threshold: 0.9,
                  unit: ""
                }
              ].map((item, index) => {
                const metric = data?.powerQualityData?.find(m => m.metric === item.metricName)
                const value = metric ? metric.value : 0
                const status = value < item.threshold ? "normal" : "warning"
                
                return (
                  <Card key={`quality-metric-${index}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {value.toFixed(2)}{item.unit}
                      </div>
                      <div className="mt-4">
                        <Progress 
                          value={(value / item.threshold) * 100} 
                          className={status === "normal" ? "bg-green-500" : "bg-yellow-500"}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Threshold: {item.threshold}{item.unit}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
              </div>
            </TabsContent>

            <TabsContent value="appliances" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appliance-Level Consumption</CardTitle>
                  <CardDescription>Detailed breakdown by appliance type with efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applianceBreakdown.map((appliance: { name: string; consumption: number; cost: number; efficiency: number }) => (
                      <div key={appliance.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{appliance.name}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">{appliance.consumption}%</span>
                            <span className="text-muted-foreground">${appliance.cost}</span>
                            <span
                              className={
                                appliance.efficiency >= 90
                                  ? "text-green-500"
                                  : appliance.efficiency >= 85
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }
                            >
                              {appliance.efficiency}% efficient
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${appliance.consumption}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}