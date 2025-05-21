// Visualizer service for Firebase
// This file provides functions to interact with visualizer data in Firestore

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
} from "firebase/firestore"
import { db } from "../config"
import type { Visualizer, VisualizerPreset } from "@/types/visualizer"

const COLLECTION_NAME = "visualizers"
const PRESETS_COLLECTION = "visualizer-presets"
const visualizersCollection = collection(db, COLLECTION_NAME)
const presetsCollection = collection(db, PRESETS_COLLECTION)

// Get all visualizers
export const getAllVisualizers = async (): Promise<Visualizer[]> => {
  const snapshot = await getDocs(query(visualizersCollection, orderBy("updatedAt", "desc")))

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Visualizer[]
}

// Get visualizer by ID
export const getVisualizerById = async (id: string): Promise<Visualizer | null> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Visualizer
}

// Create a new visualizer
export const createVisualizer = async (
  visualizer: Omit<Visualizer, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const docRef = await addDoc(visualizersCollection, {
    ...visualizer,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

// Update a visualizer
export const updateVisualizer = async (id: string, data: Partial<Visualizer>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Delete a visualizer
export const deleteVisualizer = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

// Get all visualizer presets
export const getAllPresets = async (): Promise<VisualizerPreset[]> => {
  const snapshot = await getDocs(query(presetsCollection, orderBy("name", "asc")))

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as VisualizerPreset[]
}

// Get preset by ID
export const getPresetById = async (id: string): Promise<VisualizerPreset | null> => {
  const docRef = doc(db, PRESETS_COLLECTION, id)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as VisualizerPreset
}

// Create a new preset
export const createPreset = async (preset: Omit<VisualizerPreset, "id">): Promise<string> => {
  const docRef = await addDoc(presetsCollection, preset)
  return docRef.id
}

// Update a preset
export const updatePreset = async (id: string, data: Partial<VisualizerPreset>): Promise<void> => {
  const docRef = doc(db, PRESETS_COLLECTION, id)
  await updateDoc(docRef, data)
}

// Delete a preset
export const deletePreset = async (id: string): Promise<void> => {
  const docRef = doc(db, PRESETS_COLLECTION, id)
  await deleteDoc(docRef)
}

// Get presets by category
export const getPresetsByCategory = async (category: string): Promise<VisualizerPreset[]> => {
  const snapshot = await getDocs(query(presetsCollection, where("category", "==", category), orderBy("name", "asc")))

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as VisualizerPreset[]
}
