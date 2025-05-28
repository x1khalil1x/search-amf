// Media service for Firebase
// This file provides functions to interact with media data in Firestore

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
  increment,
  type CollectionReference,
  type DocumentData,
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "../config"
import type { MediaItem, ContentFilter, ContentStats } from "@/types/media"

const COLLECTION_NAME = "media"

// Helper function to get collection reference
const getMediaCollection = () => {
  return collection(db, COLLECTION_NAME) as CollectionReference<DocumentData>
}

// Get all media with optional filtering
export const getAllMedia = async (filter?: ContentFilter): Promise<MediaItem[]> => {
  console.log("getAllMedia: Starting query for collection 'media'")
  
  try {
    const mediaCollection = getMediaCollection()
    
    // Query only the media collection (the only collection that exists)
    console.log("getAllMedia: Executing query for media collection...")
    const mediaSnapshot = await getDocs(mediaCollection)
    console.log("getAllMedia: Media collection query successful, document count:", mediaSnapshot.size)
    
    // Convert media documents
    const mediaResults = mediaSnapshot.docs.map((doc) => {
      const data = doc.data()
      console.log("getAllMedia: Document data:", { id: doc.id, title: data.title, type: data.type, source: data.source })
      return {
        id: doc.id,
        ...data,
      } as MediaItem
    })
    
    console.log("getAllMedia: Total results:", mediaResults.length)
    
    // Apply client-side filtering if needed
    let filteredResults = mediaResults
    
    if (filter?.type && filter.type.length > 0) {
      filteredResults = filteredResults.filter(item => filter.type!.includes(item.type))
    }
    if (filter?.source && filter.source.length > 0) {
      filteredResults = filteredResults.filter(item => filter.source!.includes(item.source))
    }
    if (filter?.visibility && filter.visibility.length > 0) {
      filteredResults = filteredResults.filter(item => filter.visibility!.includes(item.visibility))
    }
    if (filter?.status && filter.status.length > 0) {
      filteredResults = filteredResults.filter(item => filter.status!.includes(item.status))
    }
    
    console.log("getAllMedia: Final filtered results:", filteredResults.length)
    return filteredResults
  } catch (error) {
    console.error("getAllMedia: Query failed:", error)
    console.error("getAllMedia: Error details:", {
      name: (error as any)?.name,
      message: (error as any)?.message,
      code: (error as any)?.code,
      stack: (error as any)?.stack
    })
    throw error
  }
}

