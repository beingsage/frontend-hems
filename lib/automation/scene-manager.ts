export interface Scene {
  id: string
  name: string
  description: string
  icon: string
  devices: DeviceState[]
  triggers?: SceneTrigger[]
  enabled: boolean
}

export interface DeviceState {
  deviceId: string
  state: "on" | "off"
  value?: any
  transition?: number // seconds
}

export interface SceneTrigger {
  type: "manual" | "auto" | "geofence" | "voice"
  config?: any
}

export class SceneManager {
  private scenes: Map<string, Scene> = new Map()

  // Feature 71: Scene creation and management
  createScene(scene: Omit<Scene, "id">): Scene {
    const newScene: Scene = {
      ...scene,
      id: `scene-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    this.scenes.set(newScene.id, newScene)
    return newScene
  }

  // Feature 72: Predefined scenes
  createPredefinedScenes(): Scene[] {
    const scenes = [
      {
        name: "Away Mode",
        description: "Minimize energy usage when nobody is home",
        icon: "home-off",
        devices: [
          { deviceId: "hvac", state: "off" as const },
          { deviceId: "lights", state: "off" as const },
          { deviceId: "appliances", state: "off" as const },
        ],
        enabled: true,
      },
      {
        name: "Sleep Mode",
        description: "Optimize for nighttime comfort and efficiency",
        icon: "moon",
        devices: [
          { deviceId: "hvac", state: "on" as const, value: 20 },
          { deviceId: "lights", state: "off" as const },
          { deviceId: "security", state: "on" as const },
        ],
        enabled: true,
      },
      {
        name: "Eco Mode",
        description: "Maximum energy savings",
        icon: "leaf",
        devices: [
          { deviceId: "hvac", state: "on" as const, value: 22 },
          { deviceId: "lights", state: "on" as const, value: 50 },
          { deviceId: "pool", state: "off" as const },
        ],
        enabled: true,
      },
      {
        name: "Peak Shaving",
        description: "Reduce consumption during peak hours",
        icon: "trending-down",
        devices: [
          { deviceId: "ev-charger", state: "off" as const },
          { deviceId: "pool-pump", state: "off" as const },
          { deviceId: "water-heater", state: "off" as const },
        ],
        enabled: true,
      },
    ]

    return scenes.map((scene) => this.createScene(scene))
  }

  // Feature 73: Scene activation
  async activateScene(sceneId: string): Promise<void> {
    const scene = this.scenes.get(sceneId)
    if (!scene || !scene.enabled) {
      throw new Error("Scene not found or disabled")
    }

    console.log(`[v0] Activating scene: ${scene.name}`)

    for (const deviceState of scene.devices) {
      await this.applyDeviceState(deviceState)
    }
  }

  private async applyDeviceState(deviceState: DeviceState): Promise<void> {
    console.log(`[v0] Setting ${deviceState.deviceId} to ${deviceState.state}`, deviceState.value)
    // Simulate device control with transition
    if (deviceState.transition) {
      await new Promise((resolve) => setTimeout(resolve, deviceState.transition * 1000))
    }
  }

  // Feature 74: Scene scheduling
  scheduleScene(sceneId: string, time: string, days: number[]): void {
    const scene = this.scenes.get(sceneId)
    if (!scene) return

    console.log(`[v0] Scheduling scene ${scene.name} for ${time} on days ${days.join(", ")}`)
  }

  // Feature 75: Smart scene suggestions
  suggestScenes(context: {
    timeOfDay: "morning" | "afternoon" | "evening" | "night"
    occupancy: boolean
    weather: string
    energyPrice: number
  }): Scene[] {
    const suggestions: Scene[] = []

    if (!context.occupancy) {
      const awayScene = Array.from(this.scenes.values()).find((s) => s.name === "Away Mode")
      if (awayScene) suggestions.push(awayScene)
    }

    if (context.timeOfDay === "night") {
      const sleepScene = Array.from(this.scenes.values()).find((s) => s.name === "Sleep Mode")
      if (sleepScene) suggestions.push(sleepScene)
    }

    if (context.energyPrice > 0.3) {
      const peakShavingScene = Array.from(this.scenes.values()).find((s) => s.name === "Peak Shaving")
      if (peakShavingScene) suggestions.push(peakShavingScene)
    }

    return suggestions
  }
}

export const sceneManager = new SceneManager()
