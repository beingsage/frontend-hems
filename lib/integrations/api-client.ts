export interface APIConfig {
  baseUrl: string
  apiKey: string
  version: string
  timeout: number
  retryAttempts: number
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  metadata?: {
    timestamp: number
    requestId: string
    rateLimit?: {
      remaining: number
      reset: number
    }
  }
}

export class APIClient {
  private config: APIConfig

  constructor(config: APIConfig) {
    this.config = config
  }

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<APIResponse<any>> {
    return this.post("/auth/login", credentials)
  }

  async signup(userData: { email: string; password: string; name: string }): Promise<APIResponse<any>> {
    return this.post("/auth/signup", userData)
  }

  // Devices
  async getDevices(): Promise<APIResponse<any[]>> {
    return this.get("/devices")
  }

  async getDevice(id: string): Promise<APIResponse<any>> {
    return this.get(`/devices/${id}`)
  }

  async createDevice(device: any): Promise<APIResponse<any>> {
    return this.post("/devices", device)
  }

  // Real-time data
  async getRealtimeDeviceData(deviceId: string): Promise<APIResponse<any>> {
    return this.get(`/realtime/device/${deviceId}`)
  }

  async getRealtimeAnalytics(): Promise<APIResponse<any>> {
    return this.get("/realtime/analytics")
  }

  // ML Pipeline
  async getMlInsights(deviceId: string, timeRange: string): Promise<APIResponse<any>> {
    return this.get(`/ml-pipeline?deviceId=${deviceId}&timeRange=${timeRange}`)
  }

  async processMlData(data: any): Promise<APIResponse<any>> {
    return this.post("/ml-pipeline", data)
  }

  // Gamification
  async getGamificationData(userId: string): Promise<APIResponse<any>> {
    return this.get(`/gamification?userId=${userId}`)
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<APIResponse<any>> {
    return this.post("/gamification", { userId, type: "achievement", achievementId })
  }

  // Integrations
  async getIntegrationStatus(type: string, deviceId: string): Promise<APIResponse<any>> {
    return this.get(`/integrations?type=${type}&deviceId=${deviceId}`)
  }

  async controlIntegratedDevice(deviceId: string, command: string, parameters: any): Promise<APIResponse<any>> {
    return this.post("/integrations", { deviceId, command, parameters })
  }

  // Automation
  async getAutomationRules(): Promise<APIResponse<any[]>> {
    return this.get("/automation/rules")
  }

  async createAutomationRule(rule: any): Promise<APIResponse<any>> {
    return this.post("/automation/rules", rule)
  }

  // Private methods for HTTP requests
  private async get(path: string): Promise<APIResponse<any>> {
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Accept": "application/json",
      },
    })
    return this.handleResponse(response)
  }

  private async post(path: string, data: any): Promise<APIResponse<any>> {
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  private async handleResponse(response: Response): Promise<APIResponse<any>> {
    const data = await response.json()
    return {
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.error,
      metadata: {
        timestamp: Date.now(),
        requestId: response.headers.get("x-request-id") || "",
        rateLimit: {
          remaining: Number(response.headers.get("x-ratelimit-remaining")),
          reset: Number(response.headers.get("x-ratelimit-reset")),
        },
      },
    }
  }
  async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    data?: any,
  ): Promise<APIResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
          "X-API-Version": this.config.version,
          "X-Request-ID": requestId,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(this.config.timeout),
      })

      const result = await response.json()

      return {
        success: response.ok,
        data: result,
        metadata: {
          timestamp: Date.now(),
          requestId,
          rateLimit: {
            remaining: Number.parseInt(response.headers.get("X-RateLimit-Remaining") || "0"),
            reset: Number.parseInt(response.headers.get("X-RateLimit-Reset") || "0"),
          },
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: {
          timestamp: Date.now(),
          requestId,
        },
      }
    }
  }

  // Feature 96: Retry logic with exponential backoff
  async requestWithRetry<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    data?: any,
  ): Promise<APIResponse<T>> {
    let lastError = ""

    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      const response = await this.request<T>(endpoint, method, data)

      if (response.success) {
        return response
      }

      lastError = response.error || "Unknown error"

      if (attempt < this.config.retryAttempts - 1) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    return {
      success: false,
      error: `Failed after ${this.config.retryAttempts} attempts: ${lastError}`,
      metadata: {
        timestamp: Date.now(),
        requestId: `retry-failed-${Date.now()}`,
      },
    }
  }

  // Feature 97: Batch requests
  async batchRequest<T>(requests: Array<{ endpoint: string; method?: string; data?: any }>): Promise<APIResponse<T>[]> {
    return Promise.all(requests.map((req) => this.request<T>(req.endpoint, (req.method as any) || "GET", req.data)))
  }
}
