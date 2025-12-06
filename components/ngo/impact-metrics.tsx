"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Zap, DollarSign } from "lucide-react"

export function ImpactMetrics() {
  const metrics = [
    {
      label: "People Impacted",
      value: "12,450",
      change: "+8.2%",
      icon: Users,
      description: "Students and staff benefiting from energy optimization",
    },
    {
      label: "Buildings Monitored",
      value: "3",
      change: "100%",
      icon: Building2,
      description: "Campus buildings with IoT sensor coverage",
    },
    {
      label: "Energy Saved",
      value: "2.4 MWh",
      change: "+15.3%",
      icon: Zap,
      description: "Total energy savings this month",
    },
    {
      label: "Cost Savings",
      value: "$3,240",
      change: "+12.8%",
      icon: DollarSign,
      description: "Monthly savings from optimization",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.label}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <Badge variant="outline" className="text-accent border-accent">
                  {metric.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl mb-1">{metric.value}</CardTitle>
              <p className="text-sm font-medium text-foreground mb-2">{metric.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{metric.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
