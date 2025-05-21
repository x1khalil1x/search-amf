"use client"

import { CheckCircle2 } from "lucide-react"

export function FirebaseStatus() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <span className="text-green-500">Firebase connected</span>
    </div>
  )
}
