"use client"

import type { Device } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, MapPin, Activity, Zap, DollarSign, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DeviceInfoPanelProps {
  device: Device | null
  onClose: () => void
}

export function DeviceInfoPanel({ device, onClose }: DeviceInfoPanelProps) {
  if (!device) return null

  const statusColor = {
    online: "bg-accent",
    offline: "bg-muted",
    warning: "bg-chart-2",
    error: "bg-destructive",
  }[device.status]

  const levelColor = {
    high: "text-destructive",
    medium: "text-chart-2",
    low: "text-accent",
  }[device.consumption.level]

  return (
    <Card className="absolute top-4 right-4 w-96 shadow-xl z-10">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex-1">
          <CardTitle className="text-lg">{device.name}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={statusColor}>{device.status}</Badge>
            {device.anomalyDetected && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Anomaly
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Location</p>
            <p className="text-sm text-muted-foreground">
              {device.location.room}, Floor {device.location.floor}
            </p>
            <p className="text-sm text-muted-foreground">{device.location.building}</p>
          </div>
        </div>

        {/* Consumption */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Current Consumption</span>
            </div>
            <span className={`text-sm font-bold ${levelColor}`}>{device.consumption.current}W</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Average</p>
              <p className="font-medium text-foreground">{device.consumption.average}W</p>
            </div>
            <div>
              <p className="text-muted-foreground">Peak</p>
              <p className="font-medium text-foreground">{device.consumption.peak}W</p>
            </div>
          </div>
        </div>

        {/* Cost */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Cost per Hour</span>
          </div>
          <span className="text-sm font-bold text-foreground">${device.costPerHour.toFixed(3)}</span>
        </div>

        {/* Health */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Device Health</span>
            </div>
            <span className="text-sm font-bold text-foreground">{device.health}%</span>
          </div>
          <Progress value={device.health} className="h-2" />
        </div>

        {/* Daily Cost Estimate */}
        <div className="pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Cost</span>
            <span className="font-medium text-foreground">${(device.costPerHour * 24).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Monthly Cost</span>
            <span className="font-medium text-foreground">${(device.costPerHour * 24 * 30).toFixed(2)}</span>
          </div>
        </div>

        <Button className="w-full bg-transparent" variant="outline">
          View Detailed Analytics
        </Button>
      </CardContent>
    </Card>
  )
}
