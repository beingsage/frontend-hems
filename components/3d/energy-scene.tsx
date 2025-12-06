"use client"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Html, Environment, Grid } from "@react-three/drei"
import type { Device, DeviceType, ConsumptionLevel } from "@/lib/data"
import * as THREE from "three"

interface DeviceMarkerProps {
  device: Device
  onClick: (device: Device) => void
  isSelected: boolean
}

function DeviceMarker({ device, onClick, isSelected }: DeviceMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Color based on consumption level
  const color = useMemo(() => {
    if (device.status === "error") return "#ef4444"
    if (device.status === "warning") return "#f59e0b"

    switch (device.consumption.level) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#3b82f6"
    }
  }, [device.consumption.level, device.status])

  // Pulse animation for anomalies
  useFrame((state) => {
    if (meshRef.current && device.anomalyDetected) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
    }
  })

  // Icon shape based on device type
  const geometry = useMemo(() => {
    switch (device.type) {
      case "ac":
      case "hvac":
        return <boxGeometry args={[0.5, 0.5, 0.5]} />
      case "light":
        return <sphereGeometry args={[0.3, 16, 16]} />
      case "server":
        return <boxGeometry args={[0.4, 0.6, 0.4]} />
      default:
        return <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />
    }
  }, [device.type])

  if (!device.location?.position) {
    console.log("[v0] Device missing position:", device.id)
    return null
  }

  return (
    <group position={[device.location.position.x, device.location.position.y, device.location.position.z]}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(device)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {geometry}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.5 : 0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Energy flow indicator */}
      {device.status === "online" && (
        <mesh position={[0, 0.8, 0]}>
          <coneGeometry args={[0.1, 0.2, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Hover label */}
      {hovered && (
        <Html distanceFactor={10} position={[0, 1, 0]}>
          <div className="bg-card border border-border rounded-lg p-2 shadow-lg min-w-[200px]">
            <p className="font-semibold text-foreground text-sm">{device.name}</p>
            <p className="text-xs text-muted-foreground">{device.location.room}</p>
            <p className="text-xs text-foreground mt-1">{device.consumption.current}W</p>
          </div>
        </Html>
      )}
    </group>
  )
}

interface RoomBoxProps {
  room: {
    name: string
    position: [number, number, number]
    size: [number, number, number]
    floor: number
  }
  opacity: number
}

function RoomBox({ room, opacity }: RoomBoxProps) {
  return (
    <group position={room.position}>
      <mesh>
        <boxGeometry args={room.size} />
        <meshStandardMaterial color="#1e293b" transparent opacity={opacity} wireframe={false} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...room.size)]} />
        <lineBasicMaterial color="#475569" />
      </lineSegments>

      <Html distanceFactor={20} position={[0, room.size[1] / 2 + 0.5, 0]}>
        <div className="text-xs text-muted-foreground font-medium whitespace-nowrap">{room.name}</div>
      </Html>
    </group>
  )
}

interface EnergySceneProps {
  devices: Device[]
  selectedDevice: Device | null
  onDeviceClick: (device: Device) => void
  filterType: DeviceType | "all"
  filterLevel: ConsumptionLevel | "all"
  showRooms: boolean
}

export function EnergyScene({
  devices,
  selectedDevice,
  onDeviceClick,
  filterType,
  filterLevel,
  showRooms,
}: EnergySceneProps) {
  // Define rooms for Building A
  const rooms = useMemo(
    () => [
      // Floor 1
      {
        name: "Main Hall",
        position: [10, 1.5, 10] as [number, number, number],
        size: [20, 3, 20] as [number, number, number],
        floor: 1,
      },
      {
        name: "Reception",
        position: [2, 1, 2] as [number, number, number],
        size: [4, 2, 4] as [number, number, number],
        floor: 1,
      },
      // Floor 2
      {
        name: "Lab 201",
        position: [8, 5, 8] as [number, number, number],
        size: [12, 3, 12] as [number, number, number],
        floor: 2,
      },
      {
        name: "Office 202",
        position: [18, 5, 5] as [number, number, number],
        size: [8, 3, 6] as [number, number, number],
        floor: 2,
      },
    ],
    [],
  )

  // Filter devices
  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      if (filterType !== "all" && device.type !== filterType) return false
      if (filterLevel !== "all" && device.consumption.level !== filterLevel) return false
      return true
    })
  }, [devices, filterType, filterLevel])

  return (
    <Canvas className="w-full h-full">
      <PerspectiveCamera makeDefault position={[30, 20, 30]} fov={60} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={10}
        maxDistance={100}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#3b82f6" />

      {/* Environment */}
      <Environment preset="night" />

      {/* Ground Grid */}
      <Grid
        args={[100, 100]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#334155"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={80}
        fadeStrength={1}
        position={[0, 0, 0]}
      />

      {/* Floor planes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.5} />
      </mesh>

      {/* Rooms */}
      {showRooms && rooms.map((room, index) => <RoomBox key={index} room={room} opacity={0.1} />)}

      {/* Device Markers */}
      {filteredDevices.map((device) => (
        <DeviceMarker
          key={device.id}
          device={device}
          onClick={onDeviceClick}
          isSelected={selectedDevice?.id === device.id}
        />
      ))}

      {/* Building labels */}
      <Html position={[10, 8, 10]} distanceFactor={30}>
        <div className="text-lg font-bold text-primary">Building A</div>
      </Html>
    </Canvas>
  )
}
