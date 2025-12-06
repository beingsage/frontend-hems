import { Card, CardContent } from "@/components/ui/card"
import type { Device } from "@/lib/data"
import { Zap, DollarSign, TrendingUp, Clock } from "lucide-react"

interface DeviceStatsProps {
  device: Device
}

export function DeviceStats({ device }: DeviceStatsProps) {
  const dailyCost = (device?.costPerHour || 0) * 24
  const monthlyCost = dailyCost * 30
  const yearlyConsumption = ((device?.consumption?.average || 0) * 24 * 365) / 1000 // kWh

  const stats = [
    {
      label: "Current Consumption",
      value: `${device?.consumption?.current || 0}W`,
      subtext: `Peak: ${device?.consumption?.peak || 0}W`,
      icon: Zap,
      color: "text-chart-1",
    },
    {
      label: "Cost per Hour",
      value: `$${(device?.costPerHour || 0).toFixed(3)}`,
      subtext: `Monthly: $${monthlyCost.toFixed(2)}`,
      icon: DollarSign,
      color: "text-chart-2",
    },
    {
      label: "Average Consumption",
      value: `${device?.consumption?.average || 0}W`,
      subtext: `Level: ${device?.consumption?.level || 'N/A'}`,
      icon: TrendingUp,
      color: "text-chart-3",
    },
    {
      label: "Yearly Consumption",
      value: `${yearlyConsumption.toFixed(0)} kWh`,
      subtext: `${(yearlyConsumption * 0.12).toFixed(0)} USD/year`,
      icon: Clock,
      color: "text-chart-4",
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
                <Icon className={`h-5 w-5 ${stat.color}`} />
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
