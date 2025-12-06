"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getDevicesWithAnomalies } from "@/lib/data"
import { Wrench, Clock, MapPin } from "lucide-react"
import { useState } from "react"

export function MaintenanceQueue() {
  const devices = getDevicesWithAnomalies()
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const getPriority = (device: (typeof devices)[0]) => {
    if (device.status === "error") return "high"
    if (device.health < 60) return "high"
    if (device.health < 80) return "medium"
    return "low"
  }

  const sortedDevices = [...devices].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return (
      priorityOrder[getPriority(a) as keyof typeof priorityOrder] -
      priorityOrder[getPriority(b) as keyof typeof priorityOrder]
    )
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Queue
          </CardTitle>
          <Badge variant="destructive">{devices.length - completed.size}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedDevices.map((device) => {
          const priority = getPriority(device)
          const isCompleted = completed.has(device.id)

          return (
            <div
              key={device.id}
              className={`flex items-start gap-3 p-3 rounded-lg border border-border ${isCompleted ? "opacity-50" : ""}`}
            >
              <Checkbox checked={isCompleted} onCheckedChange={() => toggleComplete(device.id)} className="mt-1" />

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-semibold text-sm ${isCompleted ? "line-through" : ""}`}>{device.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {device.location.room}, {device.location.building}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={priority === "high" ? "destructive" : priority === "medium" ? "secondary" : "outline"}
                  >
                    {priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Health: {device.health}%</span>
                  </div>
                  <span>Status: {device.status}</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {device.status === "error"
                    ? "Device offline - requires immediate inspection"
                    : device.health < 60
                      ? "Critical health - schedule replacement"
                      : "Preventive maintenance recommended"}
                </p>
              </div>
            </div>
          )
        })}

        {sortedDevices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No maintenance tasks pending</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
