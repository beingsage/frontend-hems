import mqtt from "mqtt"

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883"
const NUM_DEVICES = Number.parseInt(process.env.NUM_DEVICES || "10")
const INTERVAL_MS = Number.parseInt(process.env.INTERVAL_MS || "2000")

const SITE_ID = "site-demo"

// Device configurations
const devices = [
  { id: "dev-ac-001", type: "AC", baseW: 1500, variance: 300 },
  { id: "dev-fridge-001", type: "Refrigerator", baseW: 150, variance: 30 },
  { id: "dev-heater-001", type: "Heater", baseW: 1200, variance: 200 },
  { id: "dev-light-001", type: "Lighting", baseW: 60, variance: 10 },
  { id: "dev-washer-001", type: "Appliance", baseW: 500, variance: 100 },
  { id: "dev-pc-001", type: "Electronics", baseW: 300, variance: 50 },
]

// Diurnal pattern (hour -> multiplier)
function getDiurnalMultiplier(): number {
  const hour = new Date().getHours()

  // Night (0-6): 0.3x
  if (hour < 6) return 0.3
  // Morning (6-9): 0.7x
  if (hour < 9) return 0.7
  // Day (9-17): 1.0x
  if (hour < 17) return 1.0
  // Evening (17-22): 1.3x (peak)
  if (hour < 22) return 1.3
  // Late night (22-24): 0.5x
  return 0.5
}

function generateReading(device: (typeof devices)[0]) {
  const diurnal = getDiurnalMultiplier()
  const randomVariance = (Math.random() - 0.5) * 2 * device.variance
  const power_w = Math.max(0, device.baseW * diurnal + randomVariance)

  // Occasionally inject anomalies (5% chance)
  const isAnomaly = Math.random() < 0.05
  const finalPower = isAnomaly ? power_w * (Math.random() > 0.5 ? 2.5 : 0.3) : power_w

  return {
    device_id: device.id,
    site_id: SITE_ID,
    ts: new Date().toISOString(),
    power_w: Math.round(finalPower * 10) / 10,
    voltage_v: 230 + (Math.random() - 0.5) * 10,
    current_a: Math.round((finalPower / 230) * 10) / 10,
    energy_wh: Math.round((finalPower / 3600) * (INTERVAL_MS / 1000) * 1000) / 1000,
    power_factor: 0.85 + Math.random() * 0.1,
    frequency_hz: 50 + (Math.random() - 0.5) * 0.5,
    device_meta: { type: device.type },
    firmware: "v1.2.0",
  }
}

async function main() {
  console.log("[Simulator] Starting device simulator...")
  console.log(`[Simulator] Simulating ${devices.length} devices`)
  console.log(`[Simulator] Publishing every ${INTERVAL_MS}ms`)

  const client = mqtt.connect(MQTT_URL, {
    clientId: `simulator-${Date.now()}`,
    clean: true,
  })

  client.on("connect", () => {
    console.log("[Simulator] Connected to MQTT broker")

    // Publish readings for each device
    setInterval(() => {
      for (const device of devices) {
        const reading = generateReading(device)
        const topic = `site/${SITE_ID}/device/${device.id}/telemetry`

        client.publish(topic, JSON.stringify(reading), (err) => {
          if (err) {
            console.error(`[Simulator] Error publishing for ${device.id}:`, err)
          } else {
            console.log(`[Simulator] ${device.id}: ${reading.power_w}W`)
          }
        })
      }
    }, INTERVAL_MS)
  })

  client.on("error", (error) => {
    console.error("[Simulator] MQTT error:", error)
  })

  // Listen for commands
  client.subscribe(`site/${SITE_ID}/device/+/command`, (err) => {
    if (!err) {
      console.log("[Simulator] Subscribed to command topics")
    }
  })

  client.on("message", (topic, payload) => {
    console.log(`[Simulator] Received command on ${topic}:`, payload.toString())
  })
}

main().catch(console.error)