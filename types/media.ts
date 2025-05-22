// TypeScript interfaces for media data

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  source: "youtube" | "firebase_storage" | "external_url";
  url: string;  // YouTube URL or Firebase Storage URL or external URL
  thumbnail: string;
  duration: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  createdBy?: string; // User ID
  tags?: string[];
  category?: string;
  isPublic: boolean;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    fileSize?: number;
    // Additional metadata specific to the media type
  };
}

export interface MediaCategory {
  id: string;
  name: string;
  description?: string;
  count?: number;
} 