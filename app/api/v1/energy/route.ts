import { type NextRequest, NextResponse } from "next/server"

// Feature 109: Public API endpoints
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const timeframe = searchParams.get("timeframe") || "day"
  const metric = searchParams.get("metric") || "consumption"

  // Validate API key
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "")
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Generate mock data
  const data = Array.from({ length: 24 }, (_, i) => ({
    timestamp: Date.now() - (24 - i) * 60 * 60 * 1000,
    value: Math.random() * 1000,
  }))

  return NextResponse.json({
    success: true,
    data: {
      timeframe,
      metric,
      values: data,
    },
    metadata: {
      timestamp: Date.now(),
      requestId: `req-${Date.now()}`,
      rateLimit: {
        remaining: 99,
        reset: Date.now() + 3600000,
      },
    },
  })
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "")
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  // Feature 110: Data ingestion endpoint
  console.log("[v0] Received energy data:", body)

  return NextResponse.json({
    success: true,
    message: "Data received successfully",
    metadata: {
      timestamp: Date.now(),
      requestId: `req-${Date.now()}`,
    },
  })
}
