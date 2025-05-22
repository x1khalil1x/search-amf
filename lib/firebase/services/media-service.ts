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
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "../config"
import type { MediaItem, MediaCategory } from "@/types/media"

const COLLECTION_NAME = "media"
const CATEGORIES_COLLECTION = "media-categories"
const mediaCollection = collection(db, COLLECTION_NAME)
const categoriesCollection = collection(db, CATEGORIES_COLLECTION)

// Get all media
export const getAllMedia = async (): Promise<MediaItem[]> => {
  const snapshot = await getDocs(query(mediaCollection, orderBy("updatedAt", "desc")))

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Get published media
export const getPublishedMedia = async (): Promise<MediaItem[]> => {
  const snapshot = await getDocs(
    query(mediaCollection, where("isPublic", "==", true), orderBy("updatedAt", "desc"))
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Get media by source
export const getMediaBySource = async (source: "youtube" | "firebase_storage" | "external_url"): Promise<MediaItem[]> => {
  const snapshot = await getDocs(
    query(mediaCollection, where("source", "==", source), orderBy("updatedAt", "desc"))
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Get media by category
export const getMediaByCategory = async (category: string): Promise<MediaItem[]> => {
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
  const snapshot = await getDocs(
    query(mediaCollection, where("tags", "array-contains", tag), orderBy("updatedAt", "desc"))
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
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
    ...snapshot.data(),
  } as MediaItem
}

// Create a new media item
export const createMedia = async (
  media: Omit<MediaItem, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const docRef = await addDoc(mediaCollection, {
    ...media,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

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

// Delete a media item
export const deleteMedia = async (id: string): Promise<void> => {
  const mediaItem = await getMediaById(id)
  
  // If it's a Firebase Storage file, delete the file too
  if (mediaItem && mediaItem.source === "firebase_storage" && mediaItem.url) {
    try {
      // Extract the path from the URL or use a direct reference if stored
      const storageRef = ref(storage, mediaItem.url)
      await deleteObject(storageRef)
    } catch (error) {
      console.error("Error deleting file from storage:", error)
      // Continue with deletion of the database entry even if storage deletion fails
    }
  }
  
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

// Get recent media
export const getRecentMedia = async (limitCount = 10): Promise<MediaItem[]> => {
  const snapshot = await getDocs(
    query(mediaCollection, where("isPublic", "==", true), orderBy("updatedAt", "desc"), limit(limitCount))
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaItem[]
}

// Upload a file to Firebase Storage and create a media item
export const uploadMediaFile = async (
  file: File,
  metadata: Omit<MediaItem, "id" | "createdAt" | "updatedAt" | "url" | "source">
): Promise<string> => {
  // Create a storage reference
  const storageRef = ref(storage, `media/${new Date().getTime()}_${file.name}`)
  
  // Upload the file
  await uploadBytes(storageRef, file)
  
  // Get the download URL
  const url = await getDownloadURL(storageRef)
  
  // Create the media item in Firestore
  const mediaData: Omit<MediaItem, "id" | "createdAt" | "updatedAt"> = {
    ...metadata,
    url,
    source: "firebase_storage",
    isPublic: metadata.isPublic ?? false,
  }
  
  return createMedia(mediaData)
}

// Get all categories
export const getAllCategories = async (): Promise<MediaCategory[]> => {
  const snapshot = await getDocs(query(categoriesCollection, orderBy("name", "asc")))

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MediaCategory[]
}

// Create a new category
export const createCategory = async (category: Omit<MediaCategory, "id">): Promise<string> => {
  const docRef = await addDoc(categoriesCollection, category)
  return docRef.id
}

// Update a category
export const updateCategory = async (id: string, data: Partial<MediaCategory>): Promise<void> => {
  const docRef = doc(db, CATEGORIES_COLLECTION, id)
  await updateDoc(docRef, data)
}

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  const docRef = doc(db, CATEGORIES_COLLECTION, id)
  await deleteDoc(docRef)
}

// Extract YouTube video ID from URL
export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

// Create a YouTube media item
export const createYouTubeMedia = async (
  youtubeUrl: string,
  metadata: Omit<MediaItem, "id" | "createdAt" | "updatedAt" | "url" | "source">
): Promise<string | null> => {
  const videoId = extractYouTubeId(youtubeUrl)
  
  if (!videoId) {
    return null
  }
  
  // Create the media item in Firestore
  const mediaData: Omit<MediaItem, "id" | "createdAt" | "updatedAt"> = {
    ...metadata,
    url: youtubeUrl,
    source: "youtube",
    isPublic: metadata.isPublic ?? false,
  }
  
  return createMedia(mediaData)
} 