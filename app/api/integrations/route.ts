import { NextResponse } from "next/server"
import { smartHome } from "@/lib/integrations/smart-home"
import { utilityAPI } from "@/lib/integrations/utility-api"
import { weatherAPI } from "@/lib/integrations/weather-api"

// Get integration data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const deviceId = searchParams.get("deviceId")

  try {
    let data

    switch (type) {
      case "smart-home":
        data = await smartHome.getDeviceStatus(deviceId)
        break
      case "utility":
        data = await utilityAPI.getBillingData(deviceId, "current")
        break
      case "weather":
        data = await weatherAPI.getCurrentConditions()
        break
      default:
        return NextResponse.json({ error: "Invalid integration type" }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching integration data:", error)
    return NextResponse.json(
      { error: "Failed to fetch integration data" },
      { status: 500 }
    )
  }
}

// Control smart home device
export async function POST(request: Request) {
  try {
    const { deviceId, command, parameters } = await request.json()

    const result = await smartHome.controlDevice(deviceId, command, parameters)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error controlling device:", error)
    return NextResponse.json(
      { error: "Failed to control device" },
      { status: 500 }
    )
  }
}

// Link new integration
export async function PUT(request: Request) {
  try {
    const { type, credentials } = await request.json()

    let result
    switch (type) {
      case "smart-home":
        result = await smartHome.connect(credentials)
        break
      case "utility":
        result = await utilityAPI.linkAccount(credentials)
        break
      case "weather":
        result = await weatherAPI.configure(credentials)
        break
      default:
        return NextResponse.json({ error: "Invalid integration type" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error linking integration:", error)
    return NextResponse.json(
      { error: "Failed to link integration" },
      { status: 500 }
    )
  }
}