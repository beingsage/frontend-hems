"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { Reading } from "./data"

type WebSocketMessage = {
  type: string
  payload: any
}

type WebSocketConfig = {
  url: string
  reconnectDelay?: number
  maxReconnectAttempts?: number
}

export class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private config: WebSocketConfig
  private messageHandlers: Map<string, ((data: any) => void)[]> = new Map()

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectDelay: 1000,
      maxReconnectAttempts: 5,
      ...config,
    }
  }

  connect() {
    try {
      this.ws = new WebSocket(this.config.url)
      this.setupEventHandlers()
    } catch (error) {
      console.error("WebSocket connection error:", error)
      this.handleReconnect()
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log("WebSocket connected")
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    this.ws.onclose = () => {
      console.log("WebSocket disconnected")
      this.handleReconnect()
    }

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < (this.config.maxReconnectAttempts || 5)) {
      this.reconnectAttempts++
      setTimeout(() => this.connect(), this.config.reconnectDelay)
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const handlers = this.messageHandlers.get(message.type)
    if (handlers) {
      handlers.forEach((handler) => handler(message.payload))
    }
  }

  subscribe(type: string, handler: (data: any) => void) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)?.push(handler)

    // Send subscription message
    this.send({ type: "subscribe", payload: { channel: type } })
  }

  unsubscribe(type: string, handler: (data: any) => void) {
    const handlers = this.messageHandlers.get(type)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }

    // Send unsubscribe message
    this.send({ type: "unsubscribe", payload: { channel: type } })
  }

  send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// React hook for device readings
export function useWebSocketReadings(deviceIds: string[]) {
  const [readings, setReadings] = useState<Map<string, Reading>>(new Map())
  const wsRef = useRef<WebSocketClient>()

  useEffect(() => {
    // Create WebSocket client
    wsRef.current = new WebSocketClient({
      url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080",
    })
    wsRef.current.connect()

    // Subscribe to device readings
    deviceIds.forEach((deviceId) => {
      wsRef.current?.subscribe(`device:${deviceId}`, (reading: Reading) => {
        setReadings((prev) => {
          const next = new Map(prev)
          next.set(deviceId, reading)
          return next
        })
      })
    })

    return () => {
      // Cleanup subscriptions and disconnect
      deviceIds.forEach((deviceId) => {
        wsRef.current?.unsubscribe(`device:${deviceId}`, () => {})
      })
      wsRef.current?.disconnect()
    }
  }, [deviceIds])
      }
    }
  }, [deviceIds])

  return readings
}
