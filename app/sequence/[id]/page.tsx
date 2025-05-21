"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Play, Pause, SkipForward, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import CustomCursor from "@/components/custom-cursor"
import SearchStep from "@/components/sequence/search-step"
import ResultsStep from "@/components/sequence/results-step"
import VideoStep from "@/components/sequence/video-step"

export default function SequencePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [sequence, setSequence] = useState<any>({
    title: "Daft Punk Classics",
    description: "Explore the iconic music videos of Daft Punk",
    steps: [
      {
        id: "step1",
        type: "search",
        content: "daft punk around the world",
        duration: 3000,
        typingSpeed: 100,
        showPredictions: true,
        predictions: [
          "daft punk around the world lyrics",
          "daft punk around the world video",
          "daft punk around the world sample",
          "daft punk around the world remix",
        ],
      },
      {
        id: "step2",
        type: "results",
        content: "daft punk around the world video",
        duration: 4000,
        results: [
          {
            type: "video",
            title: "Daft Punk - Around The World (Official Video)",
            thumbnail: "/placeholder.svg?height=180&width=320",
            description: "Official music video for 'Around The World' by Daft Punk",
            duration: "3:58",
          },
          {
            type: "video",
            title: "Daft Punk - Around The World (Live)",
            thumbnail: "/placeholder.svg?height=180&width=320",
            description: "Live performance from Alive 2007",
            duration: "5:43",
          },
        ],
      },
      {
        id: "step3",
        type: "video",
        content: "Daft Punk - Around The World (Official Video)",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        duration: 10000,
      },
    ],
  })
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showControls, setShowControls] = useState(false)
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
      setShowControls(true)

      // Hide controls after 3 seconds of inactivity
      const timer = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)

      return () => clearTimeout(timer)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isPlaying])

  // Handle step transitions
  useEffect(() => {
    if (!isPlaying) return

    const currentStep = sequence.steps[currentStepIndex]
    if (!currentStep) return

    // Clear any existing timers
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current)
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    // Reset progress
    setProgress(0)

    // Set up progress interval
    const duration = currentStep.duration
    const interval = 50 // Update progress every 50ms
    const steps = duration / interval
    let currentProgress = 0

    progressIntervalRef.current = setInterval(() => {
      currentProgress += 100 / steps
      setProgress(Math.min(currentProgress, 100))

      if (currentProgress >= 100) {
        clearInterval(progressIntervalRef.current!)
      }
    }, interval)

    // Set up step transition timer
    stepTimerRef.current = setTimeout(() => {
      if (currentStepIndex < sequence.steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
      } else {
        // End of sequence
        setIsPlaying(false)
      }
    }, duration)

    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [currentStepIndex, isPlaying, sequence.steps])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const nextStep = () => {
    if (currentStepIndex < sequence.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const restartSequence = () => {
    setCurrentStepIndex(0)
    setIsPlaying(true)
  }

  const currentStep = sequence.steps[currentStepIndex]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <CustomCursor position={cursorPosition} />

      {/* Current Step */}
      <div className="relative w-full h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {currentStep?.type === "search" && (
              <SearchStep
                query={currentStep.content}
                typingSpeed={currentStep.typingSpeed}
                showPredictions={currentStep.showPredictions}
                predictions={currentStep.predictions}
                isPlaying={isPlaying}
              />
            )}

            {currentStep?.type === "results" && (
              <ResultsStep query={currentStep.content} results={currentStep.results} isPlaying={isPlaying} />
            )}

            {currentStep?.type === "video" && (
              <VideoStep title={currentStep.content} videoUrl={currentStep.videoUrl} isPlaying={isPlaying} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showControls || !isPlaying ? 1 : 0, y: showControls || !isPlaying ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
        >
          <div className="max-w-6xl mx-auto">
            <Progress value={progress} className="h-1 mb-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={togglePlayPause} className="text-white">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextStep}
                  disabled={currentStepIndex >= sequence.steps.length - 1}
                  className="text-white"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={restartSequence} className="text-white">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-sm">
                Step {currentStepIndex + 1} of {sequence.steps.length}
              </div>

              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
