import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingDown, Clock, Zap } from "lucide-react"
import type { Device } from "@/lib/data"

interface OptimizationSuggestionsProps {
  device: Device
}

export function OptimizationSuggestions({ device }: OptimizationSuggestionsProps) {
  const suggestions = [
    {
      id: "1",
      title: "Schedule Off-Peak Operation",
      description: `Shift ${device.name} operation to off-peak hours (10 PM - 6 AM) to reduce costs by 15-20%.`,
      impact: "High",
      savings: "$45/month",
      icon: Clock,
    },
    {
      id: "2",
      title: "Optimize Temperature Settings",
      description: "Adjust thermostat by 2°C during low-occupancy periods to save energy without affecting comfort.",
      impact: "Medium",
      savings: "$28/month",
      icon: TrendingDown,
    },
    {
      id: "3",
      title: "Enable Smart Power Management",
      description: "Activate automatic standby mode during idle periods to reduce phantom power consumption.",
      impact: "Low",
      savings: "$12/month",
      icon: Zap,
    },
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-chart-2" />
          Optimization Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon
          return (
            <div
              key={suggestion.id}
              className="p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-foreground">{suggestion.title}</h3>
                    <Badge variant={getImpactColor(suggestion.impact)}>{suggestion.impact}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{suggestion.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">Potential savings: {suggestion.savings}</span>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Potential Savings</span>
            <span className="font-bold text-accent">$85/month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
