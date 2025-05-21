import type React from "react"
import "./globals.css"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
// Import the FirebaseProvider
import { FirebaseProvider } from "@/lib/firebase/firebase-provider"

// Define font
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

// Update the RootLayout component to include the FirebaseProvider
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>search.amf</title>
        <meta name="description" content="Advanced Music Finder" />
      </head>
      <body className={`${jakartaSans.className} bg-black text-white`}>
        <FirebaseProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
