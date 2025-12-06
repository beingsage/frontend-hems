import { NextResponse } from "next/server"
import { getIoTSimulator } from "@/lib/backend/iot-simulator"
import { dataPipeline } from "@/lib/backend/data-pipeline"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const simulator = getIoTSimulator()
    const device = simulator.getDevice(params.id)

    if (!device) {
      return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 })
    }

    const processedData = await dataPipeline.processDeviceData(params.id)
    const history = simulator.getConsumptionHistory(params.id, 24)

    return NextResponse.json({
      success: true,
      data: {
        device,
        processed: processedData,
        history,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching device:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch device" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const simulator = getIoTSimulator()
    const updates = await request.json()

    const updatedDevice = simulator.updateDevice(params.id, updates)

    if (!updatedDevice) {
      return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 })
    }

    console.log("[v0] Device updated:", params.id, updates)

    return NextResponse.json({
      success: true,
      data: updatedDevice,
    })
  } catch (error) {
    console.error("[v0] Error updating device:", error)
    return NextResponse.json({ success: false, error: "Failed to update device" }, { status: 500 })
  }
}
