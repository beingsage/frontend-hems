import mqtt from "mqtt"
import { Pool } from "pg"
import Redis from "ioredis"
import { io as ioClient, type Socket } from "socket.io-client"

// Environment configuration
const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883"
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://iot_user:iot_password@localhost:5432/iot_energy"
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"
const SOCKETIO_URL = process.env.SOCKETIO_URL || "http://localhost:4000"

// Initialize connections
const pool = new Pool({ connectionString: DATABASE_URL })
const redis = new Redis(REDIS_URL)
let socketClient: Socket

interface TelemetryPayload {
  device_id: string
  site_id: string
  ts: string
  power_w: number
  voltage_v?: number
  current_a?: number
  energy_wh?: number
  power_factor?: number
  frequency_hz?: number
  device_meta?: Record<string, any>
  firmware?: string
}

// Connect to Socket.IO server
function connectSocketIO() {
  socketClient = ioClient(SOCKETIO_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
  })

  socketClient.on("connect", () => {
    console.log("[Ingest] Connected to Socket.IO server")
  })

  socketClient.on("disconnect", () => {
    console.log("[Ingest] Disconnected from Socket.IO server")
  })

  socketClient.on("error", (error) => {
    console.error("[Ingest] Socket.IO error:", error)
  })
}

// Write reading to TimescaleDB
async function writeReading(data: TelemetryPayload) {
  const query = `
    INSERT INTO readings (time, site_id, device_id, power_w, voltage_v, current_a, energy_wh, power_factor, frequency_hz, raw)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `

  const values = [
    new Date(data.ts),
    data.site_id,
    data.device_id,
    data.power_w,
    data.voltage_v || null,
    data.current_a || null,
    data.energy_wh || null,
    data.power_factor || null,
    data.frequency_hz || null,
    JSON.stringify(data),
  ]

  await pool.query(query, values)

  // Update device last_seen
  await pool.query("UPDATE devices SET last_seen = $1 WHERE id = $2", [new Date(data.ts), data.device_id])
}

// Cache reading in Redis for quick access
async function cacheReading(data: TelemetryPayload) {
  const key = `reading:${data.device_id}:latest`
  await redis.setex(key, 300, JSON.stringify(data)) // 5 min TTL

  // Add to site's recent readings list
  const siteKey = `readings:${data.site_id}:recent`
  await redis.lpush(siteKey, JSON.stringify(data))
  await redis.ltrim(siteKey, 0, 99) // Keep last 100
  await redis.expire(siteKey, 3600) // 1 hour TTL
}

// Push to ML processing queue
async function queueForML(data: TelemetryPayload) {
  await redis.xadd("ml:readings", "*", "payload", JSON.stringify(data), "timestamp", Date.now().toString())
}

// Emit realtime event to connected clients
function emitRealtimeEvent(data: TelemetryPayload) {
  if (socketClient && socketClient.connected) {
    socketClient.emit("reading", {
      device_id: data.device_id,
      site_id: data.site_id,
      ts: data.ts,
      power_w: data.power_w,
      voltage_v: data.voltage_v,
      current_a: data.current_a,
    })
  }
}

// Process incoming MQTT message
async function processMessage(topic: string, payload: Buffer) {
  try {
    const data: TelemetryPayload = JSON.parse(payload.toString())

    // Validate required fields
    if (!data.device_id || !data.site_id || !data.ts || data.power_w === undefined) {
      console.error("[Ingest] Invalid payload, missing required fields:", data)
      return
    }

    // Rate limiting check
    const rateLimitKey = `ratelimit:${data.device_id}`
    const count = await redis.incr(rateLimitKey)
    if (count === 1) {
      await redis.expire(rateLimitKey, 1) // 1 second window
    }
    if (count > 10) {
      // Max 10 messages per second per device
      console.warn(`[Ingest] Rate limit exceeded for device ${data.device_id}`)
      return
    }

    // Process in parallel
    await Promise.all([writeReading(data), cacheReading(data), queueForML(data)])

    // Emit realtime event
    emitRealtimeEvent(data)

    console.log(`[Ingest] Processed reading from ${data.device_id}: ${data.power_w}W`)
  } catch (error) {
    console.error("[Ingest] Error processing message:", error)
  }
}

// Main function
async function main() {
  console.log("[Ingest] Starting MQTT ingest worker...")

  // Test database connection
  try {
    await pool.query("SELECT NOW()")
    console.log("[Ingest] Database connection successful")
  } catch (error) {
    console.error("[Ingest] Database connection failed:", error)
    process.exit(1)
  }

  // Test Redis connection
  try {
    await redis.ping()
    console.log("[Ingest] Redis connection successful")
  } catch (error) {
    console.error("[Ingest] Redis connection failed:", error)
    process.exit(1)
  }

  // Connect to Socket.IO
  connectSocketIO()

  // Connect to MQTT broker
  const mqttClient = mqtt.connect(MQTT_URL, {
    clientId: `ingest-worker-${Date.now()}`,
    clean: true,
    reconnectPeriod: 1000,
  })

  mqttClient.on("connect", () => {
    console.log("[Ingest] Connected to MQTT broker")

    // Subscribe to telemetry topics
    mqttClient.subscribe("site/+/device/+/telemetry", (err) => {
      if (err) {
        console.error("[Ingest] Subscription error:", err)
      } else {
        console.log("[Ingest] Subscribed to site/+/device/+/telemetry")
      }
    })
  })

  mqttClient.on("message", processMessage)

  mqttClient.on("error", (error) => {
    console.error("[Ingest] MQTT error:", error)
  })

  mqttClient.on("offline", () => {
    console.log("[Ingest] MQTT client offline")
  })

  mqttClient.on("reconnect", () => {
    console.log("[Ingest] MQTT client reconnecting...")
  })

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("[Ingest] Shutting down gracefully...")
    mqttClient.end()
    socketClient.disconnect()
    await pool.end()
    await redis.quit()
    process.exit(0)
  })
}

main().catch(console.error)
