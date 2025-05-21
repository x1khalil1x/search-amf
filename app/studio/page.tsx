"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, ChevronUp, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import VideoViewer from "@/components/video-viewer"

// Sample video library
const videoLibrary = [
  {
    id: "elephants-dream",
    title: "Elephants Dream",
    description: "Open source animated short film",
    thumbnail: "/placeholder.svg?height=180&width=320",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "10:54",
    date: "2023-11-15",
  },
  {
    id: "big-buck-bunny",
    title: "Big Buck Bunny",
    description: "Open source animated short film",
    thumbnail: "/placeholder.svg?height=180&width=320",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "9:56",
    date: "2023-10-22",
  },
  {
    id: "sintel",
    title: "Sintel",
    description: "Open source animated short film",
    thumbnail: "/placeholder.svg?height=180&width=320",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    duration: "14:48",
    date: "2023-09-30",
  },
  {
    id: "tears-of-steel",
    title: "Tears of Steel",
    description: "Open source sci-fi short film",
    thumbnail: "/placeholder.svg?height=180&width=320",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: "12:14",
    date: "2023-08-17",
  },
  {
    id: "cosmos-laundromat",
    title: "Cosmos Laundromat",
    description: "Open source animated short film",
    thumbnail: "/placeholder.svg?height=180&width=320",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Using Elephants Dream as placeholder
    duration: "12:30",
    date: "2023-07-05",
  },
]

export default function StudioPage() {
  const router = useRouter()
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "21:9" | "4:3" | "1:1">("16:9")
  const [currentVideoId, setCurrentVideoId] = useState("elephants-dream")
  const [showBrowser, setShowBrowser] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get current video data
  const currentVideo = videoLibrary.find((video) => video.id === currentVideoId) || videoLibrary[0]

  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    setShowControls(true)

    // Hide controls after 3 seconds of inactivity
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    return () => clearTimeout(timer)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col" onMouseMove={handleMouseMove} ref={containerRef}>
      {/* Header with back button */}
      <div className="p-4 flex justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-gray-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Navigation */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => router.push("/visualizer")}
          >
            Visualizer
          </Button>
        </div>
      </div>

      {/* Video container */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className={`w-full max-w-screen-xl ${aspectRatio === "21:9" ? "max-h-[80vh]" : "max-h-[90vh]"}`}>
          <VideoViewer src={currentVideo.src} aspectRatio={aspectRatio} autoPlay={true} loop={false} />
        </div>

        {/* Video title overlay */}
        <div className="absolute top-8 left-8 max-w-md">
          <h1 className="text-2xl font-bold">{currentVideo.title}</h1>
          <p className="text-gray-400 mt-1">{currentVideo.description}</p>
        </div>

        {/* Browser toggle button */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls || showBrowser ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBrowser(!showBrowser)}
            className="bg-black bg-opacity-50 border-gray-800 hover:bg-opacity-70 rounded-xl"
          >
            {showBrowser ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronUp className="h-4 w-4 mr-2" />}
            {showBrowser ? "Hide Library" : "Browse Library"}
          </Button>
        </motion.div>
      </div>

      {/* Video browser/carousel */}
      <AnimatePresence>
        {showBrowser && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black bg-opacity-90 border-t border-gray-800 overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-lg font-medium mb-4">Video Library</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {videoLibrary.map((video) => (
                  <div
                    key={video.id}
                    className={`cursor-pointer group ${video.id === currentVideoId ? "ring-2 ring-white" : ""}`}
                    onClick={() => {
                      setCurrentVideoId(video.id)
                      setShowBrowser(false)
                    }}
                  >
                    <div className="aspect-video bg-gray-800 rounded-md overflow-hidden relative">
                      {/* Placeholder for thumbnail */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-600">
                        {video.title.charAt(0).toUpperCase()}
                      </div>

                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="h-10 w-10 text-white" />
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium truncate">{video.title}</h3>
                      <p className="text-xs text-gray-400">{video.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aspect ratio controls */}
      <motion.div
        className="p-2 flex justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 rounded-xl text-gray-500 ${aspectRatio === "16:9" ? "bg-opacity-70" : ""}`}
          onClick={() => setAspectRatio("16:9")}
        >
          16:9
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 rounded-xl text-gray-500 ${aspectRatio === "21:9" ? "bg-opacity-70" : ""}`}
          onClick={() => setAspectRatio("21:9")}
        >
          21:9
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 rounded-xl text-gray-500 ${aspectRatio === "4:3" ? "bg-opacity-70" : ""}`}
          onClick={() => setAspectRatio("4:3")}
        >
          4:3
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 rounded-xl text-gray-500 ${aspectRatio === "1:1" ? "bg-opacity-70" : ""}`}
          onClick={() => setAspectRatio("1:1")}
        >
          1:1
        </Button>
      </motion.div>
    </div>
  )
}
