"use client"

import { useEffect, useRef } from "react"

interface MascotAvatarProps {
  isThinking?: boolean
  isSpeaking?: boolean
}

export function MascotAvatar({ isThinking = false, isSpeaking = false }: MascotAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.05

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw mascot body (energy bolt shape)
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)

      // Pulsing effect when thinking or speaking
      const scale = isSpeaking ? 1 + Math.sin(time * 8) * 0.1 : isThinking ? 1 + Math.sin(time * 2) * 0.05 : 1

      ctx.scale(scale, scale)

      // Main body - lightning bolt
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.moveTo(0, -40)
      ctx.lineTo(15, -10)
      ctx.lineTo(5, -5)
      ctx.lineTo(20, 30)
      ctx.lineTo(-5, 5)
      ctx.lineTo(5, 0)
      ctx.lineTo(-15, -30)
      ctx.closePath()
      ctx.fill()

      // Glow effect
      ctx.shadowBlur = 20
      ctx.shadowColor = "#3b82f6"
      ctx.fill()
      ctx.shadowBlur = 0

      // Eyes
      const eyeOffset = isSpeaking ? Math.sin(time * 10) * 2 : 0
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(-8, -15 + eyeOffset, 4, 0, Math.PI * 2)
      ctx.arc(8, -15 + eyeOffset, 4, 0, Math.PI * 2)
      ctx.fill()

      // Pupils
      ctx.fillStyle = "#0f172a"
      ctx.beginPath()
      ctx.arc(-8, -15 + eyeOffset, 2, 0, Math.PI * 2)
      ctx.arc(8, -15 + eyeOffset, 2, 0, Math.PI * 2)
      ctx.fill()

      // Mouth
      if (isSpeaking) {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(0, -5, 6, 0, Math.PI)
        ctx.stroke()
      } else {
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(0, -5, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Energy particles when thinking
      if (isThinking) {
        for (let i = 0; i < 3; i++) {
          const angle = time + (i * Math.PI * 2) / 3
          const radius = 50
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius

          ctx.fillStyle = "#3b82f6"
          ctx.globalAlpha = 0.6
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      ctx.restore()

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isThinking, isSpeaking])

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={120} height={120} className="w-full h-full" />
    </div>
  )
}
