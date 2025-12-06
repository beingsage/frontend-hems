"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react"
import { getDevicesWithAnomalies } from "@/lib/data"

export function AlertsPanel() {
  const anomalies = getDevicesWithAnomalies()

  const alerts = [
    {
      id: "1",
      type: "error" as const,
      title: "Device Offline",
      message: `${anomalies.filter((d) => d.status === "error").length} devices are currently offline`,
      time: "5 min ago",
    },
    {
      id: "2",
      type: "warning" as const,
      title: "Unusual Consumption Pattern",
      message: `${anomalies.filter((d) => d.status === "warning").length} devices showing anomalies`,
      time: "15 min ago",
    },
    {
      id: "3",
      type: "info" as const,
      title: "Peak Hours Approaching",
      message: "Consider reducing non-essential loads between 2-6 PM",
      time: "1 hour ago",
    },
  ]

  const getIcon = (type: "error" | "warning" | "info") => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-chart-2" />
      case "info":
        return <Info className="h-4 w-4 text-primary" />
    }
  }

  const getBadgeVariant = (type: "error" | "warning" | "info") => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Alerts</CardTitle>
          <Badge variant="destructive">{alerts.filter((a) => a.type === "error").length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <div className="mt-0.5">{getIcon(alert.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-foreground">{alert.title}</p>
                <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
                  {alert.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground">{alert.time}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
}
