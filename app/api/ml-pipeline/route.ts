import { NextResponse } from "next/server"
import { streamProcessor } from "@/lib/data-pipeline/stream-processor"
import { timeSeriesDB } from "@/lib/data-pipeline/time-series-db"
import { anomalyDetector } from "@/lib/ml/anomaly-detector"
import { optimizationEngine } from "@/lib/ml/optimization-engine"
import { patternRecognition } from "@/lib/ml/pattern-recognition"

// Get ML insights and recommendations
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const deviceId = searchParams.get("deviceId")
  const timeRange = searchParams.get("timeRange") || "24h"

  try {
    // Get time series data
    const timeSeriesData = await timeSeriesDB.query({
      deviceId,
      timeRange,
    })

    // Process real-time data stream
    const streamData = await streamProcessor.getLatestData(deviceId)

    // Run ML analysis
    const [anomalies, patterns, optimizations] = await Promise.all([
      anomalyDetector.detect(timeSeriesData),
      patternRecognition.analyze(timeSeriesData),
      optimizationEngine.generateRecommendations(deviceId),
    ])

    return NextResponse.json({
      timeSeriesData,
      streamData,
      insights: {
        anomalies,
        patterns,
        optimizations,
      },
    })
  } catch (error) {
    console.error("Error processing ML insights:", error)
    return NextResponse.json(
      { error: "Failed to process ML insights" },
      { status: 500 }
    )
  }
}

// Process new data point
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Process and store the data point
    await streamProcessor.process(data)
    await timeSeriesDB.insert(data)

    // Run real-time ML analysis
    const anomalies = await anomalyDetector.analyzeDataPoint(data)
    
    return NextResponse.json({
      success: true,
      anomalies,
    })
  } catch (error) {
    console.error("Error processing data point:", error)
    return NextResponse.json(
      { error: "Failed to process data point" },
      { status: 500 }
    )
  }
}