import { NextResponse } from "next/server"
import { getIoTSimulator } from "@/lib/backend/iot-simulator"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const simulator = getIoTSimulator()
    const devices = simulator.getAllDevices()

    return NextResponse.json({
      success: true,
      data: devices,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error fetching devices:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch devices" }, { status: 500 })
  }
}
