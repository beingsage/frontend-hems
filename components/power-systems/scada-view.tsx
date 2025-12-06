"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import type { SCADANode } from "@/lib/power-systems/scada-data"

interface SCADAViewProps {
  nodes: SCADANode[]
  onNodeClick?: (node: SCADANode) => void
}

export function SCADAView({ nodes, onNodeClick }: SCADAViewProps) {
  // Calculate SVG viewBox based on node positions
  const viewBox = useMemo(() => {
    const padding = 50
    const maxX = Math.max(...nodes.map((n) => n.position.x)) + padding
    const maxY = Math.max(...nodes.map((n) => n.position.y)) + padding
    return `0 0 ${maxX} ${maxY}`
  }, [nodes])

  const getNodeColor = (status: SCADANode["status"]) => {
    switch (status) {
      case "normal":
        return "#10b981"
      case "warning":
        return "#f59e0b"
      case "alarm":
        return "#ef4444"
      case "offline":
        return "#6b7280"
    }
  }

  const getNodeIcon = (type: SCADANode["type"]) => {
    switch (type) {
      case "substation":
        return "⚡"
      case "transformer":
        return "🔌"
      case "meter":
        return "📊"
      case "breaker":
        return "🔧"
      case "load":
        return "💡"
    }
  }

  return (
    <Card className="p-4 bg-card">
      <svg width="100%" height="600" viewBox={viewBox} className="border border-border rounded-lg bg-background">
        {/* Draw connections first (so they appear behind nodes) */}
        {nodes.map((node) =>
          node.connections.map((connId) => {
            const targetNode = nodes.find((n) => n.id === connId)
            if (!targetNode) return null

            const isActive = node.status === "normal" && targetNode.status === "normal"

            return (
              <g key={`${node.id}-${connId}`}>
                <line
                  x1={node.position.x}
                  y1={node.position.y}
                  x2={targetNode.position.x}
                  y2={targetNode.position.y}
                  stroke={isActive ? "#3b82f6" : "#6b7280"}
                  strokeWidth="2"
                  strokeDasharray={isActive ? "0" : "5,5"}
                />
                {/* Animated power flow */}
                {isActive && (
                  <circle r="3" fill="#3b82f6">
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={`M ${node.position.x} ${node.position.y} L ${targetNode.position.x} ${targetNode.position.y}`}
                    />
                  </circle>
                )}
              </g>
            )
          }),
        )}

        {/* Draw nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            onClick={() => onNodeClick?.(node)}
            style={{ cursor: "pointer" }}
            className="hover:opacity-80 transition-opacity"
          >
            {/* Node circle */}
            <circle cx={node.position.x} cy={node.position.y} r="20" fill={getNodeColor(node.status)} opacity="0.9" />

            {/* Node icon */}
            <text
              x={node.position.x}
              y={node.position.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fill="white"
            >
              {getNodeIcon(node.type)}
            </text>

            {/* Node label */}
            <text
              x={node.position.x}
              y={node.position.y + 35}
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              className="fill-foreground"
            >
              {node.name}
            </text>

            {/* Power reading */}
            <text
              x={node.position.x}
              y={node.position.y + 48}
              textAnchor="middle"
              fontSize="9"
              fill="currentColor"
              className="fill-muted-foreground"
            >
              {(node.power / 1000).toFixed(1)} kW
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-muted-foreground">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-muted-foreground">Alarm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-muted-foreground">Offline</span>
        </div>
      </div>
    </Card>
  )
}
