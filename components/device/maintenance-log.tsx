"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Calendar, User, Plus } from "lucide-react"

export function MaintenanceLog() {
  const logs = [
    {
      id: "1",
      date: "2025-04-02",
      type: "Preventive",
      technician: "John Smith",
      description: "Routine inspection and filter cleaning",
      status: "completed",
    },
    {
      id: "2",
      date: "2025-03-15",
      type: "Repair",
      technician: "Sarah Johnson",
      description: "Replaced faulty temperature sensor",
      status: "completed",
    },
    {
      id: "3",
      date: "2025-02-28",
      type: "Preventive",
      technician: "Mike Davis",
      description: "Quarterly maintenance check",
      status: "completed",
    },
    {
      id: "4",
      date: "2025-04-10",
      type: "Scheduled",
      technician: "TBD",
      description: "Upcoming quarterly inspection",
      status: "scheduled",
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Repair":
        return "destructive"
      case "Preventive":
        return "secondary"
      case "Scheduled":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Log
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="p-4 rounded-lg border border-border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant={getTypeColor(log.type)}>{log.type}</Badge>
                <Badge variant={log.status === "completed" ? "outline" : "secondary"}>{log.status}</Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{log.date}</span>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground mb-2">{log.description}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>Technician: {log.technician}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
