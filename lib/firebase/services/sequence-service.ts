// Sequence service for Firebase
// This file provides functions to interact with sequence data in Firestore

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
import { db } from "../config"
import type { Sequence } from "@/types/sequence"

const COLLECTION_NAME = "sequences"
const sequencesCollection = collection(db, COLLECTION_NAME)

// Get all sequences
export const getAllSequences = async (): Promise<Sequence[]> => {
  const snapshot = await getDocs(query(sequencesCollection, orderBy("updatedAt", "desc")))

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Sequence[]
}

// Get published sequences
export const getPublishedSequences = async (): Promise<Sequence[]> => {
  const snapshot = await getDocs(
    query(sequencesCollection, where("published", "==", true), orderBy("updatedAt", "desc")),
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Sequence[]
}

// Get sequence by ID
export const getSequenceById = async (id: string): Promise<Sequence | null> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Sequence
}

// Create a new sequence
export const createSequence = async (sequence: Omit<Sequence, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const docRef = await addDoc(sequencesCollection, {
    ...sequence,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

// Update a sequence
export const updateSequence = async (id: string, data: Partial<Sequence>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Delete a sequence
export const deleteSequence = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

// Get recent sequences
export const getRecentSequences = async (limitCount = 10): Promise<Sequence[]> => {
  const snapshot = await getDocs(
    query(sequencesCollection, where("published", "==", true), orderBy("updatedAt", "desc"), limit(limitCount)),
  )

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Sequence[]
}
