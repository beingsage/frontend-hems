import { NextResponse } from "next/server"
import type { Device } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate a new device with some default values
    const newDevice: Device = {
      id: Math.random().toString(36).substring(7), // Simple ID generation
      name: body.name,
      type: body.type,
      status: "offline",
      location: {
        room: body.location.room,
        floor: parseInt(body.location.floor),
        building: body.location.building,
        position: { x: 0, y: 0, z: 0 }, // Default position
      },
      consumption: {
        current: 0,
        average: 0,
        peak: 0,
        level: "low",
      },
      health: 100,
      lastUpdate: new Date(),
      anomalyDetected: false,
      costPerHour: 0,
    }

    // In a real application, you would save this to a database
    // For now, we'll just return the new device
    return NextResponse.json(newDevice, { status: 201 })
  } catch (error) {
    console.error("Error adding device:", error)
    return NextResponse.json(
      { error: "Failed to add device" },
      { status: 500 }
    )
  }
}