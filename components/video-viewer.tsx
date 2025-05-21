"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoViewerProps {
  src: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  onEnded?: () => void
  aspectRatio?: "16:9" | "21:9" | "4:3" | "1:1"
}

export default function VideoViewer({
  src,
  autoPlay = true,
  loop = false,
  muted = false,
  onEnded,
  aspectRatio = "16:9",
}: VideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [showControls, setShowControls] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set aspect ratio
  const aspectRatioClass = {
    "16:9": "aspect-video", // 16:9
    "21:9": "aspect-[21/9]", // 21:9 ultrawide
    "4:3": "aspect-[4/3]", // 4:3 classic
    "1:1": "aspect-square", // 1:1 square
  }[aspectRatio]

  // Handle play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error)
          setIsPlaying(false)
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  // Handle mute/unmute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  // Handle controls visibility
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden" onClick={togglePlay}>
      {/* Video */}
      <div className="flex items-center justify-center h-full">
        <video
          ref={videoRef}
          src={src}
          className={`max-h-full max-w-full ${aspectRatioClass}`}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          onEnded={onEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Play/Pause overlay (only shows when paused) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="rounded-full bg-white/20 p-6"
            >
              <Play className="h-16 w-16 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay()
                }}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMute()
                }}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>

              <div className="flex-1" />

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFullscreen()
                }}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isFullscreen ? (
                    <>
                      <path d="M8 3v4a1 1 0 0 1-1 1H3" />
                      <path d="M21 8h-4a1 1 0 0 1-1-1V3" />
                      <path d="M3 16h4a1 1 0 0 1 1 1v4" />
                      <path d="M16 21v-4a1 1 0 0 1 1-1h4" />
                    </>
                  ) : (
                    <>
                      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
