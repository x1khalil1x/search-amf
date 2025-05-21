"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, ArrowLeft, Play, ImageIcon, FileText, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ResultsStepProps {
  query: string
  results: any[]
  isPlaying: boolean
}

export default function ResultsStep({ query, results = [], isPlaying }: ResultsStepProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedResult, setSelectedResult] = useState<number | null>(null)

  // Simulate result selection if playing
  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      if (results.length > 0) {
        setSelectedResult(0)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [isPlaying, results.length])

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={query}
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
          <div className="text-sm text-gray-400 mb-2">
            About {Math.floor(Math.random() * 1000000) + 100000} results ({(Math.random() * 0.9 + 0.1).toFixed(2)}{" "}
            seconds)
          </div>

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
              onClick={() => setSelectedResult(index)}
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

          {results.length === 0 && <div className="text-center py-12 text-gray-500">No results found</div>}
        </div>
      </div>
    </div>
  )
}
