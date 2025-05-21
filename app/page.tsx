"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Film, AudioWaveformIcon as Waveform, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define premade sequences that will be linked from the pills
const premadeSequences = [
  {
    id: "daft-punk",
    title: "Daft Punk",
    description: "Explore the iconic music videos of Daft Punk",
  },
  {
    id: "90s-music-videos",
    title: "90s Music Videos",
    description: "A journey through the best music videos of the 90s",
  },
  {
    id: "mal-sounds-bridge",
    title: "mal sounds bridge portraits",
    description: "Exploring sound portraits from the bridge",
  },
  {
    id: "portofino-flights",
    title: "Portofino flights",
    description: "Scenic flights over Portofino",
  },
  {
    id: "where-is-bahia",
    title: "where is Bahia",
    description: "Discovering the beautiful region of Bahia",
  },
  {
    id: "next-f1-race",
    title: "next F1 race where",
    description: "Information about upcoming Formula 1 races",
  },
  {
    id: "indie-artists",
    title: "Indie Artists",
    description: "Discover emerging indie artists and their work",
  },
  {
    id: "electronic-music",
    title: "Electronic Music",
    description: "Electronic music videos and performances",
  },
  {
    id: "hip-hop-classics",
    title: "Hip Hop Classics",
    description: "Classic hip hop music videos",
  },
  {
    id: "new-wave",
    title: "New Wave",
    description: "New wave music from the 80s",
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchText, setSearchText] = useState("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [clonedItems, setClonedItems] = useState<React.ReactNode[]>([])
  const [isScrolling, setIsScrolling] = useState(true)

  // Create pill elements
  const createPillElement = (sequence: (typeof premadeSequences)[0], index: number) => (
    <Button
      key={`${sequence.id}-${index}`}
      variant="outline"
      size="sm"
      className="dynamic-pill flex-shrink-0 bg-black bg-opacity-50 border-gray-800 hover:bg-opacity-70 rounded-xl text-sm text-gray-500 font-normal opacity-50 hover:opacity-100 transition-opacity"
      onClick={() => handlePillClick(sequence.id)}
    >
      <Search className="h-3 w-3 mr-2" />
      {sequence.title}
    </Button>
  )

  // Improved smooth scrolling effect for the pills
  useEffect(() => {
    if (!isScrolling) return

    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    // Create initial pills
    const initialPills = premadeSequences.map((sequence, index) => createPillElement(sequence, index))

    // Clone the first few items and add them to the end for seamless looping
    const clonesToAdd = premadeSequences
      .slice(0, 3)
      .map((sequence, index) => createPillElement(sequence, index + premadeSequences.length))

    setClonedItems([...initialPills, ...clonesToAdd])

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame

    const scroll = () => {
      if (!scrollContainer) return
      if (!scrollContainer.children.length) return

      scrollPosition += scrollSpeed

      // When we've scrolled past the first item, reset to the beginning
      if (scrollContainer.children[0] && scrollPosition >= scrollContainer.children[0].clientWidth + 8) {
        // 8px for gap
        // Move the first item to the end
        scrollPosition = 0

        // Update the cloned items array by moving the first item to the end
        setClonedItems((prev) => {
          const newItems = [...prev]
          const firstItem = newItems.shift()
          if (firstItem) newItems.push(firstItem)
          return newItems
        })
      }

      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isScrolling])

  // Handle pill click to navigate to the sequence
  const handlePillClick = (sequenceId: string) => {
    router.push(`/sequence/${sequenceId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 relative">
      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col items-center"
        >
          {/* Logo */}
          <div className="mb-6 w-6 h-9">
            <Image src="/images/amf-logo.svg" alt="AMF Logo" width={64} height={96} />
          </div>

          <div className="flex items-center justify-center mb-8">
            <h1 className="text-xl font-light tracking-wider text-gray-300">search.amf</h1>
          </div>

          <div className="relative w-4/5">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <Input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchText) {
                    router.push(`/results?q=${encodeURIComponent(searchText)}`)
                  }
                }}
                className="w-full pl-10 pr-4 py-6 bg-black border-gray-800 text-gray-300 text-lg rounded-xl focus:ring-gray-700 font-light tracking-wide"
                placeholder="Search..."
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Previous Searches - Scrolling Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8 w-full overflow-hidden"
      >
        <div className="flex items-center">
          {/* Icon-only buttons on the left */}
          <div className="flex-shrink-0 flex gap-3 mr-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 opacity-50 hover:opacity-100 transition-opacity"
              onClick={() => router.push("/studio")}
              aria-label="Studio"
            >
              <Film className="h-5 w-5 animate-pulse" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 opacity-50 hover:opacity-100 transition-opacity"
              onClick={() => router.push("/visualizer")}
              aria-label="Visualizer"
            >
              <Waveform className="h-5 w-5 animate-pulse" />
            </motion.button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 opacity-50 hover:opacity-100 transition-opacity z-10"
                  aria-label="More"
                >
                  <Menu className="h-5 w-5" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-black border-gray-800 text-white z-50">
                <DropdownMenuItem
                  className="hover:bg-gray-900 cursor-pointer"
                  onClick={() => window.open("https://amf-newsletter.allmyfriends.ent.com", "_blank")}
                >
                  AMF Newsletter
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-900 cursor-pointer"
                  onClick={() => window.open("https://sports-tracker.allmyfriends.ent.com", "_blank")}
                >
                  Sports Tracker
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-900 cursor-pointer"
                  onClick={() => window.open("https://plugin-guide.allmyfriends.ent.com", "_blank")}
                >
                  Plugin Guide
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Divider */}
          <div className="h-5 border-r border-gray-800 mx-2"></div>

          {/* Scrolling pills */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-hidden"
            onMouseEnter={() => setIsScrolling(false)}
            onMouseLeave={() => setIsScrolling(true)}
          >
            {clonedItems}
          </div>
        </div>
      </motion.div>

      {/* Admin access button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-4 right-4"
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-transparent hover:bg-black hover:bg-opacity-50"
          onClick={() => router.push("/admin")}
          aria-label="Admin Settings"
        >
          <Settings className="h-4 w-4 text-gray-600 hover:text-gray-300" />
        </Button>
      </motion.div>
    </div>
  )
}
