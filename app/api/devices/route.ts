import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/backend/data-store"
import { auditLogger } from "@/lib/security/audit-logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const building = searchParams.get("building")
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    let devices = dataStore.getAllDevices()

    // Apply filters
    if (building) {
      devices = devices.filter((d) => d.building === building)
    }
    if (type) {
      devices = devices.filter((d) => d.type === type)
    }
    if (status) {
      devices = devices.filter((d) => d.status === status)
    }

    // Log access
    auditLogger.logAction({
      userId: "user_1",
      userName: "Admin User",
      action: "GET /api/devices",
      resource: "devices",
      details: `Retrieved ${devices.length} devices`,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      status: "success",
      severity: "low",
    })

    return NextResponse.json({
      success: true,
      data: devices,
      count: devices.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching devices:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch devices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, action, value } = body

    let result

    switch (action) {
      case "toggle":
        result = dataStore.toggleDevice(deviceId)
        break
      case "update":
        result = dataStore.updateDevice(deviceId, value)
        break
      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    if (!result) {
      return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 })
    }

    // Log action
    auditLogger.logAction({
      userId: "user_1",
      userName: "Admin User",
      action: `POST /api/devices - ${action}`,
      resource: `device:${deviceId}`,
      details: JSON.stringify(value || {}),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      status: "success",
      severity: "medium",
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[v0] Error updating device:", error)
    return NextResponse.json({ success: false, error: "Failed to update device" }, { status: 500 })
  }
}