// Get published media (backward compatibility)
export const getPublishedMedia = async (): Promise<MediaItem[]> => {
  const mediaCollection = getMediaCollection()
  const snapshot = await getDocs(
    query(
      mediaCollection, 
      where("visibility", "==", "public"),
      where("status", "==", "published"),
      orderBy("updatedAt", "desc")
    )
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Get media by type
export const getMediaByType = async (type: MediaItem["type"]): Promise<MediaItem[]> => {
  const mediaCollection = getMediaCollection()
  const snapshot = await getDocs(
    query(mediaCollection, where("type", "==", type), orderBy("updatedAt", "desc"))
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Get media by source
export const getMediaBySource = async (source: MediaItem["source"]): Promise<MediaItem[]> => {
  const mediaCollection = getMediaCollection()
  const snapshot = await getDocs(
    query(mediaCollection, where("source", "==", source), orderBy("updatedAt", "desc"))
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Get media by category (legacy support)
export const getMediaByCategory = async (category: string): Promise<MediaItem[]> => {
  const mediaCollection = getMediaCollection()
  const snapshot = await getDocs(
    query(mediaCollection, where("category", "==", category), orderBy("updatedAt", "desc"))
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Get media by tag
export const getMediaByTag = async (tag: string): Promise<MediaItem[]> => {
  const mediaCollection = getMediaCollection()
  const snapshot = await getDocs(
    query(mediaCollection, where("tags", "array-contains", tag), orderBy("updatedAt", "desc"))
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Get featured media
export const getFeaturedMedia = async (limitCount = 10): Promise<MediaItem[]> => {
  const mediaCollection = getMediaCollection()
  const snapshot = await getDocs(
    query(
      mediaCollection, 
      where("featured", "==", true),
      where("visibility", "==", "public"),
      where("status", "==", "published"),
      orderBy("priority", "desc"),
      orderBy("updatedAt", "desc"),
      limit(limitCount)
    )
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  } as MediaItem))
}

// Get media by ID
export const getMediaById = async (id: string): Promise<MediaItem | null> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  } as MediaItem
}

// Create a new media item with enhanced schema
export const createMedia = async (
  media: Omit<MediaItem, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const mediaCollection = getMediaCollection()
  // Set defaults for new required fields
  const mediaData = {
    ...media,
    visibility: media.visibility || "private",
    status: media.status || "draft",
    viewCount: 0,
    likeCount: 0,
    downloadCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(mediaCollection, mediaData)
  return docRef.id
}

// Update a media item
export const updateMedia = async (id: string, data: Partial<MediaItem>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Increment view count
export const incrementViewCount = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, {
    viewCount: increment(1),
    updatedAt: serverTimestamp(),
  })
}

// Increment like count
export const incrementLikeCount = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, {
    likeCount: increment(1),
    updatedAt: serverTimestamp(),
  })
}

// Increment download count
export const incrementDownloadCount = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, {
    downloadCount: increment(1),
    updatedAt: serverTimestamp(),
  })
}

// Delete a media item
export const deleteMedia = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

// Get recent media
export const getRecentMedia = async (limitCount = 10): Promise<MediaItem[]> => {
  const mediaCollection = getMediaCollection()
  const snapshot = await getDocs(
    query(
      mediaCollection,
      where("visibility", "==", "public"),
      where("status", "==", "published"),
      orderBy("updatedAt", "desc"),
      limit(limitCount)
    )
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Upload media file to Firebase Storage
export const uploadMediaFile = async (
  file: File,
  metadata: Omit<MediaItem, "id" | "createdAt" | "updatedAt" | "url" | "source">
): Promise<string> => {
  // Create a unique filename
  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name}`
  const storageRef = ref(storage, `media/${filename}`)

  // Upload file
  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)

  // Create media item in Firestore
  const mediaData = {
    ...metadata,
    url: downloadURL,
    source: "firebase_storage" as const,
    filename,
    fileSize: file.size,
    mimeType: file.type,
  }

  const mediaId = await createMedia(mediaData)
  return mediaId
}

// Get content statistics
export const getContentStats = async (): Promise<ContentStats> => {
  const mediaCollection = getMediaCollection()
  
  // Get all media for stats calculation
  const allMediaSnapshot = await getDocs(mediaCollection)
  const allMedia = allMediaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MediaItem[]
  
  // Calculate stats
  const totalItems = allMedia.length
  
  // Count by type
  const byType = allMedia.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {} as Record<MediaItem["type"], number>)
  
  // Count by source
  const bySource = allMedia.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1
    return acc
  }, {} as Record<MediaItem["source"], number>)
  
  // Count by status
  const byStatus = allMedia.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {} as Record<MediaItem["status"], number>)
  
  // Calculate totals
  const totalViews = allMedia.reduce((sum, item) => sum + (item.viewCount || 0), 0)
  const totalLikes = allMedia.reduce((sum, item) => sum + (item.likeCount || 0), 0)
  const totalDownloads = allMedia.reduce((sum, item) => sum + (item.downloadCount || 0), 0)

  return {
    totalItems,
    byType,
    bySource,
    byStatus,
    totalViews,
    totalLikes,
    totalDownloads,
  }
}

// Extract YouTube video ID from URL
export const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Create YouTube media item
export const createYouTubeMedia = async (
  youtubeUrl: string,
  metadata: Omit<MediaItem, "id" | "createdAt" | "updatedAt" | "url" | "source" | "type">
): Promise<string | null> => {
  const videoId = extractYouTubeId(youtubeUrl)
  if (!videoId) {
    throw new Error("Invalid YouTube URL")
  }

  const mediaData = {
    ...metadata,
    type: "video" as const,
    source: "youtube" as const,
    url: youtubeUrl,
    youtubeId: videoId,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  }

  return await createMedia(mediaData)
}

// Create test media item
export const createTestMedia = async (): Promise<string> => {
  const testMedia = {
    title: "Test Media Item",
    description: "This is a test media item created for testing purposes",
    type: "text" as const,
    source: "external_url" as const,
    url: "https://example.com/test",
    thumbnail: "https://example.com/test-thumbnail.jpg",
    visibility: "private" as const,
    status: "draft" as const,
    tags: ["test", "example"],
    category: "test-category",
  }

  return await createMedia(testMedia)
}

// Create test data for development
export const createTestData = async (): Promise<{ mediaId: string }> => {
  console.log("Creating test data...")

  // Create test media item
  const mediaId = await createTestMedia()
  console.log("Created test media:", mediaId)

  return { mediaId }
}

// Test Firebase connection and permissions
export const testFirebaseConnection = async (): Promise<{ success: boolean; details: any }> => {
  let testDocRef: any = null
  
  try {
    console.log("Testing Firebase connection...")
    
    const mediaCollection = getMediaCollection()
    
    // Test 1: Try to read from media collection
    console.log("Test 1: Reading from media collection...")
    const mediaSnapshot = await getDocs(query(mediaCollection, limit(1)))
    console.log("Media collection accessible:", mediaSnapshot.size >= 0)
    
    // Test 2: Try to write a test document (and immediately delete it)
    console.log("Test 2: Testing write permissions...")
    const testDoc = {
      title: "Connection Test",
      description: "This is a connection test - should be deleted immediately",
      type: "text" as const,
      source: "external_url" as const,
      url: "https://example.com",
      visibility: "private" as const,
      status: "draft" as const,
      tags: ["connection-test", "temporary"],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    testDocRef = await addDoc(mediaCollection, testDoc)
    console.log("Write test successful, document ID:", testDocRef.id)
    
    // Clean up test document immediately
    await deleteDoc(testDocRef)
    console.log("Test document cleaned up successfully")
    testDocRef = null // Mark as cleaned up
    
    return {
      success: true,
      details: {
        mediaCollectionAccessible: true,
        writePermissions: true,
        mediaDocCount: mediaSnapshot.size,
        collectionName: COLLECTION_NAME,
        testDocumentCleanedUp: true
      }
    }
  } catch (error) {
    console.error("Firebase connection test failed:", error)
    
    // Clean up test document if it was created
    if (testDocRef) {
      try {
        await deleteDoc(testDocRef)
        console.log("Cleaned up test document after error")
      } catch (cleanupError) {
        console.error("Failed to clean up test document:", cleanupError)
      }
    }
    
    return {
      success: false,
      details: {
        error: (error as any)?.message || String(error),
        code: (error as any)?.code,
        collectionName: COLLECTION_NAME
      }
    }
  }
}

// Clean up any test documents
export const cleanupTestDocuments = async (): Promise<{ success: boolean; details: any }> => {
  try {
    console.log("Cleaning up test documents...")
    
    const mediaCollection = getMediaCollection()
    
    // Find test documents
    const testDocsSnapshot = await getDocs(
      query(mediaCollection, where("tags", "array-contains", "connection-test"))
    )
    
    console.log("Found test documents:", testDocsSnapshot.size)
    
    // Delete test documents
    const deletePromises = testDocsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
    
    console.log("Test documents cleaned up successfully")
    
    return {
      success: true,
      details: {
        deletedCount: testDocsSnapshot.size,
        collectionName: COLLECTION_NAME
      }
    }
  } catch (error) {
    console.error("Cleanup failed:", error)
    return {
      success: false,
      details: {
        error: (error as any)?.message || String(error),
        code: (error as any)?.code,
        collectionName: COLLECTION_NAME
      }
    }
  }
} 