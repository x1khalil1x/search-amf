"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CustomCursorProps {
  position: { x: number; y: number }
}

export default function CustomCursor({ position }: CustomCursorProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hide the default cursor
    document.body.style.cursor = "none"

    // Show custom cursor after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => {
      document.body.style.cursor = "auto"
      clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
        mass: 0.5,
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="2" />
        <circle cx="16" cy="16" r="4" fill="white" />
      </svg>
    </motion.div>
  )
}
