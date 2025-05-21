// TypeScript interfaces for visualizer data

export interface VisualizerParameter {
  id: string
  name: string
  type: "slider" | "toggle" | "select" | "color"
  value: any
  min?: number
  max?: number
  step?: number
  options?: { label: string; value: any }[]
}

export interface VisualizerPreset {
  id: string
  name: string
  description: string
  category: string
  thumbnail?: string
  parameters: VisualizerParameter[]
  shader?: string
  defaultAudio?: string
}

export interface Visualizer {
  id: string
  name: string
  description: string
  presetId: string
  customParameters?: VisualizerParameter[]
  createdAt: any // Firestore Timestamp
  updatedAt: any // Firestore Timestamp
  createdBy?: string // User ID
  isPublic: boolean
  likes?: number
  views?: number
  audioTrackUrl?: string
}
