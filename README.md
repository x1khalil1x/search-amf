# Search.AMF - Advanced Music Finder

## Overview

Search.AMF is a sophisticated application that serves as both a simulated search environment and a content platform with integrated studio operations and visual effects. The platform enables users to explore music content through a curated search experience, manage content in a studio environment, and create immersive audio-visual experiences through the visualizer.

## Core Purpose

### Simulated Search Environment
The application provides a controlled search experience that mimics real-world search engines but with curated content focused on music and audio-visual media. Unlike traditional search engines that crawl the web, Search.AMF operates on pre-defined sequences and content, allowing for:

- Predictable search results
- Curated content discovery
- Guided user journeys through "search sequences"
- Demonstration of search patterns and behaviors

### Content Platform
Beyond search, the platform serves as a comprehensive content management system with:

- **Studio Operations**: Upload, manage, and organize video content
- **Visualizer**: Create real-time audio-reactive visual experiences
- **Admin Interface**: Design and manage search sequences and content libraries

## Key Design Principles

### 1. Minimalist Dark Aesthetic
- Black backgrounds with subtle depth through layering
- Limited color palette with strategic accent colors
- Frost/glare effects for visual interest without distraction
- High contrast for readability and focus

### 2. Fluid Motion and Animation
- Subtle animations that enhance rather than distract
- Smooth transitions between states
- Motion as feedback for user interactions
- Animated elements to draw attention to key features

### 3. Spatial Hierarchy
- Clear visual separation between different functional areas
- Consistent spacing and alignment
- Strategic use of depth through shadows and overlays
- Intentional information density based on context

### 4. Interactive Feedback
- Hover states with opacity changes for interactive elements
- Visual confirmation of selections and actions
- Animated transitions for state changes
- Consistent interactive patterns across the application

### 5. Modular Component Architecture
- Reusable UI components with consistent styling
- Separation of concerns between different functional areas
- Scalable design system that maintains visual coherence
- Component-based approach for easier maintenance and extension

## Technical Implementation

### Core Technologies
- **Next.js**: App Router for server-side rendering and routing
- **React**: Component-based UI development
- **Tailwind CSS**: Utility-first styling approach
- **Framer Motion**: Animation library for smooth transitions
- **Lucide Icons**: Consistent iconography throughout the app
- **shadcn/ui**: Component library for consistent UI elements
- **Firebase**: Backend services for data storage and authentication

### Key Features

#### Search Experience
- Simulated search with predictive suggestions
- Customizable search sequences with multiple steps
- Timed transitions between search steps
- Custom cursor for enhanced immersion

#### Studio
- Video library management
- Multiple aspect ratio support
- Video preview capabilities
- Content organization tools

#### Visualizer
- Audio-reactive visual effects
- Multiple visualization presets
- Real-time audio analysis
- Customizable visual parameters

#### Admin Interface
- Sequence creation and management
- Step-by-step sequence builder
- Content library management
- Global settings configuration

### State Management
- React's built-in state management for component-level state
- URL-based state for major navigation points
- Controlled forms for user input
- Custom hooks for shared functionality

## Firebase Integration

The application is fully integrated with Firebase for backend services. The Firebase setup includes:

### Current Firebase Project
- **Project ID**: `amf-track-hub-7ce80`
- **Environment**: Production-ready configuration
- **Status**: ✅ Connected and operational

### Firebase Services

#### Firestore Database
- **Collection**: `media` - Unified media library for all content types
- **Features**: Real-time data synchronization, offline support
- **Data Types**: Audio, video, images, and external media links
- **Indexing**: Optimized queries for filtering and search

#### Firebase Storage
- **Purpose**: Media asset storage (thumbnails, audio files, video content)
- **Organization**: Structured folder hierarchy for different media types
- **Security**: Rules-based access control

#### Firebase Authentication
- **Methods**: Anonymous authentication for demo purposes
- **Future**: Ready for email/password and social login integration
- **Permissions**: Role-based access control ready

### Firebase Configuration

The application uses environment variables for Firebase configuration. Create a `.env.local` file with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id (optional)
```

### Firebase Service Architecture

The application uses a modular service architecture for Firebase integration:

```
lib/firebase/
├── config.ts                    # Firebase initialization and configuration
├── services/
│   ├── media-service.ts         # Comprehensive media management
│   └── simple-media-service.ts  # Simplified media operations
└── firebase-provider.tsx        # React context provider
```

#### Key Service Features

**Media Service** (`lib/firebase/services/media-service.ts`):
- CRUD operations for media items
- Support for multiple media sources (YouTube, Firebase Storage, External URLs)
- Advanced filtering and search capabilities
- Analytics tracking (views, likes, downloads)
- Batch operations for bulk management

**Simple Media Service** (`lib/firebase/services/simple-media-service.ts`):
- Streamlined operations for basic use cases
- Server-side data fetching for better performance
- Connection diagnostics and testing utilities

### Usage Examples

```tsx
// Using Firebase services in components
import { useFirebase } from '@/lib/firebase/firebase-provider';

