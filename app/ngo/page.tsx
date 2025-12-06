"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SDGProgress } from "@/components/ngo/sdg-progress"
import { CarbonFootprint } from "@/components/ngo/carbon-footprint"
import { ImpactMetrics } from "@/components/ngo/impact-metrics"
import { PolicyRecommendations } from "@/components/ngo/policy-recommendations"
import { ComparativeAnalysis } from "@/components/ngo/comparative-analysis"
import { Button } from "@/components/ui/button"
import { Download, Share2, FileText } from "lucide-react"

export default function NGOPage() {
  return (
        <ProtectedRoute>
    
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">NGO & Policy Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sustainability metrics, SDG tracking, and policy recommendations
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Impact Metrics */}
          <ImpactMetrics />

          {/* SDG Progress */}
          <SDGProgress />

          {/* Carbon Footprint */}
          <CarbonFootprint />

          {/* Comparative Analysis */}
          <ComparativeAnalysis />

          {/* Policy Recommendations */}
          <PolicyRecommendations />
        </div>
      </main>
    </div>
        </ProtectedRoute>
  )
}
