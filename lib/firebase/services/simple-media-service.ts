// Simplified media service - just the essentials
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
  type CollectionReference,
  type DocumentData,
  getDocsFromServer,
  getDocFromServer,
} from "firebase/firestore"
import { db } from "../config"
import type { SimpleMediaItem, SimpleStats, SimpleFilter } from "@/types/simple-media"

const COLLECTION_NAME = "media"

// Get collection reference
const getMediaCollection = () => {
  return collection(db, COLLECTION_NAME) as CollectionReference<DocumentData>
}

// 🔥 SERVER-ONLY READS - COMPLETELY BYPASS CACHE 🔥

// Get all media items (SERVER ONLY - NO CACHE)
export const getAllMediaSimpleServerOnly = async (): Promise<SimpleMediaItem[]> => {
  console.log("🚀 FORCING SERVER-ONLY READ from collection:", COLLECTION_NAME)
  
  try {
    const mediaCollection = getMediaCollection()
    
    // FORCE SERVER READ - This bypasses ALL cache
    const snapshot = await getDocsFromServer(mediaCollection)
    
    console.log("📡 SERVER RESPONSE - Found documents:", snapshot.size)
    console.log("📡 SERVER RESPONSE - From cache:", snapshot.metadata.fromCache)
    console.log("📡 SERVER RESPONSE - Has pending writes:", snapshot.metadata.hasPendingWrites)
    
    const items = snapshot.docs.map((doc) => {
      const data = doc.data()
      console.log("📄 SERVER DOCUMENT:", doc.id, data)
      
      return {
        id: doc.id,
        title: data.title || "Untitled",
        description: data.description || "",
        type: data.type || "text",
        source: data.source || "external_url",
        url: data.url || "",
        thumbnail: data.thumbnail,
        duration: data.duration,
        artist: data.artist,
        tags: data.tags || [],
        visibility: data.visibility || (data.isPublic ? "public" : "private"),
        status: data.status || "published",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as SimpleMediaItem
    })
    
    console.log("✅ SERVER-ONLY processed items:", items.length)
    return items
  } catch (error) {
    console.error("❌ SERVER-ONLY read failed:", error)
    throw error
  }
}

// Get media by ID (SERVER ONLY - NO CACHE)
export const getSimpleMediaByIdServerOnly = async (id: string): Promise<SimpleMediaItem | null> => {
  console.log("🚀 FORCING SERVER-ONLY READ for document:", id)
  
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    
    // FORCE SERVER READ - This bypasses ALL cache
    const snapshot = await getDocFromServer(docRef)
    
    console.log("📡 SERVER RESPONSE - Document exists:", snapshot.exists())
    console.log("📡 SERVER RESPONSE - From cache:", snapshot.metadata.fromCache)
    
    if (!snapshot.exists()) {
      console.log("📄 SERVER RESPONSE - Document not found")
      return null
    }

    const data = snapshot.data()
    console.log("📄 SERVER DOCUMENT DATA:", data)
    
    return {
      id: snapshot.id,
      title: data.title || "Untitled",
      description: data.description || "",
      type: data.type || "text",
      source: data.source || "external_url",
      url: data.url || "",
      thumbnail: data.thumbnail,
      duration: data.duration,
      artist: data.artist,
      tags: data.tags || [],
      visibility: data.visibility || (data.isPublic ? "public" : "private"),
      status: data.status || "published",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as SimpleMediaItem
  } catch (error) {
    console.error("❌ SERVER-ONLY document read failed:", error)
    throw error
  }
}

// Get simple stats (SERVER ONLY - NO CACHE)
export const getSimpleStatsServerOnly = async (): Promise<SimpleStats> => {
  console.log("🚀 FORCING SERVER-ONLY READ for stats")
  
  const items = await getAllMediaSimpleServerOnly()
  
  const stats: SimpleStats = {
    totalItems: items.length,
    audioTracks: items.filter(item => item.type === "audio").length,
    videos: items.filter(item => item.type === "video").length,
    images: items.filter(item => item.type === "image").length,
    textContent: items.filter(item => item.type === "text").length,
  }
  
  console.log("📊 SERVER-ONLY stats:", stats)
  return stats
}

// Test Firebase connection (SERVER ONLY - NO CACHE)
export const testServerOnlyConnection = async (): Promise<{ success: boolean; details: any }> => {
  try {
    console.log("🚀 Testing SERVER-ONLY Firebase connection...")
    
    const mediaCollection = getMediaCollection()
    
    // FORCE SERVER READ with limit to test connection
    const snapshot = await getDocsFromServer(query(mediaCollection, limit(5)))
    
    console.log("📡 SERVER CONNECTION TEST - Success!")
    console.log("📡 SERVER CONNECTION TEST - Document count:", snapshot.size)
    console.log("📡 SERVER CONNECTION TEST - From cache:", snapshot.metadata.fromCache)
    
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }))
    
    return {
      success: true,
      details: {
        canReadFromServer: true,
        documentCount: snapshot.size,
        collectionName: COLLECTION_NAME,
        timestamp: new Date().toISOString(),
        fromCache: snapshot.metadata.fromCache,
        sampleDocuments: documents.slice(0, 2) // Show first 2 docs as proof
      }
    }
  } catch (error) {
    console.error("❌ SERVER-ONLY connection test failed:", error)
    return {
      success: false,
      details: {
        error: (error as Error).message,
        code: (error as any).code,
        collectionName: COLLECTION_NAME,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// 🔥 ORIGINAL FUNCTIONS (may use cache) 🔥

// Get all media items (simple)
export const getAllMediaSimple = async (): Promise<SimpleMediaItem[]> => {
  console.log("Getting all media items from collection:", COLLECTION_NAME)
  
  try {
    const mediaCollection = getMediaCollection()
    const snapshot = await getDocs(mediaCollection)
    
    console.log("Found documents:", snapshot.size)
    
    const items = snapshot.docs.map((doc) => {
      const data = doc.data()
      console.log("Document:", doc.id, data)
      
      return {
        id: doc.id,
        title: data.title || "Untitled",
        description: data.description || "",
        type: data.type || "text",
        source: data.source || "external_url",
        url: data.url || "",
        thumbnail: data.thumbnail,
        duration: data.duration,
        artist: data.artist,
        tags: data.tags || [],
        visibility: data.visibility || (data.isPublic ? "public" : "private"),
        status: data.status || "published",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as SimpleMediaItem
    })
    
    console.log("Processed items:", items.length)
    return items
  } catch (error) {
    console.error("Error getting media items:", error)
    throw error
  }
}

// Get simple stats
export const getSimpleStats = async (): Promise<SimpleStats> => {
  const items = await getAllMediaSimple()
  
  const stats: SimpleStats = {
    totalItems: items.length,
    audioTracks: items.filter(item => item.type === "audio").length,
    videos: items.filter(item => item.type === "video").length,
    images: items.filter(item => item.type === "image").length,
    textContent: items.filter(item => item.type === "text").length,
  }
  
  console.log("Simple stats:", stats)
  return stats
}

// Create a simple media item
export const createSimpleMedia = async (
  media: Omit<SimpleMediaItem, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const mediaCollection = getMediaCollection()
  
  const mediaData = {
    ...media,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  
  const docRef = await addDoc(mediaCollection, mediaData)
  console.log("Created media item:", docRef.id)
  return docRef.id
}

// Update a media item
export const updateSimpleMedia = async (
  id: string,
  updates: Partial<Omit<SimpleMediaItem, "id" | "createdAt">>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  
  const updateData = {
    ...updates,
    updatedAt: serverTimestamp(),
  }
  
  await updateDoc(docRef, updateData)
  console.log("Updated media item:", id)
}

// Delete a media item
export const deleteSimpleMedia = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
  console.log("Deleted media item:", id)
}

// Get media by ID
export const getSimpleMediaById = async (id: string): Promise<SimpleMediaItem | null> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  const snapshot = await getDoc(docRef)
  
  if (!snapshot.exists()) {
    return null
  }
  
  const data = snapshot.data()
  return {
    id: snapshot.id,
    title: data.title || "Untitled",
    description: data.description || "",
    type: data.type || "text",
    source: data.source || "external_url",
    url: data.url || "",
    thumbnail: data.thumbnail,
    duration: data.duration,
    artist: data.artist,
    tags: data.tags || [],
    visibility: data.visibility || (data.isPublic ? "public" : "private"),
    status: data.status || "published",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as SimpleMediaItem
}

// Simple search/filter
export const searchSimpleMedia = async (filter: SimpleFilter): Promise<SimpleMediaItem[]> => {
  const allItems = await getAllMediaSimple()
  
  let filtered = allItems
  
  if (filter.type) {
    filtered = filtered.filter(item => item.type === filter.type)
  }
  
  if (filter.source) {
    filtered = filtered.filter(item => item.source === filter.source)
  }
  
  if (filter.visibility) {
    filtered = filtered.filter(item => item.visibility === filter.visibility)
  }
  
  if (filter.status) {
    filtered = filtered.filter(item => item.status === filter.status)
  }
  
  if (filter.searchTerm) {
    const term = filter.searchTerm.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.artist?.toLowerCase().includes(term) ||
      item.tags?.some(tag => tag.toLowerCase().includes(term))
    )
  }
  
  return filtered
}

// Create test data (simple)
export const createSimpleTestData = async (): Promise<string[]> => {
  const testItems: Omit<SimpleMediaItem, "id" | "createdAt" | "updatedAt">[] = [
    {
      title: "Test Audio Track",
      description: "A simple test audio track",
      type: "audio",
      source: "spotify",
      url: "https://open.spotify.com/track/example",
      artist: "Test Artist",
      tags: ["test", "audio"],
      visibility: "public",
      status: "published"
    },
    {
      title: "Test Video",
      description: "A simple test video",
      type: "video",
      source: "youtube",
      url: "https://youtube.com/watch?v=example",
      tags: ["test", "video"],
      visibility: "public",
      status: "published"
    },
    {
      title: "Test Text Content",
      description: "Simple text content for testing",
      type: "text",
      source: "external_url",
      url: "https://example.com",
      tags: ["test", "text"],
      visibility: "private",
      status: "draft"
    }
  ]
  
  const createdIds: string[] = []
  
  for (const item of testItems) {
    const id = await createSimpleMedia(item)
    createdIds.push(id)
  }
  
  console.log("Created test data:", createdIds)
  return createdIds
}

// Clean up test documents (simple)
export const cleanupSimpleTestData = async (): Promise<{ success: boolean; details: any }> => {
  try {
    console.log("Cleaning up simple test documents...")
    
    const mediaCollection = getMediaCollection()
    
    // Find documents that look like test documents
    const testQueries = [
      // Test items by title
      query(mediaCollection, where("title", "==", "Test Audio Track")),
      query(mediaCollection, where("title", "==", "Test Video")),
      query(mediaCollection, where("title", "==", "Test Text Content")),
      // Documents with test tags
      query(mediaCollection, where("tags", "array-contains", "test")),
      query(mediaCollection, where("tags", "array-contains", "sample"))
    ]
    
    let deletedCount = 0
    const deletedIds: string[] = []
    
    for (const testQuery of testQueries) {
      const snapshot = await getDocs(testQuery)
      
      for (const doc of snapshot.docs) {
        const data = doc.data()
        
        // Double-check this is actually a test document
        const isTestDoc = (
          data.title === "Test Audio Track" ||
          data.title === "Test Video" ||
          data.title === "Test Text Content" ||
          data.description?.includes("test") ||
          (data.tags && (
            data.tags.includes("test") ||
            data.tags.includes("sample")
          ))
        )
        
        if (isTestDoc) {
          try {
            await deleteDoc(doc.ref)
            deletedCount++
            deletedIds.push(doc.id)
            console.log(`Deleted simple test document: ${doc.id} (${data.title})`)
          } catch (deleteError) {
            console.error(`Failed to delete simple test document ${doc.id}:`, deleteError)
          }
        }
      }
    }
    
    return {
      success: true,
      details: {
        deletedCount,
        deletedIds,
        message: `Successfully cleaned up ${deletedCount} test documents`
      }
    }
  } catch (error) {
    console.error("Failed to clean up simple test documents:", error)
    return {
      success: false,
      details: {
        error: (error as Error).message,
        deletedCount: 0
      }
    }
  }
} 