import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/backend/data-store"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const device = dataStore.getDevice(params.id)

    if (!device) {
      return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 })
    }

    const readings = dataStore.getReadings(params.id, 100)

    return NextResponse.json({
      success: true,
      data: {
        device,
        readings,
        latestReading: readings[readings.length - 1],
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching device:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch device" }, { status: 500 })
  }
}
