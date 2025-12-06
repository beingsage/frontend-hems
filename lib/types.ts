export type UserRole = "user" | "engineer" | "ngo" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  preferences: {
    budgetLimit?: number
    notifications: boolean
    theme: "light" | "dark"
  }
}

export interface Alert {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  deviceId?: string
  timestamp: Date
  read: boolean
}

export interface Recommendation {
  id: string
  title: string
  description: string
  potentialSavings: number
  difficulty: "easy" | "medium" | "hard"
  category: "scheduling" | "replacement" | "maintenance" | "behavior"
  deviceIds: string[]
}

export interface PolicySimulation {
  id: string
  name: string
  description: string
  parameters: Record<string, any>
  projectedSavings: {
    energy: number
    cost: number
    co2: number
  }
  affectedDevices: number
}
