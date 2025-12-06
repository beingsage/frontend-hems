"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockDevices } from "@/lib/data"
import { Server, Wifi, Database, Cpu } from "lucide-react"

export function SystemDiagnostics() {
  const totalDevices = mockDevices.length
  const onlineDevices = mockDevices.filter((d) => d.status === "online").length
  const offlineDevices = mockDevices.filter((d) => d.status === "error").length
  const warningDevices = mockDevices.filter((d) => d.status === "warning").length

  const uptime = 99.7
  const dataIntegrity = 98.5
  const networkLatency = 12

  const diagnostics = [
    {
      label: "System Uptime",
      value: uptime,
      unit: "%",
      icon: Server,
      status: uptime > 99 ? "good" : uptime > 95 ? "warning" : "error",
    },
    {
      label: "Data Integrity",
      value: dataIntegrity,
      unit: "%",
      icon: Database,
      status: dataIntegrity > 98 ? "good" : dataIntegrity > 95 ? "warning" : "error",
    },
    {
      label: "Network Latency",
      value: networkLatency,
      unit: "ms",
      icon: Wifi,
      status: networkLatency < 20 ? "good" : networkLatency < 50 ? "warning" : "error",
    },
    {
      label: "CPU Usage",
      value: 45,
      unit: "%",
      icon: Cpu,
      status: 45 < 70 ? "good" : 45 < 85 ? "warning" : "error",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-accent"
      case "warning":
        return "text-chart-2"
      case "error":
        return "text-destructive"
      default:
        return "text-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Device Status Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-accent/10">
            <p className="text-2xl font-bold text-accent">{onlineDevices}</p>
            <p className="text-xs text-muted-foreground mt-1">Online</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-chart-2/10">
            <p className="text-2xl font-bold text-chart-2">{warningDevices}</p>
            <p className="text-xs text-muted-foreground mt-1">Warning</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-destructive/10">
            <p className="text-2xl font-bold text-destructive">{offlineDevices}</p>
            <p className="text-xs text-muted-foreground mt-1">Offline</p>
          </div>
        </div>

        {/* System Metrics */}
        <div className="space-y-4">
          {diagnostics.map((diagnostic) => {
            const Icon = diagnostic.icon
            return (
              <div key={diagnostic.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{diagnostic.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${getStatusColor(diagnostic.status)}`}>
                    {diagnostic.value}
                    {diagnostic.unit}
                  </span>
                </div>
                <Progress
                  value={diagnostic.unit === "ms" ? 100 - diagnostic.value : diagnostic.value}
                  className="h-2"
                />
              </div>
            )
          })}
        </div>

        {/* Connection Status */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Connection Status</span>
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              All Systems Operational
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
