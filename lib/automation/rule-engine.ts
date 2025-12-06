export interface AutomationRule {
  id: string
  name: string
  description: string
  enabled: boolean
  trigger: Trigger
  conditions: Condition[]
  actions: Action[]
  priority: number
  createdAt: number
  lastTriggered?: number
}

export interface Trigger {
  type: "schedule" | "threshold" | "event" | "pattern" | "weather" | "price"
  config: any
}

export interface Condition {
  type: "time" | "value" | "state" | "weather" | "occupancy"
  operator: "equals" | "greater" | "less" | "between" | "contains"
  value: any
}

export interface Action {
  type: "device_control" | "notification" | "schedule" | "mode_change" | "alert"
  target: string
  parameters: any
}

export class RuleEngine {
  private rules: Map<string, AutomationRule> = new Map()

  // Feature 62: Rule creation and management
  createRule(rule: Omit<AutomationRule, "id" | "createdAt">): AutomationRule {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    }
    this.rules.set(newRule.id, newRule)
    return newRule
  }

  // Feature 63: Rule evaluation
  evaluateRule(rule: AutomationRule, context: any): boolean {
    if (!rule.enabled) return false

    const triggerMet = this.evaluateTrigger(rule.trigger, context)
    if (!triggerMet) return false

    return rule.conditions.every((condition) => this.evaluateCondition(condition, context))
  }

  private evaluateTrigger(trigger: Trigger, context: any): boolean {
    switch (trigger.type) {
      case "schedule":
        return this.checkSchedule(trigger.config, context.currentTime)
      case "threshold":
        return context.value >= trigger.config.threshold
      case "event":
        return context.event === trigger.config.eventType
      case "pattern":
        return this.detectPattern(trigger.config, context.history)
      case "weather":
        return context.weather?.condition === trigger.config.condition
      case "price":
        return context.energyPrice >= trigger.config.priceThreshold
      default:
        return false
    }
  }

  private evaluateCondition(condition: Condition, context: any): boolean {
    const value = context[condition.type]

    switch (condition.operator) {
      case "equals":
        return value === condition.value
      case "greater":
        return value > condition.value
      case "less":
        return value < condition.value
      case "between":
        return value >= condition.value[0] && value <= condition.value[1]
      case "contains":
        return Array.isArray(value) && value.includes(condition.value)
      default:
        return false
    }
  }

  private checkSchedule(config: any, currentTime: number): boolean {
    const date = new Date(currentTime)
    const hour = date.getHours()
    const minute = date.getMinutes()
    const dayOfWeek = date.getDay()

    if (config.days && !config.days.includes(dayOfWeek)) return false
    if (config.time) {
      const [targetHour, targetMinute] = config.time.split(":").map(Number)
      return hour === targetHour && minute === targetMinute
    }

    return true
  }

  private detectPattern(config: any, history: number[]): boolean {
    if (history.length < config.windowSize) return false

    const recent = history.slice(-config.windowSize)
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length

    return avg > config.threshold
  }

  // Feature 64: Execute actions
  async executeActions(actions: Action[]): Promise<void> {
    for (const action of actions) {
      await this.executeAction(action)
    }
  }

  private async executeAction(action: Action): Promise<void> {
    console.log(`[v0] Executing action: ${action.type} on ${action.target}`, action.parameters)
    // In a real implementation, this would interface with device controllers
  }

  // Feature 65: Rule priority management
  sortRulesByPriority(rules: AutomationRule[]): AutomationRule[] {
    return [...rules].sort((a, b) => b.priority - a.priority)
  }

  // Feature 66: Conflict resolution
  resolveConflicts(triggeredRules: AutomationRule[]): AutomationRule[] {
    const sorted = this.sortRulesByPriority(triggeredRules)
    const resolved: AutomationRule[] = []
    const affectedTargets = new Set<string>()

    for (const rule of sorted) {
      const ruleTargets = rule.actions.map((a) => a.target)
      const hasConflict = ruleTargets.some((t) => affectedTargets.has(t))

      if (!hasConflict) {
        resolved.push(rule)
        ruleTargets.forEach((t) => affectedTargets.add(t))
      }
    }

    return resolved
  }
}

export const ruleEngine = new RuleEngine()
