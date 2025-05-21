"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Play, Edit, Trash2, Copy, Save, AudioWaveformIcon as Waveform, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FirebaseStatus } from "@/components/firebase-status"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CustomDropdown } from "@/components/custom-dropdown"

// Define saved sequences that match our premade sequences
const savedSequences = [
  {
    id: "daft-punk",
    title: "Daft Punk Classics",
    description: "Explore the iconic music videos of Daft Punk",
    published: true,
    lastEdited: "2 days ago",
  },
  {
    id: "90s-music-videos",
    title: "90s Music Video Hits",
    description: "A journey through the best music videos of the 90s",
    published: true,
    lastEdited: "1 week ago",
  },
  {
    id: "mal-sounds-bridge",
    title: "Mal Sounds Bridge Portraits",
    description: "Exploring sound portraits from the bridge",
    published: true,
    lastEdited: "3 days ago",
  },
  {
    id: "portofino-flights",
    title: "Portofino Flights",
    description: "Scenic flights over Portofino",
    published: true,
    lastEdited: "5 days ago",
  },
  {
    id: "where-is-bahia",
    title: "Where is Bahia",
    description: "Discovering the beautiful region of Bahia",
    published: false,
    lastEdited: "1 day ago",
  },
  {
    id: "next-f1-race",
    title: "Next F1 Race Where",
    description: "Information about upcoming Formula 1 races",
    published: false,
    lastEdited: "Just now",
  },
]

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("sequences")

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`)
    router.push(path)
  }

  // Define dropdown menu items for testing
  const menuItems = [
    {
      label: "Test Item 1",
      onClick: () => console.log("Test Item 1 clicked"),
    },
    {
      label: "Test Item 2",
      onClick: () => console.log("Test Item 2 clicked"),
    },
    {
      label: "Test Item 3",
      onClick: () => console.log("Test Item 3 clicked"),
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-4" onClick={() => handleNavigation("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Template Creator</h1>
              <FirebaseStatus />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Test Dropdown 1: Radix UI Dropdown */}
            <div className="mr-4 border border-gray-700 p-2 rounded-md">
              <p className="text-xs text-gray-400 mb-2">Test 1: Radix UI Dropdown</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4 mr-2" />
                    Radix Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black border-gray-800 text-white z-50">
                  <DropdownMenuItem
                    className="hover:bg-gray-900 cursor-pointer"
                    onClick={() => console.log("Item 1 clicked")}
                  >
                    Menu Item 1
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-gray-900 cursor-pointer"
                    onClick={() => console.log("Item 2 clicked")}
                  >
                    Menu Item 2
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-gray-900 cursor-pointer"
                    onClick={() => console.log("Item 3 clicked")}
                  >
                    Menu Item 3
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Test Dropdown 2: Custom Dropdown */}
            <div className="mr-4 border border-gray-700 p-2 rounded-md">
              <p className="text-xs text-gray-400 mb-2">Test 2: Custom Dropdown</p>
              <CustomDropdown items={menuItems} />
            </div>

            <Button variant="outline" onClick={() => handleNavigation("/admin/preview")}>
              <Play className="h-4 w-4 mr-2" />
              Preview Mode
            </Button>
            <Button onClick={() => handleNavigation("/admin/sequence/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Sequence
            </Button>
          </div>
        </div>

        <Tabs defaultValue="sequences" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-black border-gray-800">
            <TabsTrigger value="sequences">Sequences</TabsTrigger>
            <TabsTrigger value="visualizers">Visualizers</TabsTrigger>
            <TabsTrigger value="content">Content Library</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="sequences" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedSequences.map((sequence, index) => (
                <Card
                  key={index}
                  className="bg-black border-gray-800 relative overflow-hidden"
                  style={{
                    boxShadow: "0 0 20px rgba(50, 50, 50, 0.15) inset",
                  }}
                >
                  {/* Frost/glare effect */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      background:
                        "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                      backgroundSize: "200% 200%",
                      animation: "glare 10s ease-in-out infinite",
                    }}
                  />

                  <CardContent className="p-4">
                    <div
                      className="aspect-video bg-black rounded-md mb-3 overflow-hidden relative cursor-pointer"
                      onClick={() => handleNavigation(`/admin/sequence/${sequence.id}`)}
                    >
                      {/* Placeholder for thumbnail */}
                      <div
                        className="w-full h-full flex items-center justify-center text-gray-600"
                        style={{ aspectRatio: "16/9" }}
                      >
                        <div className="text-2xl font-bold">{sequence.title.charAt(0).toUpperCase()}</div>
                      </div>

                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                    </div>
                    <h3 className="font-medium">{sequence.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{sequence.description}</p>

                    <div className="flex items-center mt-3">
                      <div className="flex items-center mr-4">
                        <Switch id={`published-${index}`} defaultChecked={sequence.published} />
                        <Label htmlFor={`published-${index}`} className="ml-2 text-sm">
                          Published
                        </Label>
                      </div>
                      <span className="text-xs text-gray-500">Last edited: {sequence.lastEdited}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-3 border-t border-gray-800 flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation(`/admin/sequence/${sequence.id}`)}
                      className="hover:bg-gray-900"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-gray-900">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-gray-900">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="visualizers" className="mt-6">
            <div className="bg-black border border-gray-800 rounded-lg p-6 relative overflow-hidden">
              {/* Frost/glare effect */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                  backgroundSize: "200% 200%",
                  animation: "glare 10s ease-in-out infinite",
                }}
              />

              <h2 className="text-xl font-medium mb-4">Visualizer Configuration</h2>
              <p className="text-gray-400 mb-6">
                Configure visualizer presets, parameters, and custom mixes for audio-reactive visual experiences.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Preset Bundles</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Ambient Flow</div>
                          <div className="text-xs text-gray-400">Smooth, flowing visuals for ambient music</div>
                        </div>
                        <Button variant="outline" size="sm" className="hover:bg-gray-900">
                          Edit
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Electronic Pulse</div>
                          <div className="text-xs text-gray-400">High-energy reactive visuals for electronic music</div>
                        </div>
                        <Button variant="outline" size="sm" className="hover:bg-gray-900">
                          Edit
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Lo-Fi Aesthetic</div>
                          <div className="text-xs text-gray-400">Retro-inspired visuals for lo-fi beats</div>
                        </div>
                        <Button variant="outline" size="sm" className="hover:bg-gray-900">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-3 border-t border-gray-800">
                    <Button variant="ghost" size="sm" className="w-full hover:bg-gray-900">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Bundle
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Global Parameters</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="tempo-matching">Tempo Matching</Label>
                          <Switch id="tempo-matching" defaultChecked />
                        </div>
                        <div className="text-xs text-gray-400">Automatically sync visuals to audio tempo</div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="intensity">Reactivity Intensity</Label>
                        <Slider
                          id="intensity"
                          defaultValue={[70]}
                          max={100}
                          step={1}
                          className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Subtle</span>
                          <span>Balanced</span>
                          <span>Intense</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="color-scheme">Default Color Scheme</Label>
                        <Select defaultValue="dynamic">
                          <SelectTrigger id="color-scheme" className="bg-black border-gray-800">
                            <SelectValue placeholder="Select color scheme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dynamic">Dynamic (Audio-reactive)</SelectItem>
                            <SelectItem value="warm">Warm Tones</SelectItem>
                            <SelectItem value="cool">Cool Tones</SelectItem>
                            <SelectItem value="monochrome">Monochrome</SelectItem>
                            <SelectItem value="neon">Neon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transition-speed">Transition Speed</Label>
                        <Slider
                          id="transition-speed"
                          defaultValue={[50]}
                          max={100}
                          step={1}
                          className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Slow</span>
                          <span>Medium</span>
                          <span>Fast</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="bg-black border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Custom Mixes</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-black border-gray-800">
                        <CardContent className="p-3">
                          <div className="aspect-video bg-gray-900 rounded-md mb-2 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <Waveform className="h-6 w-6 text-purple-400" />
                            </div>
                          </div>
                          <div className="font-medium">Cosmic Journey</div>
                          <div className="text-xs text-gray-400">Space-themed visualizer with nebula effects</div>
                        </CardContent>
                        <CardFooter className="px-3 py-2 border-t border-gray-800">
                          <Button variant="ghost" size="sm" className="w-full hover:bg-gray-900">
                            Edit Mix
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card className="bg-black border-gray-800">
                        <CardContent className="p-3">
                          <div className="aspect-video bg-gray-900 rounded-md mb-2 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Waveform className="h-6 w-6 text-blue-400" />
                            </div>
                          </div>
                          <div className="font-medium">Ocean Waves</div>
                          <div className="text-xs text-gray-400">Fluid, wave-like patterns in blue tones</div>
                        </CardContent>
                        <CardFooter className="px-3 py-2 border-t border-gray-800">
                          <Button variant="ghost" size="sm" className="w-full hover:bg-gray-900">
                            Edit Mix
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card className="bg-black border-gray-800 border-dashed flex items-center justify-center p-3">
                        <Button
                          variant="ghost"
                          className="h-full w-full flex flex-col items-center justify-center gap-2 hover:bg-gray-900"
                        >
                          <Plus className="h-6 w-6" />
                          <span>Create New Mix</span>
                        </Button>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <div className="bg-black border border-gray-800 rounded-lg p-6 relative overflow-hidden">
              {/* Frost/glare effect */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                  backgroundSize: "200% 200%",
                  animation: "glare 10s ease-in-out infinite",
                }}
              />

              <h2 className="text-xl font-medium mb-4">Content Library</h2>
              <p className="text-gray-400">
                Manage your content assets including videos, images, and text snippets that can be used in search
                sequences.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card className="bg-black border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Videos</h3>
                    <p className="text-sm text-gray-400">42 items</p>
                  </CardContent>
                  <CardFooter className="px-4 py-3 border-t border-gray-800">
                    <Button variant="ghost" size="sm" className="w-full hover:bg-gray-900">
                      Manage Videos
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Images</h3>
                    <p className="text-sm text-gray-400">87 items</p>
                  </CardContent>
                  <CardFooter className="px-4 py-3 border-t border-gray-800">
                    <Button variant="ghost" size="sm" className="w-full hover:bg-gray-900">
                      Manage Images
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Text Content</h3>
                    <p className="text-sm text-gray-400">23 items</p>
                  </CardContent>
                  <CardFooter className="px-4 py-3 border-t border-gray-800">
                    <Button variant="ghost" size="sm" className="w-full hover:bg-gray-900">
                      Manage Text
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="bg-black border border-gray-800 rounded-lg p-6 relative overflow-hidden">
              {/* Frost/glare effect */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                  backgroundSize: "200% 200%",
                  animation: "glare 10s ease-in-out infinite",
                }}
              />

              <h2 className="text-xl font-medium mb-4">Global Settings</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" defaultValue="search.amf" className="bg-black border-gray-800" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain">Public Subdomain</Label>
                  <div className="flex">
                    <Input id="subdomain" defaultValue="search" className="bg-black border-gray-800 rounded-r-none" />
                    <div className="flex items-center px-3 bg-black border border-l-0 border-gray-800 rounded-r-md text-gray-400">
                      .yourdomain.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-mode">Public Mode</Label>
                    <p className="text-sm text-gray-400">Enable the public-facing search interface</p>
                  </div>
                  <Switch id="public-mode" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-gray-400">Track visitor interactions and page views</p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>

                <Button className="mt-4 hover:bg-gray-900">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add animation for glare effect */}
      <style jsx global>{`
        @keyframes glare {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>
    </div>
  )
}
