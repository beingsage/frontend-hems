"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Lightbulb, AlertCircle, DollarSign } from "lucide-react"

export default function MLInsightsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])

  const fetchMlPipeline = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ml-pipeline')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()

      // Support two shapes: { data: {...} } or direct payload
      const payload = json?.data ?? json

      // Predictions may be provided by the API or fallback to sensible defaults
      setPredictions(
        payload?.predictions ?? [
          { metric: "Next Month Bill", value: "$245", change: -8, confidence: 89 },
          { metric: "Peak Demand Day", value: "Friday", change: 0, confidence: 92 },
          { metric: "Maintenance Alert", value: "12 days", change: 0, confidence: 85 },
          { metric: "Savings Potential", value: "$67", change: 15, confidence: 91 },
        ]
      )

      // API insights can be nested under payload.insights (patterns, anomalies, optimizations)
      const apiInsights = payload?.insights
      const patterns = apiInsights?.patterns ?? []
      const anomalies = apiInsights?.anomalies ?? []
      setInsights([...patterns, ...anomalies].length > 0 ? [...patterns, ...anomalies] : (
        payload?.insights ?? [
          {
            id: "1",
            type: "pattern",
            title: "Unusual Evening Consumption Detected",
            description: "Your energy usage between 8-10 PM has increased by 35% over the past week",
            severity: "medium",
            confidence: 92,
            action: "Review devices active during this period",
          },
          {
            id: "2",
            type: "anomaly",
            title: "HVAC System Efficiency Drop",
            description: "HVAC efficiency decreased from 88% to 76% in the last 3 days",
            severity: "high",
            confidence: 87,
            action: "Schedule maintenance inspection",
          },
        ]
      ))

      // Recommendations / optimizations
      setRecommendations(apiInsights?.optimizations ?? payload?.recommendations ?? [
        {
          id: "rec-1",
          title: "Install Smart Thermostat",
          category: "equipment",
          savings: 180,
          cost: 250,
          roi: 16,
          difficulty: "medium",
          priority: 9,
          impact: "high",
        },
        {
          id: "rec-2",
          title: "Upgrade to LED Lighting",
          category: "equipment",
          savings: 120,
          cost: 150,
          roi: 15,
          difficulty: "easy",
          priority: 8,
          impact: "medium",
        },
      ])
    } catch (err: any) {
      console.error("Error fetching ML pipeline:", err)
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    if (mounted) fetchMlPipeline()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading ML insights...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-red-500">Failed to load ML insights</div>
            <div className="text-sm text-muted-foreground">{error}</div>
            <div className="pt-4">
              <Button onClick={fetchMlPipeline}>Retry</Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">ML Insights & Predictions</h1>
            </div>
            <p className="text-muted-foreground">AI-powered analytics and optimization recommendations</p>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-8">
            {predictions.map((pred) => (
              <Card key={pred.metric ?? pred.metricName ?? JSON.stringify(pred)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{pred.metric ?? pred.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pred.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {pred.change !== 0 && pred.change !== undefined && (
                      <Badge variant={pred.change > 0 ? "default" : "secondary"} className="text-xs">
                        {pred.change > 0 ? "+" : ""}
                        {pred.change}%
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{pred.confidence}% confidence</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="insights" className="space-y-6">
            <TabsList>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id ?? insight.title}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            insight.severity === "high"
                              ? "bg-red-500/10"
                              : insight.severity === "medium"
                                ? "bg-yellow-500/10"
                                : "bg-green-500/10"
                          }`}
                        >
                          <AlertCircle
                            className={`h-5 w-5 ${
                              insight.severity === "high"
                                ? "text-red-500"
                                : insight.severity === "medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }`}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <CardDescription className="mt-1">{insight.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{insight.confidence}% confident</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lightbulb className="h-4 w-4" />
                        <span>{insight.action}</span>
                      </div>
                      <Button size="sm">Take Action</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid gap-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:border-primary transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{rec.title}</CardTitle>
                            <Badge variant={rec.impact === "high" ? "default" : "secondary"}>{rec.impact} impact</Badge>
                          </div>
                          <CardDescription className="capitalize">
                            {rec.category} • {rec.difficulty} difficulty
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-500">${rec.savings}/yr</div>
                          <div className="text-xs text-muted-foreground">
                            {rec.roi === Number.POSITIVE_INFINITY ? "Free" : `${rec.roi} month ROI`}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Cost: ${rec.cost}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Priority: {rec.priority}/10</span>
                          </div>
                        </div>
                        <Button>View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Usage Pattern</CardTitle>
                    <CardDescription>Detected consumption patterns throughout the day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Morning Peak (6-9 AM)</span>
                          <Badge>High Confidence</Badge>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "75%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Evening Peak (6-10 PM)</span>
                          <Badge>High Confidence</Badge>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "90%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Night Low (11 PM-5 AM)</span>
                          <Badge variant="secondary">Medium Confidence</Badge>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-secondary" style={{ width: "65%" }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Trends</CardTitle>
                    <CardDescription>Consumption patterns across the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                        const usage = [85, 88, 82, 90, 95, 70, 65][index]
                        return (
                          <div key={day} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-12">{day}</span>
                            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-primary transition-all" style={{ width: `${usage}%` }} />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">{usage}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
