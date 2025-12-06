export interface Schedule {
  id: string
  name: string
  deviceId: string
  action: "on" | "off" | "dim" | "set_temperature" | "set_mode"
  value?: any
  recurrence: Recurrence
  enabled: boolean
  conditions?: ScheduleCondition[]
}

export interface Recurrence {
  type: "once" | "daily" | "weekly" | "monthly" | "custom"
  time: string // HH:MM format
  days?: number[] // 0-6 for weekly
  dates?: number[] // 1-31 for monthly
  interval?: number // for custom intervals
}

export interface ScheduleCondition {
  type: "weather" | "occupancy" | "price" | "solar_generation"
  operator: "equals" | "greater" | "less"
  value: any
}

export class Scheduler {
  private schedules: Map<string, Schedule> = new Map()

  // Feature 67: Advanced scheduling
  createSchedule(schedule: Omit<Schedule, "id">): Schedule {
    const newSchedule: Schedule = {
      ...schedule,
      id: `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    this.schedules.set(newSchedule.id, newSchedule)
    return newSchedule
  }

  // Feature 68: Smart scheduling with optimization
  optimizeSchedule(
    deviceId: string,
    energyRequired: number,
    preferences: { preferLowCost?: boolean; preferRenewable?: boolean; flexibilityHours?: number },
  ): Schedule {
    const optimalTime = this.findOptimalTime(energyRequired, preferences)

    return this.createSchedule({
      name: `Optimized Schedule for ${deviceId}`,
      deviceId,
      action: "on",
      recurrence: {
        type: "daily",
        time: optimalTime,
      },
      enabled: true,
    })
  }

  private findOptimalTime(
    energyRequired: number,
    preferences: { preferLowCost?: boolean; preferRenewable?: boolean; flexibilityHours?: number },
  ): string {
    // Simulate finding optimal time based on preferences
    if (preferences.preferRenewable) {
      return "12:00" // Peak solar hours
    }
    if (preferences.preferLowCost) {
      return "02:00" // Off-peak hours
    }
    return "10:00" // Default
  }

  // Feature 69: Conditional scheduling
  shouldExecuteSchedule(schedule: Schedule, context: any): boolean {
    if (!schedule.enabled) return false
    if (!this.isScheduledTime(schedule)) return false

    if (schedule.conditions) {
      return schedule.conditions.every((condition) => this.evaluateScheduleCondition(condition, context))
    }

    return true
  }

  private isScheduledTime(schedule: Schedule): boolean {
    const now = new Date()
    const [hour, minute] = schedule.recurrence.time.split(":").map(Number)

    if (now.getHours() !== hour || now.getMinutes() !== minute) {
      return false
    }

    switch (schedule.recurrence.type) {
      case "once":
        return true
      case "daily":
        return true
      case "weekly":
        return schedule.recurrence.days?.includes(now.getDay()) ?? false
      case "monthly":
        return schedule.recurrence.dates?.includes(now.getDate()) ?? false
      default:
        return false
    }
  }

  private evaluateScheduleCondition(condition: ScheduleCondition, context: any): boolean {
    const value = context[condition.type]

    switch (condition.operator) {
      case "equals":
        return value === condition.value
      case "greater":
        return value > condition.value
      case "less":
        return value < condition.value
      default:
        return false
    }
  }

  // Feature 70: Bulk schedule management
  bulkUpdateSchedules(scheduleIds: string[], updates: Partial<Schedule>): void {
    scheduleIds.forEach((id) => {
      const schedule = this.schedules.get(id)
      if (schedule) {
        this.schedules.set(id, { ...schedule, ...updates })
      }
    })
  }
}

export const scheduler = new Scheduler()
