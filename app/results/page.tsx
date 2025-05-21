"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, ArrowLeft, Play, ImageIcon, FileText, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomCursor from "@/components/custom-cursor"

export default function ResultsPage() {
  const router = useRouter()
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState("all")
  const [selectedResult, setSelectedResult] = useState<number | null>(null)

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // This will only handle selection when a user clicks, without automatic navigation
  const handleResultClick = (index: number, type: string) => {
    setSelectedResult(index)

    // Only navigate to video page if it's a video result and user clicks
    if (type === "video") {
      setTimeout(() => router.push("/video"), 500)
    }
  }

  const results = [
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
    {
      type: "image",
      title: "Daft Punk Around The World Album Cover",
      thumbnail: "/placeholder.svg?height=180&width=180",
      description: "High resolution album artwork",
    },
    {
      type: "text",
      title: "Around The World Lyrics - Daft Punk",
      description: "Complete lyrics and meaning behind the song",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <CustomCursor position={cursorPosition} />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value="daft punk around the world video"
              readOnly
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border-gray-800 text-white rounded-full focus:ring-gray-700"
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6">
          <div className="text-sm text-gray-400 mb-2">About 1,240,000 results (0.42 seconds)</div>

          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: selectedResult === index ? 1.02 : 1,
                boxShadow: selectedResult === index ? "0 0 0 2px rgba(255,255,255,0.2)" : "none",
              }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`p-4 rounded-lg ${selectedResult === index ? "bg-gray-800" : "bg-gray-900"} hover:bg-gray-800 cursor-pointer`}
              onClick={() => handleResultClick(index, result.type)}
            >
              <div className="flex gap-4">
                {result.thumbnail && (
                  <div className="relative flex-shrink-0">
                    <Image
                      src={result.thumbnail || "/placeholder.svg"}
                      width={result.type === "image" ? 180 : 320}
                      height={180}
                      alt={result.title}
                      className="rounded-md"
                    />
                    {result.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    )}
                    {result.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {result.duration}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {result.type === "video" && <Video className="h-4 w-4 text-gray-400" />}
                    {result.type === "image" && <ImageIcon className="h-4 w-4 text-gray-400" />}
                    {result.type === "text" && <FileText className="h-4 w-4 text-gray-400" />}
                    <span className="text-xs text-gray-400">{result.type.toUpperCase()}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{result.title}</h3>
                  <p className="text-gray-400">{result.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
