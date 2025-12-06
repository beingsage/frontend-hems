import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/backend/data-store"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Simple rule-based responses (can be enhanced with AI SDK)
    let response = ""

    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("consumption") || lowerMessage.includes("using")) {
      const total = dataStore.getTotalConsumption()
      response = `Currently, your total energy consumption is ${total.toFixed(2)} kW. The main consumers are HVAC systems (45%), lighting (25%), and computers (20%).`
    } else if (lowerMessage.includes("save") || lowerMessage.includes("reduce")) {
      response = `To save energy, I recommend: 1) Schedule HVAC to reduce temperature by 2°C during off-hours (saves ~15%), 2) Enable smart lighting with motion sensors (saves ~20%), 3) Put computers in sleep mode after 30 minutes of inactivity (saves ~10%).`
    } else if (lowerMessage.includes("anomal") || lowerMessage.includes("problem")) {
      const anomalies = dataStore.getAnomalousDevices()
      if (anomalies.length > 0) {
        response = `I detected ${anomalies.length} devices with anomalies: ${anomalies.map((d) => d.name).join(", ")}. These devices are consuming more energy than usual. I recommend checking them for issues.`
      } else {
        response = `Great news! No anomalies detected. All devices are operating normally.`
      }
    } else if (lowerMessage.includes("cost") || lowerMessage.includes("bill")) {
      const total = dataStore.getTotalConsumption()
      const cost = total * 0.12 * 24 * 30 // Monthly estimate
      response = `Based on current consumption of ${total.toFixed(2)} kW, your estimated monthly bill is $${cost.toFixed(2)}. With optimization, you could reduce this by 20-30%.`
    } else if (lowerMessage.includes("co2") || lowerMessage.includes("emission")) {
      const total = dataStore.getTotalConsumption()
      const co2 = total * 0.5 * 24 * 30 // Monthly CO2 in kg
      response = `Your current energy usage generates approximately ${co2.toFixed(2)} kg of CO2 emissions per month. By reducing consumption by 20%, you could save ${(co2 * 0.2).toFixed(2)} kg of CO2.`
    } else {
      response = `I'm your energy assistant! I can help you with:
      
• Analyzing energy consumption patterns
• Identifying devices with high usage
• Providing energy-saving recommendations
• Detecting anomalies and issues
• Calculating costs and CO2 emissions
• Setting up automation rules

What would you like to know?`
    }

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Error in chat:", error)
    return NextResponse.json({ success: false, error: "Failed to process message" }, { status: 500 })
  }
}
