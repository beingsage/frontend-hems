"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingDown, AlertTriangle, DollarSign, Activity, Leaf, ArrowRight, Box } from "lucide-react"
import Link from "next/link"
import { useRealtimeDevices } from "@/lib/hooks/use-realtime-devices"
import { useRealtimeAnalytics } from "@/lib/hooks/use-realtime-analytics"

export default function HomePage() {
  const { devices, loading: devicesLoading } = useRealtimeDevices()
  const { analytics, loading: analyticsLoading } = useRealtimeAnalytics()

  if (devicesLoading || analyticsLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading real-time data...</p>
          </div>
        </main>
      </div>
    )
  }

  const anomalies = devices?.filter((d) => d.anomaly) || []
  const totalDevices = devices?.length || 0
  const onlineDevices = devices?.filter((d) => d.status === "online").length || 0
  const totalConsumption = analytics?.totalConsumption || 0
  const totalCost = analytics?.totalCost || 0
  const totalCO2 = analytics?.totalCO2 || 0

  // Calculate SDG progress based on real data
  const sdg7Progress = Math.min(100, analytics?.efficiency || 0)
  const sdg13Progress = Math.min(100, 100 - (totalCO2 / 100) * 10)

  return (
        <ProtectedRoute>
    
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Energy Dashboard</h1>
              <p className="text-muted-foreground mt-1">Real-time monitoring and optimization for your smart campus</p>
            </div>
            <Link href="/energy-map">
              <Button className="gap-2">
                <Box className="h-4 w-4" />
                View 3D Map
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Consumption"
              value={`${(totalConsumption / 1000).toFixed(1)} kW`}
              change="-12% from last week"
              changeType="positive"
              icon={Zap}
            />
            <StatCard
              title="Cost per Day"
              value={`$${(totalCost * 24).toFixed(2)}`}
              change="+5% from yesterday"
              changeType="negative"
              icon={DollarSign}
            />
            <StatCard
              title="Active Devices"
              value={`${onlineDevices}/${totalDevices}`}
              description={`${anomalies.length} anomalies detected`}
              icon={Activity}
            />
            <StatCard
              title="CO₂ Emissions"
              value={`${(totalCO2 * 24).toFixed(1)} kg/day`}
              change="-8% this month"
              changeType="positive"
              icon={Leaf}
            />
          </div>

          {/* Alerts and Savings */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Active Alerts
                </CardTitle>
                <CardDescription>Devices requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {anomalies.slice(0, 3).map((device) => (
                  <Link key={device.id} href={`/devices/${device.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium text-foreground">{device.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {device.room} - {device.building}
                        </p>
                      </div>
                      <Badge variant="destructive">Anomaly</Badge>
                    </div>
                  </Link>
                ))}
                {anomalies.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No active alerts</p>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full gap-2">
                    View All Alerts
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-accent" />
                  Savings Potential
                </CardTitle>
                <CardDescription>Optimization opportunities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Potential Savings</span>
                    <span className="font-medium text-foreground">{(totalConsumption * 0.15).toFixed(0)} W</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost Reduction</span>
                    <span className="font-medium text-accent">${(totalCost * 24 * 30 * 0.15).toFixed(2)}/month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Affected Devices</span>
                    <span className="font-medium text-foreground">{Math.floor(totalDevices * 0.3)} devices</span>
                  </div>
                </div>
                <Link href="/assistant">
                  <Button className="w-full gap-2">
                    Get AI Recommendations
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* SDG Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Goals (SDG 7 & 13)</CardTitle>
              <CardDescription>Progress towards UN Sustainable Development Goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">SDG 7: Affordable and Clean Energy</span>
                  <span className="text-sm font-medium text-foreground">{sdg7Progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${sdg7Progress}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">SDG 13: Climate Action</span>
                  <span className="text-sm font-medium text-foreground">{sdg13Progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent transition-all" style={{ width: `${sdg13Progress}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-foreground">{(totalCO2 * 24 * 365).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">kg CO₂/year</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{onlineDevices}</p>
                  <p className="text-xs text-muted-foreground">Active Devices</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">${(totalCost * 24 * 30).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Monthly Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
        </ProtectedRoute>
  )
}
