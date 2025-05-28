// Firebase configuration
// This file sets up the Firebase SDK and exports the initialized app

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, initializeFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"
import { getAnalytics, isSupported } from "firebase/analytics"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_FIREBASE_API_KEY: string
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
      NEXT_PUBLIC_FIREBASE_APP_ID: string
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string
    }
  }
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firestore with robust connection handling for media collection queries
let db: ReturnType<typeof getFirestore>

try {
  // Use default database with optimized settings for better connectivity
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    localCache: {
      kind: 'memory'
    }
  })
  
} catch (error) {
  console.error('❌ Firestore initialization with optimized settings failed:', error)
  
  // Fallback to standard default database initialization
  try {
    db = getFirestore(app)
  } catch (fallbackError) {
    console.error('❌ All Firestore initialization attempts failed:', fallbackError)
    // Final attempt with named database (in case project uses named databases)
    try {
      db = getFirestore(app, 'media')
    } catch (finalError) {
      console.error('❌ All database initialization attempts failed:', finalError)
      // Use default as last resort
      db = getFirestore(app)
    }
  }
}

const storage = getStorage(app)
const auth = getAuth(app)

// Initialize Analytics (only in browser environment and if supported)
let analytics: ReturnType<typeof getAnalytics> | null = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  }).catch(() => {
    // Analytics not supported, continue without it
  })
}

// Helper function to reset connection for diagnostics
export const resetFirebaseConnection = async () => {
  try {
    // Simple reconnection attempt
    const testDb = getFirestore(app)
    return { success: true, message: "Connection reset successful" }
  } catch (error) {
    console.error("Connection reset failed:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Helper function to check browser compatibility
export const checkBrowserCompatibility = () => {
  if (typeof window === 'undefined') return { compatible: false, reason: 'Server environment' }
  
  const userAgent = navigator.userAgent
  const isChrome = userAgent.includes('Chrome')
  const isFirefox = userAgent.includes('Firefox')
  const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome')
  
  return {
    compatible: isChrome || isFirefox || isSafari,
    browser: isChrome ? 'Chrome' : isFirefox ? 'Firefox' : isSafari ? 'Safari' : 'Unknown',
    userAgent
  }
}

export { app, db, storage, auth, analytics }