function MediaComponent() {
  const { mediaService } = useFirebase();
  
  const loadMedia = async () => {
    const media = await mediaService.getAllMedia();
    setMediaItems(media);
  };
  
  const addMedia = async (mediaData) => {
    await mediaService.addMediaItem(mediaData);
    // Refresh media list
  };
}
```

### Data Models

TypeScript interfaces ensure type safety throughout the application:

- `types/media.ts`: Comprehensive media item structure
- `types/simple-media.ts`: Simplified media interfaces

### Firebase Setup Instructions

1. **Create Firebase Project**: Visit [Firebase Console](https://console.firebase.google.com)
2. **Enable Services**: 
   - Firestore Database
   - Firebase Storage
   - Authentication (Anonymous)
3. **Configure Security Rules**: Use provided `firestore.rules` and `firestore.indexes.json`
4. **Get Configuration**: Copy config from Project Settings > General > Your apps
5. **Update Environment**: Add credentials to `.env.local`
6. **Deploy Rules**: Run `firebase deploy --only firestore:rules,firestore:indexes`

### Admin Tools

The application includes comprehensive admin tools for Firebase management:

- **Database Viewer** (`/admin/database`): Real-time Firestore collection browser
- **Connection Diagnostics** (`/admin/firebase-diagnostic`): Firebase connectivity testing
- **Content Management** (`/admin/content`): Media library management interface

### Testing and Diagnostics

Built-in tools for Firebase testing:

- **Connection Tests**: Verify Firebase connectivity and authentication
- **Data Validation**: Ensure data integrity and proper schema
- **Performance Monitoring**: Track query performance and optimization opportunities

## Media Service

### Unified Media Library

The media service handles various content types through a unified interface:

1. **YouTube Videos** - Automatic ID extraction and metadata fetching
2. **Firebase Storage** - Direct file uploads with automatic optimization
3. **External URLs** - Support for third-party media hosting
4. **Local Files** - Upload and management through Firebase Storage

### Media Categories and Organization

- **Type-based filtering**: Audio, video, image, text content
- **Source-based organization**: YouTube, Firebase Storage, external
- **Tag system**: Flexible categorization and search
- **Visibility controls**: Public, private, and draft content states

## File Structure

```
search-amf/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin interface with Firebase tools
│   │   ├── database/       # Firestore collection browser
│   │   ├── content/        # Media management interface
│   │   └── firebase-diagnostic/ # Connection testing
│   ├── results/            # Search results page
│   ├── sequence/           # Sequence playback
│   ├── studio/             # Studio interface
│   ├── video/              # Video player
│   ├── visualizer/         # Audio visualizer
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Reusable React components
│   ├── sequence/           # Sequence-related components
│   ├── ui/                 # UI components (shadcn)
│   ├── custom-cursor.tsx   # Custom cursor implementation
│   └── video-viewer.tsx    # Video player component
├── lib/firebase/           # Firebase integration
│   ├── config.ts           # Firebase configuration
│   ├── services/           # Firebase service modules
│   └── firebase-provider.tsx # React context provider
├── types/                  # TypeScript type definitions
├── scripts/                # Utility scripts
│   └── add-test-data.js    # Firebase test data seeding
├── public/                 # Static assets
├── firebase.json           # Firebase project configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore index configuration
└── styles/                 # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd search-amf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Copy configuration to `.env.local`
   - Deploy Firestore rules: `firebase deploy --only firestore`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Verify Firebase connection**
   - Visit `http://localhost:3000/admin/database`
   - Check connection status and test data operations

### Adding Test Data

Use the included script to populate your Firebase database with sample media:

```bash
node scripts/add-test-data.js
```

## Design System

### Colors
- **Background**: Black (#000000)
- **Foreground**: White (#FFFFFF)
- **Muted**: Gray (#333333)
- **Muted Foreground**: Light Gray (#AAAAAA)
- **Border**: Dark Gray (#222222)
- **Input**: Dark Gray (#222222)
- **Accent**: Various contextual colors

### Typography
- **Primary Font**: Plus Jakarta Sans
- **Headings**: Light weight for elegance
- **Body**: Regular weight for readability
- **Monospace**: For code and technical content

### Spacing
- Consistent 4px grid system (0.25rem increments)
- Strategic use of negative space
- Consistent padding and margins

### Components
- **Cards**: Black backgrounds with subtle borders
- **Buttons**: Minimal styling with hover effects
- **Inputs**: Dark backgrounds with light text
- **Navigation**: Subtle indicators for current state

## Development Guidelines

### Firebase Best Practices
1. **Environment Variables**: Always use environment variables for Firebase config
2. **Error Handling**: Implement comprehensive error handling for Firebase operations
3. **Caching**: Use Next.js caching strategies for Firebase data
4. **Security**: Follow Firebase security rules best practices
5. **Performance**: Optimize queries and use pagination for large datasets

### Creating New Features
1. Follow the established dark aesthetic
2. Maintain consistent spacing and component usage
3. Implement smooth transitions between states
4. Ensure responsive design for all viewport sizes
5. Add proper Firebase integration where needed

### Testing Firebase Integration
- Use the admin diagnostic tools for connection testing
- Verify data operations through the database viewer
- Test offline functionality and error states
- Monitor performance through Firebase console

## Performance Considerations

- Lazy loading for non-critical components
- Optimized image loading with Firebase Storage
- Efficient animation implementations
- Strategic code splitting
- Firebase query optimization and caching

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus management for interactive elements

---

This README serves as a comprehensive guide to the Search.AMF application with its complete Firebase integration. The application is production-ready with a robust backend infrastructure supporting real-time data operations, media management, and user authentication.
