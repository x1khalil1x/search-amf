// TypeScript interfaces for sequence data

export interface SequenceStep {
  id: string
  type: "search" | "results" | "video"
  content: string
  duration: number

  // Search step specific properties
  typingSpeed?: number
  showPredictions?: boolean
  predictions?: string[]

  // Results step specific properties
  results?: SequenceResult[]

  // Video step specific properties
  videoUrl?: string
}

export interface SequenceResult {
  type: "video" | "image" | "text"
  title: string
  description?: string
  thumbnail?: string
  duration?: string
}

export interface Sequence {
  id: string
  title: string
  description: string
  published: boolean
  steps: SequenceStep[]
  createdAt: any // Firestore Timestamp
  updatedAt: any // Firestore Timestamp
  createdBy?: string // User ID
  thumbnail?: string
  tags?: string[]
}
