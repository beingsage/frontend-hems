"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Text, Html } from "@react-three/drei"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type * as THREE from "three"

interface BuildingDigitalTwinProps {
  building: string
  floor: string
}

function ElectricalPanel({ position, label, load, status }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current && status === "warning") {
      meshRef.current.rotation.y += 0.01
    }
  })

  const color =
    status === "critical" ? "#ef4444" : status === "warning" ? "#f59e0b" : status === "normal" ? "#10b981" : "#6b7280"

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[0.5, 0.8, 0.2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {hovered && (
        <Html position={[0, 1, 0]} center>
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[200px]">
            <p className="font-semibold text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">Load: {load}%</p>
            <p className="text-sm text-muted-foreground">Status: {status}</p>
          </div>
        </Html>
      )}
      <Text position={[0, -0.6, 0]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  )
}

function BuildingFloor({ floorNumber, panels }: any) {
  return (
    <group position={[0, floorNumber * 3, 0]}>
      {/* Floor slab */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[10, 0.1, 8]} />
        <meshStandardMaterial color="#374151" transparent opacity={0.3} />
      </mesh>

      {/* Electrical panels */}
      {panels.map((panel: any, index: number) => (
        <ElectricalPanel
          key={index}
          position={panel.position}
          label={panel.label}
          load={panel.load}
          status={panel.status}
        />
      ))}

      {/* Floor label */}
      <Text position={[-5.5, 0.5, 0]} fontSize={0.3} color="white" anchorX="left">
        Floor {floorNumber}
      </Text>
    </group>
  )
}

function BuildingStructure() {
  const floors = [
    {
      number: 1,
      panels: [
        { position: [-3, 0.5, 2], label: "Panel 1A", load: 78, status: "normal" },
        { position: [0, 0.5, 2], label: "Panel 1B", load: 92, status: "warning" },
        { position: [3, 0.5, 2], label: "Panel 1C", load: 65, status: "normal" },
      ],
    },
    {
      number: 2,
      panels: [
        { position: [-3, 0.5, 2], label: "Panel 2A", load: 85, status: "normal" },
        { position: [0, 0.5, 2], label: "Panel 2B", load: 98, status: "critical" },
        { position: [3, 0.5, 2], label: "Panel 2C", load: 72, status: "normal" },
      ],
    },
    {
      number: 3,
      panels: [
        { position: [-3, 0.5, 2], label: "Panel 3A", load: 68, status: "normal" },
        { position: [0, 0.5, 2], label: "Panel 3B", load: 75, status: "normal" },
        { position: [3, 0.5, 2], label: "Panel 3C", load: 88, status: "warning" },
      ],
    },
  ]

  return (
    <>
      {floors.map((floor) => (
        <BuildingFloor key={floor.number} floorNumber={floor.number} panels={floor.panels} />
      ))}
    </>
  )
}

export function BuildingDigitalTwin({ building, floor }: BuildingDigitalTwinProps) {
  const [viewMode, setViewMode] = useState("3d")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>3D Digital Twin Visualization</CardTitle>
              <CardDescription>Interactive 3D model of building electrical infrastructure</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3d">3D View</SelectItem>
                  <SelectItem value="single-line">Single Line</SelectItem>
                  <SelectItem value="schematic">Schematic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] bg-secondary rounded-lg overflow-hidden">
            <Canvas>
              <PerspectiveCamera makeDefault position={[15, 8, 15]} />
              <OrbitControls enablePan enableZoom enableRotate />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />
              <BuildingStructure />
              <gridHelper args={[20, 20, "#444", "#222"]} />
            </Canvas>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#10b981]" />
              <span className="text-sm text-foreground">Normal (0-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#f59e0b]" />
              <span className="text-sm text-foreground">Warning (80-95%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#ef4444]" />
              <span className="text-sm text-foreground">Critical (95-100%)</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Controls:</strong> Left click + drag to rotate • Right click + drag to pan • Scroll to zoom •
              Hover over panels for details
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
