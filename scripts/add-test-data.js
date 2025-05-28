const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Load environment variables
require('dotenv').config();

// Your Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "amf-track-hub-7ce80.firebaseapp.com",
  projectId: "amf-track-hub-7ce80",
  storageBucket: "amf-track-hub-7ce80.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test data that matches your MediaItem schema
const testMediaItems = [
  {
    title: "Sample Audio Track",
    description: "A test audio track for development",
    type: "audio",
    source: "spotify",
    url: "https://open.spotify.com/track/example",
    thumbnail: "https://example.com/thumbnail1.jpg",
    duration: "3:45",
    artist: "Test Artist",
    tags: ["test", "audio", "sample"],
    visibility: "public",
    status: "published",
    featured: false,
    priority: 1,
    viewCount: 0,
    likeCount: 0,
    downloadCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: "Sample Video Content",
    description: "A test video for development",
    type: "video",
    source: "youtube",
    url: "https://youtube.com/watch?v=example",
    thumbnail: "https://example.com/thumbnail2.jpg",
    duration: "5:30",
    tags: ["test", "video", "sample"],
    visibility: "public",
    status: "published",
    featured: true,
    priority: 2,
    viewCount: 10,
    likeCount: 2,
    downloadCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: "Sample Image",
    description: "A test image for development",
    type: "image",
    source: "firebase_storage",
    url: "https://example.com/image.jpg",
    thumbnail: "https://example.com/thumbnail3.jpg",
    tags: ["test", "image", "sample"],
    visibility: "public",
    status: "published",
    featured: false,
    priority: 1,
    viewCount: 5,
    likeCount: 1,
    downloadCount: 3,
    metadata: {
      width: 1920,
      height: 1080,
      format: "jpg",
      fileSize: 2048000,
      mimeType: "image/jpeg"
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: "Sample Text Content",
    description: "A test text document for development",
    type: "text",
    source: "external_url",
    url: "https://example.com/document",
    thumbnail: "https://example.com/thumbnail4.jpg",
    tags: ["test", "text", "sample"],
    visibility: "private",
    status: "draft",
    featured: false,
    priority: 1,
    viewCount: 0,
    likeCount: 0,
    downloadCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function addTestData() {
  try {
    console.log('Adding test data to Firestore...');
    
    for (const item of testMediaItems) {
      const docRef = await addDoc(collection(db, 'media'), item);
      console.log(`Added document with ID: ${docRef.id} - ${item.title}`);
    }
    
    console.log('✅ All test data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test data:', error);
    process.exit(1);
  }
}

addTestData(); 