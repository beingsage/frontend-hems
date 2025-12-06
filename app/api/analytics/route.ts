import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/backend/data-store"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "overview"

    const devices = dataStore.getAllDevices()
    const totalConsumption = dataStore.getTotalConsumption()
    const anomalousDevices = dataStore.getAnomalousDevices()

    let data: any = {}

    switch (type) {
      case "overview":
        data = {
          totalDevices: devices.length,
          activeDevices: devices.filter((d) => d.status === "online").length,
          totalConsumption,
          anomalyCount: anomalousDevices.length,
          averageConsumption: totalConsumption / devices.length,
          peakConsumption: Math.max(...devices.map((d) => d.currentConsumption)),
          estimatedCost: totalConsumption * 0.12, // $0.12 per kWh
          co2Emissions: totalConsumption * 0.5, // 0.5 kg CO2 per kWh
        }
        break

      case "by-building":
        const buildings = ["Main Building", "Lab Building", "Admin Building"]
        data = buildings.map((building) => {
          const buildingDevices = dataStore.getDevicesByBuilding(building)
          const consumption = buildingDevices.reduce((sum, d) => sum + d.currentConsumption, 0)
          return {
            building,
            deviceCount: buildingDevices.length,
            consumption,
            cost: consumption * 0.12,
          }
        })
        break

      case "by-type":
        const types = ["HVAC", "Lighting", "Computer", "Server", "Appliance"]
        data = types.map((deviceType) => {
          const typeDevices = dataStore.getDevicesByType(deviceType)
          const consumption = typeDevices.reduce((sum, d) => sum + d.currentConsumption, 0)
          return {
            type: deviceType,
            deviceCount: typeDevices.length,
            consumption,
            percentage: (consumption / totalConsumption) * 100,
          }
        })
        break

      case "time-series":
        // Generate hourly data for the last 24 hours
        const now = new Date()
        data = Array.from({ length: 24 }, (_, i) => {
          const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
          const baseConsumption = totalConsumption
          const variation = Math.sin((i / 24) * Math.PI * 2) * 0.3 * baseConsumption
          return {
            timestamp: hour.toISOString(),
            consumption: baseConsumption + variation,
            cost: (baseConsumption + variation) * 0.12,
          }
        })
        break

      default:
        return NextResponse.json({ success: false, error: "Invalid analytics type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
