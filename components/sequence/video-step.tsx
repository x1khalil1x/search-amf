"use client"
import VideoViewer from "@/components/video-viewer"

interface VideoStepProps {
  title: string
  videoUrl: string
  isPlaying: boolean
}

export default function VideoStep({ title, videoUrl, isPlaying }: VideoStepProps) {
  return (
    <div className="relative w-full h-screen bg-black flex flex-col">
      {/* Video */}
      <div className="relative flex-1 bg-black flex items-center justify-center">
        <VideoViewer src={videoUrl} autoPlay={isPlaying} aspectRatio="16:9" />
      </div>

      {/* Optional title overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="text-gray-400 text-sm mt-1">
            {Math.floor(Math.random() * 10) + 1}.{Math.floor(Math.random() * 10)}M views • Released{" "}
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}
