"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockDevices } from "@/lib/data"
import { Activity } from "lucide-react"

export function DeviceHealthMatrix() {
  const healthRanges = [
    { label: "Excellent", min: 90, max: 100, color: "bg-accent" },
    { label: "Good", min: 75, max: 89, color: "bg-chart-4" },
    { label: "Fair", min: 60, max: 74, color: "bg-chart-2" },
    { label: "Poor", min: 0, max: 59, color: "bg-destructive" },
  ]

  const getDevicesByHealth = (min: number, max: number) => {
    return mockDevices.filter((d) => d.health >= min && d.health <= max)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Device Health Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthRanges.map((range) => {
          const devices = getDevicesByHealth(range.min, range.max)
          const percentage = (devices.length / mockDevices.length) * 100

          return (
            <div key={range.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${range.color}`} />
                  <span className="font-medium text-foreground">{range.label}</span>
                  <span className="text-muted-foreground">
                    ({range.min}-{range.max}%)
                  </span>
                </div>
                <span className="font-bold text-foreground">{devices.length} devices</span>
              </div>

              <div className="w-full bg-secondary rounded-full h-2">
                <div className={`h-2 rounded-full ${range.color}`} style={{ width: `${percentage}%` }} />
              </div>

              {devices.length > 0 && (
                <div className="text-xs text-muted-foreground pl-5">
                  {devices
                    .slice(0, 3)
                    .map((d) => d.name)
                    .join(", ")}
                  {devices.length > 3 && ` +${devices.length - 3} more`}
                </div>
              )}
            </div>
          )
        })}

        <div className="pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Average Health</span>
            <span className="font-bold text-foreground">
              {(mockDevices.reduce((sum, d) => sum + d.health, 0) / mockDevices.length).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
