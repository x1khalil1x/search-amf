"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import VideoViewer from "@/components/video-viewer"

export default function VideoExamplePage() {
  const router = useRouter()
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "21:9" | "4:3" | "1:1">("16:9")

  // Example video sources
  const videoSources = {
    sample: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    nature: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    sintel: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  }

  const [currentVideo, setCurrentVideo] = useState("sample")

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header with back button */}
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-gray-400 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Video container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={`w-full max-w-screen-xl ${aspectRatio === "21:9" ? "max-h-[80vh]" : "max-h-[90vh]"}`}>
          <VideoViewer
            src={videoSources[currentVideo as keyof typeof videoSources]}
            aspectRatio={aspectRatio}
            autoPlay={true}
            loop={false}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 ${aspectRatio === "16:9" ? "bg-opacity-70" : ""}`}
          onClick={() => setAspectRatio("16:9")}
        >
          16:9 Standard
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 ${aspectRatio === "21:9" ? "bg-opacity-70" : ""}`}
          onClick={() => setAspectRatio("21:9")}
        >
          21:9 Ultrawide
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 ${aspectRatio === "4:3" ? "bg-opacity-70" : ""}`}
          onClick={() => setAspectRatio("4:3")}
        >
          4:3 Classic
        </Button>

        <div className="w-full h-0 my-2" />

        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 ${currentVideo === "sample" ? "bg-opacity-70" : ""}`}
          onClick={() => setCurrentVideo("sample")}
        >
          Video 1
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 ${currentVideo === "nature" ? "bg-opacity-70" : ""}`}
          onClick={() => setCurrentVideo("nature")}
        >
          Video 2
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`bg-black bg-opacity-50 border-gray-800 ${currentVideo === "sintel" ? "bg-opacity-70" : ""}`}
          onClick={() => setCurrentVideo("sintel")}
        >
          Video 3
        </Button>
      </div>
    </div>
  )
}
