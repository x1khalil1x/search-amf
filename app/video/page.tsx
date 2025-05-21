"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Share2, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import CustomCursor from "@/components/custom-cursor"

export default function VideoPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showControls, setShowControls] = useState(true)

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
      setShowControls(true)

      // Hide controls after 3 seconds of inactivity
      const timer = setTimeout(() => {
        setShowControls(false)
      }, 3000)

      return () => clearTimeout(timer)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Auto-play video after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Update video time
  useEffect(() => {
    const updateTime = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime)
        setDuration(videoRef.current.duration || 0)
      }
    }

    const video = videoRef.current
    video?.addEventListener("timeupdate", updateTime)
    video?.addEventListener("loadedmetadata", updateTime)

    return () => {
      video?.removeEventListener("timeupdate", updateTime)
      video?.removeEventListener("loadedmetadata", updateTime)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <CustomCursor position={cursorPosition} />

      <div className="relative w-full h-screen flex flex-col">
        {/* Video */}
        <div className="relative flex-1 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            className="max-h-full max-w-full"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Play/Pause overlay */}
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <div className="rounded-full bg-white/20 p-6">
                <Play className="h-16 w-16 text-white" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-2">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
              />
            </div>

            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <div className="text-sm mx-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white">
                  <ThumbsUp className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white">
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-xl font-bold">Daft Punk - Around The World (Official Video)</h1>
              <div className="text-gray-400 text-sm mt-1">10.2M views • Released Sep 12, 1997</div>
            </div>
          </div>
        </motion.div>

        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-white z-10"
          onClick={() => router.push("/results")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
