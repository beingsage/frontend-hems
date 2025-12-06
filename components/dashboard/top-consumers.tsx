"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockDevices } from "@/lib/data"
import { MapPin, TrendingUp } from "lucide-react"

export function TopConsumers() {
  const topDevices = mockDevices.sort((a, b) => b.consumption.current - a.consumption.current).slice(0, 5)

  const maxConsumption = topDevices[0].consumption.current

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Energy Consumers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topDevices.map((device, index) => (
          <div key={device.id} className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    {index + 1}. {device.name}
                  </span>
                  <Badge
                    variant={device.consumption.level === "high" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {device.consumption.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {device.location.room}, {device.location.building}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-foreground">{device.consumption.current}W</p>
                <p className="text-xs text-muted-foreground">${device.costPerHour.toFixed(2)}/hr</p>
              </div>
            </div>
            <Progress value={(device.consumption.current / maxConsumption) * 100} className="h-2" />
          </div>
        ))}

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Combined consumption</span>
            <span className="font-bold text-foreground">
              {topDevices.reduce((sum, d) => sum + d.consumption.current, 0)}W
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Represents 68% of total campus consumption</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
