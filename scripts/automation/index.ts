import { Pool } from "pg"
import Redis from "ioredis"
import mqtt from "mqtt"

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://iot_user:iot_password@localhost:5432/iot_energy"
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"
const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883"

const pool = new Pool({ connectionString: DATABASE_URL })
const redis = new Redis(REDIS_URL)
let mqttClient: mqtt.MqttClient

interface Automation {
  id: string
  site_id: string
  name: string
  condition: any
  action: any
  enabled: boolean
  cooldown_seconds: number
  last_triggered: Date | null
}

interface Reading {
  device_id: string
  site_id: string
  power_w: number
  ts: string
}

// Track state for condition evaluation
const conditionState = new Map<string, any>()

async function loadAutomations(): Promise<Automation[]> {
  const result = await pool.query("SELECT * FROM automations WHERE enabled = true")
  return result.rows
}

async function evaluateCondition(automation: Automation, reading: Reading): Promise<boolean> {
  const { condition } = automation
  const stateKey = `${automation.id}:${reading.device_id}`

  switch (condition.type) {
    case "power_threshold": {
      const { operator, value, duration_s, device_id } = condition

      // Check if condition applies to this device
      if (device_id && device_id !== reading.device_id) {
        return false
      }

      // Check threshold
      let thresholdMet = false
      if (operator === ">") thresholdMet = reading.power_w > value
      else if (operator === "<") thresholdMet = reading.power_w < value
      else if (operator === ">=") thresholdMet = reading.power_w >= value
      else if (operator === "<=") thresholdMet = reading.power_w <= value
      else if (operator === "==") thresholdMet = reading.power_w === value

      if (!thresholdMet) {
        conditionState.delete(stateKey)
        return false
      }

      // Check duration
      if (duration_s) {
        const state = conditionState.get(stateKey)
        const now = Date.now()

        if (!state) {
          conditionState.set(stateKey, { startTime: now })
          return false
        }

        const elapsed = (now - state.startTime) / 1000
        if (elapsed >= duration_s) {
          conditionState.delete(stateKey)
          return true
        }
        return false
      }

      return true
    }

    case "anomaly_detected": {
      // Check if recent anomaly exists for this device
      const result = await pool.query(
        `SELECT COUNT(*) as count FROM anomalies 
         WHERE device_id = $1 AND time > NOW() - INTERVAL '5 minutes' AND resolved = false`,
        [reading.device_id],
      )
      return result.rows[0].count > 0
    }

    case "time_based": {
      const { start_time, end_time, days_of_week } = condition
      const now = new Date()
      const hour = now.getHours()
      const minute = now.getMinutes()
      const dayOfWeek = now.getDay()

      // Check time range
      const [startHour, startMin] = start_time.split(":").map(Number)
      const [endHour, endMin] = end_time.split(":").map(Number)
      const currentMinutes = hour * 60 + minute
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin

      if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
        return false
      }

      // Check day of week
      if (days_of_week && !days_of_week.includes(dayOfWeek)) {
        return false
      }

      return true
    }

    default:
      console.warn(`[Automation] Unknown condition type: ${condition.type}`)
      return false
  }
}

async function executeAction(automation: Automation, reading: Reading) {
  const { action } = automation

  try {
    switch (action.type) {
      case "notification": {
        // Create notification in database
        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, metadata)
           SELECT owner_id, 'automation', $1, $2, $3
           FROM automations WHERE id = $4`,
          [
            automation.name,
            action.message || `Automation "${automation.name}" triggered`,
            JSON.stringify({ automation_id: automation.id, reading }),
            automation.id,
          ],
        )

        // Publish to Redis for realtime delivery
        await redis.publish(
          "notifications",
          JSON.stringify({
            automation_id: automation.id,
            site_id: automation.site_id,
            message: action.message,
          }),
        )

        console.log(`[Automation] Sent notification for ${automation.name}`)
        break
      }

      case "mqtt_command": {
        // Publish MQTT command to device
        const { topic, payload } = action
        const commandTopic = topic || `site/${reading.site_id}/device/${reading.device_id}/command`
        const commandPayload = payload || { cmd: "switch_off", reason: automation.id }

        mqttClient.publish(commandTopic, JSON.stringify(commandPayload))
        console.log(`[Automation] Published MQTT command to ${commandTopic}`)
        break
      }

      case "webhook": {
        // Call external webhook
        const { url, method = "POST" } = action
        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ automation, reading }),
        })
        console.log(`[Automation] Called webhook ${url}`)
        break
      }

      default:
        console.warn(`[Automation] Unknown action type: ${action.type}`)
    }

    // Log automation event
    await pool.query(
      `INSERT INTO automation_events (automation_id, condition_met, action_executed, result, success)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        automation.id,
        JSON.stringify(automation.condition),
        JSON.stringify(action),
        "Action executed successfully",
        true,
      ],
    )

    // Update automation last_triggered and trigger_count
    await pool.query(
      `UPDATE automations 
       SET last_triggered = NOW(), trigger_count = trigger_count + 1
       WHERE id = $1`,
      [automation.id],
    )
  } catch (error) {
    console.error(`[Automation] Error executing action:`, error)

    // Log failed event
    await pool.query(
      `INSERT INTO automation_events (automation_id, condition_met, action_executed, result, success, error)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        automation.id,
        JSON.stringify(automation.condition),
        JSON.stringify(action),
        "Action execution failed",
        false,
        error.message,
      ],
    )
  }
}

async function processReading(reading: Reading) {
  const automations = await loadAutomations()

  for (const automation of automations) {
    // Check if automation applies to this site
    if (automation.site_id !== reading.site_id) {
      continue
    }

    // Check cooldown period
    if (automation.last_triggered) {
      const elapsed = (Date.now() - automation.last_triggered.getTime()) / 1000
      if (elapsed < automation.cooldown_seconds) {
        continue
      }
    }

    // Evaluate condition
    const conditionMet = await evaluateCondition(automation, reading)

    if (conditionMet) {
      console.log(`[Automation] Condition met for "${automation.name}"`)
      await executeAction(automation, reading)
    }
  }
}

async function main() {
  console.log("[Automation] Starting automation engine...")

  // Test database connection
  try {
    await pool.query("SELECT NOW()")
    console.log("[Automation] Database connection successful")
  } catch (error) {
    console.error("[Automation] Database connection failed:", error)
    process.exit(1)
  }

  // Connect to MQTT for sending commands
  mqttClient = mqtt.connect(MQTT_URL, {
    clientId: `automation-engine-${Date.now()}`,
    clean: true,
  })

  mqttClient.on("connect", () => {
    console.log("[Automation] Connected to MQTT broker")
  })

  // Subscribe to Redis stream for readings
  console.log("[Automation] Subscribing to readings stream...")

  while (true) {
    try {
      const messages = await redis.xread("BLOCK", 1000, "STREAMS", "ml:readings", "$")

      if (messages) {
        for (const [stream, streamMessages] of messages) {
          for (const [id, fields] of streamMessages) {
            const payload = JSON.parse(fields[1]) // fields is ['payload', '...']
            await processReading(payload)
          }
        }
      }
    } catch (error) {
      console.error("[Automation] Error processing stream:", error)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

main().catch(console.error)
