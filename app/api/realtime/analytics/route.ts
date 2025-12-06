import { NextResponse } from "next/server"
import { dataPipeline } from "@/lib/backend/data-pipeline"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const analytics = await dataPipeline.getAggregatedAnalytics()
    const trends = await dataPipeline.getConsumptionTrends(24)

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        trends,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
