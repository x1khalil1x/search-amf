"use client"

import { useState, useRef, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CustomDropdownProps {
  items: {
    label: string
    onClick: () => void
  }[]
}

export function CustomDropdown({ items }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 opacity-50 hover:opacity-100 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-black border border-gray-800 z-50">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-900"
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
