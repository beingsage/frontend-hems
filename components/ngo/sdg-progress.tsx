"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getSDGMetrics } from "@/lib/data"
import { Target, TrendingUp, Leaf } from "lucide-react"

export function SDGProgress() {
  const metrics = getSDGMetrics()

  const sdgGoals = [
    {
      number: 7,
      title: "Affordable and Clean Energy",
      progress: metrics.sdg7Progress,
      icon: Target,
      targets: [
        { label: "Renewable Energy Share", value: "45%", target: "60%" },
        { label: "Energy Efficiency Improvement", value: "28%", target: "40%" },
        { label: "Clean Energy Access", value: "92%", target: "100%" },
      ],
    },
    {
      number: 13,
      title: "Climate Action",
      progress: metrics.sdg13Progress,
      icon: Leaf,
      targets: [
        { label: "CO₂ Reduction", value: "32%", target: "50%" },
        { label: "Climate Resilience", value: "68%", target: "80%" },
        { label: "Green Infrastructure", value: "55%", target: "75%" },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {sdgGoals.map((goal) => {
        const Icon = goal.icon
        return (
          <Card key={goal.number}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">SDG {goal.number}</CardTitle>
                      <Badge variant="outline">{goal.progress}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{goal.title}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-bold text-foreground">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-3" />
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-foreground">Key Targets:</p>
                {goal.targets.map((target, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{target.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{target.value}</span>
                      <span className="text-xs text-muted-foreground">/ {target.target}</span>
                      <TrendingUp className="h-3 w-3 text-accent" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
