"use client"

// Firebase context provider
// This file provides a React context for Firebase services

import type React from "react"
import { createContext, useContext, type ReactNode } from "react"
import { app, db, storage, auth } from "./config"
import * as sequenceService from "./services/sequence-service"
import * as visualizerService from "./services/visualizer-service"

// Create context
interface FirebaseContextType {
  app: any
  db: any
  storage: any
  auth: any
  sequenceService: typeof sequenceService
  visualizerService: typeof visualizerService
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

// Provider component
interface FirebaseProviderProps {
  children: ReactNode
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const value = {
    app,
    db,
    storage,
    auth,
    sequenceService,
    visualizerService,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

// Hook for using Firebase
export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}
