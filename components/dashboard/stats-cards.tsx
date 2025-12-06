"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockDevices, calculateSavingsPotential, getSDGMetrics } from "@/lib/data"
import { Zap, DollarSign, TrendingDown, Leaf } from "lucide-react"

export function StatsCards() {
  const totalConsumption = mockDevices.reduce((sum, device) => sum + device.consumption.current, 0)
  const totalCost = mockDevices.reduce((sum, device) => sum + device.costPerHour, 0)
  const savings = calculateSavingsPotential()
  const sdg = getSDGMetrics()

  const stats = [
    {
      label: "Total Consumption",
      value: `${totalConsumption.toFixed(0)}W`,
      change: "+5.2%",
      changeType: "negative" as const,
      icon: Zap,
      subtext: `${mockDevices.length} active devices`,
    },
    {
      label: "Current Cost",
      value: `$${totalCost.toFixed(2)}/hr`,
      change: "+3.8%",
      changeType: "negative" as const,
      icon: DollarSign,
      subtext: `$${(totalCost * 24 * 30).toFixed(0)}/month projected`,
    },
    {
      label: "Savings Potential",
      value: `${savings.potentialSavingsWatts.toFixed(0)}W`,
      change: `$${(savings.potentialSavingsCost * 24 * 30).toFixed(0)}/mo`,
      changeType: "positive" as const,
      icon: TrendingDown,
      subtext: `${savings.affectedDevices} devices to optimize`,
    },
    {
      label: "CO₂ Emissions",
      value: `${sdg.co2EmissionsPerDay.toFixed(1)} kg/day`,
      change: "-8.5%",
      changeType: "positive" as const,
      icon: Leaf,
      subtext: `${sdg.co2EmissionsPerYear.toFixed(0)} kg/year projected`,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <Badge variant={stat.changeType === "positive" ? "outline" : "secondary"} className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-foreground mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.subtext}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
