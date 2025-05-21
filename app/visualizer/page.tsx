"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

// Audio tracks library
const audioTracks = [
  {
    id: "electronic-ambient",
    name: "Electronic Ambient",
    artist: "Audio Library",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8a498b4.mp3",
    color: "#3a86ff",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    artist: "Audio Library",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6c1e5d7.mp3",
    color: "#ff006e",
  },
  {
    id: "cinematic",
    name: "Cinematic Atmosphere",
    artist: "Audio Library",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8a498b4.mp3", // Using same URL as placeholder
    color: "#8338ec",
  },
  {
    id: "lofi",
    name: "Lo-Fi Beats",
    artist: "Audio Library",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6c1e5d7.mp3", // Using same URL as placeholder
    color: "#fb5607",
  },
  {
    id: "ambient",
    name: "Ambient Waves",
    artist: "Audio Library",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8a498b4.mp3", // Using same URL as placeholder
    color: "#06d6a0",
  },
]

// Visual presets
const visualPresets = [
  { id: "waves", name: "Waves", description: "Smooth flowing waves" },
  { id: "particles", name: "Particles", description: "Reactive particle system" },
  { id: "spectrum", name: "Spectrum", description: "Audio spectrum visualization" },
  { id: "geometric", name: "Geometric", description: "Geometric patterns" },
  { id: "nebula", name: "Nebula", description: "Colorful nebula effect" },
]

