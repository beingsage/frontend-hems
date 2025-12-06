"use client"

import { useState, useRef, useEffect } from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { ChatMessage } from "@/components/assistant/chat-message"
import { SuggestedQuestions } from "@/components/assistant/suggested-questions"
import { MascotAvatar } from "@/components/assistant/mascot-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Mic, Volume2, VolumeX } from "lucide-react"
import { useRealtimeDevices } from "@/lib/hooks/use-realtime-devices"
import { useRealtimeAnalytics } from "@/lib/hooks/use-realtime-analytics"
import { ProtectedRoute } from "@/components/protected-route"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AssistantPage() {
  const { devices } = useRealtimeDevices()
  const { analytics } = useRealtimeAnalytics()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Energy Assistant. I can help you understand your energy consumption, identify savings opportunities, troubleshoot device issues, and provide insights on sustainability goals. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (!devices || !analytics) {
      return "I'm still loading the latest data. Please try again in a moment."
    }

    // High consumption devices
    if (lowerMessage.includes("most energy") || lowerMessage.includes("highest consumption")) {
      const highDevices = devices
        .filter((d) => d.consumption_watts > 2000)
        .sort((a, b) => b.consumption_watts - a.consumption_watts)
        .slice(0, 5)

      if (highDevices.length === 0) {
        return "Great news! No devices are currently consuming high amounts of energy (>2000W)."
      }

      const totalConsumption = devices.reduce((sum, d) => sum + d.consumption_watts, 0)
      const highConsumption = highDevices.reduce((sum, d) => sum + d.consumption_watts, 0)

      return `Here are the top ${highDevices.length} energy-consuming devices:\n\n${highDevices
        .map(
          (d, i) =>
            `${i + 1}. ${d.name}\n   Location: ${d.room}, ${d.building}\n   Consumption: ${d.consumption_watts}W\n   Cost: $${((d.consumption_watts / 1000) * 0.12).toFixed(2)}/hour`,
        )
        .join(
          "\n\n",
        )}\n\nThese devices account for ${((highConsumption / totalConsumption) * 100).toFixed(1)}% of total consumption.`
    }

    // Savings recommendations
    if (lowerMessage.includes("save") || lowerMessage.includes("reduce cost")) {
      const potentialSavings = analytics.totalConsumption * 0.15
      const costSavings = (potentialSavings / 1000) * 0.12
      const affectedDevices = Math.floor(devices.length * 0.3)

      return `Based on current consumption patterns, here's how you can save energy:\n\n1. Optimize High-Consumption Devices\n   - Potential savings: ${potentialSavings.toFixed(0)}W\n   - Monthly cost reduction: $${(costSavings * 24 * 30).toFixed(2)}\n   - Affected devices: ${affectedDevices}\n\n2. Schedule AC units during off-peak hours\n   - Estimated savings: 15-20% on cooling costs\n\n3. Replace inefficient lighting with LED\n   - Long-term savings: 30-40% on lighting costs\n\n4. Implement automated shutdowns for unused equipment\n   - Potential savings: 10-15% overall\n\nWould you like detailed recommendations for specific devices?`
    }

    // Anomalies
    if (lowerMessage.includes("anomal") || lowerMessage.includes("problem") || lowerMessage.includes("issue")) {
      const anomalies = devices.filter((d) => d.anomaly)

      if (anomalies.length === 0) {
        return "Great news! No anomalies detected in your system. All devices are operating normally."
      }

      return `I've detected ${anomalies.length} device(s) with anomalies:\n\n${anomalies
        .map(
          (d, i) =>
            `${i + 1}. ${d.name}\n   Location: ${d.room}, ${d.building}\n   Status: ${d.status}\n   Issue: ${d.status === "offline" ? "Device offline - requires immediate attention" : "Unusual consumption pattern detected"}\n   Health: ${d.health}%`,
        )
        .join(
          "\n\n",
        )}\n\nRecommendation: ${anomalies.some((d) => d.status === "offline") ? "Schedule immediate maintenance for offline devices." : "Monitor these devices closely and consider preventive maintenance."}`
    }

    // CO2 emissions
    if (lowerMessage.includes("co2") || lowerMessage.includes("emission") || lowerMessage.includes("carbon")) {
      const co2PerDay = analytics.totalCO2 * 24
      const co2PerYear = co2PerDay * 365

      return `Current CO₂ Emissions Report:\n\n- Today: ${co2PerDay.toFixed(1)} kg CO₂\n- Monthly projection: ${(co2PerDay * 30).toFixed(1)} kg CO₂\n- Annual projection: ${co2PerYear.toFixed(1)} kg CO₂\n\nThis is equivalent to:\n- ${(co2PerYear / 411).toFixed(1)} trees needed to offset annually\n- ${(co2PerYear / 2400).toFixed(2)} cars driven for a year\n\nTo reduce emissions, focus on optimizing high-consumption devices and increasing renewable energy usage.`
    }

    // Default response
    return `I understand you're asking about "${userMessage}". I can help you with:\n\n- Energy consumption analysis\n- Device troubleshooting and maintenance\n- Cost optimization strategies\n- Sustainability metrics (SDG 7 & 13)\n- Scheduling recommendations\n- Anomaly detection and alerts\n\nCould you please be more specific about what you'd like to know?`
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsThinking(true)

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response = generateResponse(input)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsThinking(false)
  }

  const handleQuestionClick = (question: string) => {
    setInput(question)
  }

  return (
        <ProtectedRoute>
    
    <div className="flex h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12">
                <MascotAvatar isThinking={isThinking} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Energy Assistant</h1>
                <p className="text-sm text-muted-foreground">Your intelligent guide to energy optimization</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Online
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => setVoiceEnabled(!voiceEnabled)}>
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}

            {isThinking && (
              <div className="flex gap-3 p-4 bg-secondary/50">
                <div className="w-10 h-10">
                  <MascotAvatar isThinking={true} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">Analyzing data...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="border-t border-border bg-card px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <SuggestedQuestions onQuestionClick={handleQuestionClick} />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border bg-card px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about energy management..."
                className="flex-1"
              />
              <Button variant="ghost" size="icon">
                <Mic className="h-4 w-4" />
              </Button>
              <Button onClick={handleSend} disabled={!input.trim() || isThinking}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by AI trained on energy efficiency guidelines and IoT sensor data
            </p>
          </div>
        </div>
      </main>
    </div>
        </ProtectedRoute>
    
  )
}
