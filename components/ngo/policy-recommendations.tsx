"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink } from "lucide-react"

export function PolicyRecommendations() {
  const recommendations = [
    {
      id: "1",
      title: "Implement Dynamic Pricing for Peak Hours",
      priority: "high",
      impact: "High",
      category: "Economic",
      description:
        "Introduce time-of-use pricing to incentivize energy consumption during off-peak hours, reducing strain on the grid.",
      status: "proposed",
    },
    {
      id: "2",
      title: "Mandate Energy Audits for Public Buildings",
      priority: "high",
      impact: "High",
      category: "Regulatory",
      description:
        "Require annual energy audits for all public institutions to identify inefficiencies and track improvement.",
      status: "under-review",
    },
    {
      id: "3",
      title: "Expand Renewable Energy Incentives",
      priority: "medium",
      impact: "Medium",
      category: "Environmental",
      description:
        "Increase tax credits and subsidies for institutions adopting solar, wind, and other renewable energy sources.",
      status: "proposed",
    },
    {
      id: "4",
      title: "Establish Energy Efficiency Standards",
      priority: "medium",
      impact: "High",
      category: "Regulatory",
      description:
        "Set minimum efficiency requirements for HVAC systems, lighting, and appliances in educational institutions.",
      status: "draft",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "proposed":
        return "bg-chart-1/10 text-chart-1 border-chart-1"
      case "under-review":
        return "bg-chart-2/10 text-chart-2 border-chart-2"
      case "draft":
        return "bg-muted text-muted-foreground border-muted"
      default:
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Policy Recommendations
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">{rec.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                  <Badge variant="outline">{rec.category}</Badge>
                  <Badge variant="outline">{rec.impact} Impact</Badge>
                  <Badge className={getStatusColor(rec.status)}>{rec.status}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
