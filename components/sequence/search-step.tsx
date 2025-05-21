"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchStepProps {
  query: string
  typingSpeed: number
  showPredictions: boolean
  predictions: string[]
  isPlaying: boolean
}

export default function SearchStep({
  query,
  typingSpeed = 100,
  showPredictions = true,
  predictions = [],
  isPlaying,
}: SearchStepProps) {
  const [searchText, setSearchText] = useState("")
  const [displayPredictions, setDisplayPredictions] = useState(false)

  // Simulate typing
  useEffect(() => {
    if (!isPlaying) return

    let currentIndex = 0
    setSearchText("")
    setDisplayPredictions(false)

    const typingInterval = setInterval(() => {
      if (currentIndex < query.length) {
        setSearchText(query.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        if (showPredictions) {
          setTimeout(() => {
            setDisplayPredictions(true)
          }, 500)
        }
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [query, typingSpeed, showPredictions, isPlaying])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter">MusicFinder</h1>
        </div>

        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchText}
              readOnly
              className="w-full pl-10 pr-4 py-6 bg-gray-900 border-gray-800 text-white text-lg rounded-full focus:ring-gray-700"
              placeholder="Search for music videos..."
            />
          </div>

          {displayPredictions && predictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute w-full mt-2 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden z-10"
            >
              {predictions.map((prediction, index) => (
                <div key={index} className="flex items-center px-4 py-3 hover:bg-gray-800 cursor-pointer">
                  <Search className="mr-2 text-gray-400 h-4 w-4" />
                  <span>{prediction}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