export default function VisualizerPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const animationRef = useRef<number | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentPresetIndex, setCurrentPresetIndex] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)

  const currentTrack = audioTracks[currentTrackIndex]
  const currentPreset = visualPresets[currentPresetIndex]

  // Simple canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation function
    const animate = (time: number) => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get current color
      const color = currentTrack.color

      // Draw based on current preset
      if (currentPreset.id === "waves") {
        drawWaves(ctx, canvas.width, canvas.height, time, color, audioLevel)
      } else if (currentPreset.id === "particles") {
        drawParticles(ctx, canvas.width, canvas.height, time, color, audioLevel)
      } else if (currentPreset.id === "spectrum") {
        drawSpectrum(ctx, canvas.width, canvas.height, time, color, audioLevel)
      } else if (currentPreset.id === "geometric") {
        drawGeometric(ctx, canvas.width, canvas.height, time, color, audioLevel)
      } else if (currentPreset.id === "nebula") {
        drawNebula(ctx, canvas.width, canvas.height, time, color, audioLevel)
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [currentPreset.id, currentTrack.color, audioLevel])

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.muted = isMuted
    audio.src = currentTrack.url

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Audio playback error:", error)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }

    // Simulate audio level changes
    const interval = setInterval(() => {
      if (isPlaying) {
        // Generate a random audio level that moves smoothly
        setAudioLevel((prev) => {
          const change = (Math.random() - 0.5) * 0.1
          return Math.max(0.1, Math.min(0.9, prev + change))
        })
      }
    }, 100)

    const handleEnded = () => {
      nextTrack()
    }

    audio.addEventListener("ended", handleEnded)

    return () => {
      clearInterval(interval)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [isPlaying, isMuted, volume, currentTrack.url])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const nextTrack = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % audioTracks.length)
  }

  const prevTrack = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + audioTracks.length) % audioTracks.length)
  }

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    setIsPlaying(true)
  }

  const selectPreset = (index: number) => {
    setCurrentPresetIndex(index)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* Header with back button */}
      <div className="absolute top-0 left-0 p-4 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-white hover:text-gray-300">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar toggle */}
      <div className="absolute top-0 right-0 p-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-white hover:text-gray-300"
        >
          <List className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute top-0 right-0 h-full w-64 bg-black/80 backdrop-blur-md border-l border-gray-800 z-20"
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Queue</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Audio Tracks</h3>
                <div className="space-y-1">
                  {audioTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`p-2 rounded-md cursor-pointer flex items-center ${
                        currentTrackIndex === index ? "bg-gray-800" : "hover:bg-gray-900"
                      }`}
                      onClick={() => selectTrack(index)}
                    >
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: track.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{track.name}</div>
                        <div className="text-xs text-gray-500 truncate">{track.artist}</div>
                      </div>
                      {currentTrackIndex === index && isPlaying && (
                        <div className="w-3 h-3 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Visual Presets</h3>
                <div className="space-y-1">
                  {visualPresets.map((preset, index) => (
                    <div
                      key={preset.id}
                      className={`p-2 rounded-md cursor-pointer ${
                        currentPresetIndex === index ? "bg-gray-800" : "hover:bg-gray-900"
                      }`}
                      onClick={() => selectPreset(index)}
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-500">{preset.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-500 mb-1">Now Playing</div>
                <div className="font-medium">{currentTrack.name}</div>
                <div className="text-sm text-gray-400">{currentTrack.artist}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium">{currentTrack.name}</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:text-gray-300">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <div className="w-24">
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={prevTrack} className="text-white hover:text-gray-300">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:text-gray-300 h-12 w-12 rounded-full bg-white/10"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextTrack} className="text-white hover:text-gray-300">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Drawing functions for different visualizations
function drawWaves(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  color: string,
  audioLevel: number,
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, `${color}33`) // More transparent at top
  gradient.addColorStop(1, `${color}99`) // Less transparent at bottom

  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
  ctx.fillRect(0, 0, width, height)

  const amplitude = height * 0.1 * (0.5 + audioLevel)
  const frequency = 0.002
  const speed = time * 0.001

  ctx.beginPath()
  ctx.moveTo(0, height / 2)

  for (let x = 0; x < width; x += 5) {
    const y = height / 2 + Math.sin(x * frequency + speed) * amplitude
    ctx.lineTo(x, y)
  }

  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()

  ctx.fillStyle = gradient
  ctx.fill()
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  color: string,
  audioLevel: number,
) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
  ctx.fillRect(0, 0, width, height)

  const particleCount = 100
  const maxSize = 5 * (0.5 + audioLevel)

  for (let i = 0; i < particleCount; i++) {
    const x = width * 0.5 + Math.cos(i * 0.1 + time * 0.001) * (width * 0.4 * (0.5 + audioLevel * 0.5))
    const y = height * 0.5 + Math.sin(i * 0.1 + time * 0.001) * (height * 0.4 * (0.5 + audioLevel * 0.5))
    const size = maxSize * (0.5 + Math.sin(i * 0.05 + time * 0.002) * 0.5)

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = `${color}${Math.floor(audioLevel * 255)
      .toString(16)
      .padStart(2, "0")}`
    ctx.fill()
  }
}

function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  color: string,
  audioLevel: number,
) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
  ctx.fillRect(0, 0, width, height)

  const barCount = 64
  const barWidth = width / barCount
  const maxBarHeight = height * 0.7

  for (let i = 0; i < barCount; i++) {
    // Simulate spectrum data
    const barHeight = maxBarHeight * (0.2 + audioLevel * Math.sin(i * 0.1 + time * 0.001) * 0.5)

    const x = i * barWidth
    const y = height - barHeight

    ctx.fillStyle = `${color}${Math.floor((i / barCount) * 255)
      .toString(16)
      .padStart(2, "0")}`
    ctx.fillRect(x, y, barWidth - 1, barHeight)
  }
}

function drawGeometric(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  color: string,
  audioLevel: number,
) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
  ctx.fillRect(0, 0, width, height)

  const centerX = width / 2
  const centerY = height / 2
  const size = Math.min(width, height) * 0.3 * (0.5 + audioLevel * 0.5)
  const sides = 6
  const rotation = time * 0.0005

  ctx.beginPath()
  for (let i = 0; i < sides; i++) {
    const angle = rotation + i * ((Math.PI * 2) / sides)
    const x = centerX + Math.cos(angle) * size
    const y = centerY + Math.sin(angle) * size

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.closePath()

  ctx.strokeStyle = `${color}${Math.floor(audioLevel * 255)
    .toString(16)
    .padStart(2, "0")}`
  ctx.lineWidth = 2 + audioLevel * 3
  ctx.stroke()

  // Inner shape
  ctx.beginPath()
  for (let i = 0; i < sides; i++) {
    const angle = -rotation + i * ((Math.PI * 2) / sides)
    const x = centerX + Math.cos(angle) * size * 0.5
    const y = centerY + Math.sin(angle) * size * 0.5

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.closePath()

  ctx.strokeStyle = `${color}aa`
  ctx.lineWidth = 1 + audioLevel * 2
  ctx.stroke()
}

function drawNebula(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  color: string,
  audioLevel: number,
) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
  ctx.fillRect(0, 0, width, height)

  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.4 * (0.5 + audioLevel * 0.5)

  // Create gradient
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  gradient.addColorStop(0, `${color}ff`)
  gradient.addColorStop(0.5, `${color}66`)
  gradient.addColorStop(1, `${color}00`)

  // Draw nebula cloud
  for (let i = 0; i < 10; i++) {
    const angle = time * 0.0001 + (i * Math.PI) / 5
    const x = centerX + Math.cos(angle) * radius * 0.5
    const y = centerY + Math.sin(angle) * radius * 0.5
    const size = radius * (0.3 + audioLevel * 0.3) * (0.5 + Math.sin(i + time * 0.001) * 0.5)

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.globalAlpha = 0.1 + audioLevel * 0.1
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // Draw stars
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = 1 + Math.random() * 2 * audioLevel

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = "white"
    ctx.fill()
  }
}
