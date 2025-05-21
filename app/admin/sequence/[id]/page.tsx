"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Play, Save, Trash2, Clock, MousePointer, Keyboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

// Mock drag and drop functionality
const DragDropContext = ({ children, onDragEnd }: { children: React.ReactNode; onDragEnd: (result: any) => void }) => {
  return <div>{children}</div>
}

const Droppable = ({
  children,
  droppableId,
}: {
  children: (provided: { innerRef: any; droppableProps: any }) => React.ReactNode
  droppableId: string
}) => {
  return children({
    innerRef: null,
    droppableProps: { "data-droppable-id": droppableId },
  })
}

const Draggable = ({
  children,
  draggableId,
  index,
}: {
  children: (provided: { innerRef: any; draggableProps: any; dragHandleProps: any }) => React.ReactNode
  draggableId: string
  index: number
}) => {
  return children({
    innerRef: null,
    draggableProps: { "data-draggable-id": draggableId },
    dragHandleProps: { "data-drag-handle": true },
  })
}

// Mock icons for step types
const Search = () => <div className="h-4 w-4 text-blue-400" />
const LayoutGrid = () => <div className="h-4 w-4 text-purple-400" />

export default function SequenceEditor({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNew = params.id === "new"
  const [sequence, setSequence] = useState<any>({
    title: isNew ? "New Sequence" : "Daft Punk Classics",
    description: isNew ? "Description" : "Explore the iconic music videos of Daft Punk",
    steps: isNew
      ? []
      : [
          {
            id: "step1",
            type: "search",
            content: "daft punk around the world",
            duration: 3000,
            typingSpeed: 100,
            showPredictions: true,
            predictions: [
              "daft punk around the world lyrics",
              "daft punk around the world video",
              "daft punk around the world sample",
              "daft punk around the world remix",
            ],
          },
          {
            id: "step2",
            type: "results",
            content: "daft punk around the world video",
            duration: 4000,
            results: [
              {
                type: "video",
                title: "Daft Punk - Around The World (Official Video)",
                description: "Official music video for 'Around The World' by Daft Punk",
                duration: "3:58",
              },
              {
                type: "video",
                title: "Daft Punk - Around The World (Live)",
                description: "Live performance from Alive 2007",
                duration: "5:43",
              },
            ],
          },
          {
            id: "step3",
            type: "video",
            content: "Daft Punk - Around The World (Official Video)",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            duration: 10000,
          },
        ],
  })
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("sequence")

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`)
    router.push(path)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(sequence.steps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSequence({ ...sequence, steps: items })
  }

  const addStep = (type: string) => {
    const newStep = {
      id: `step${sequence.steps.length + 1}`,
      type,
      content: "",
      duration: 3000,
    }

    if (type === "search") {
      newStep.typingSpeed = 100
      newStep.showPredictions = true
      newStep.predictions = []
    } else if (type === "results") {
      newStep.results = []
    } else if (type === "video") {
      newStep.videoUrl = ""
    }

    setSequence({
      ...sequence,
      steps: [...sequence.steps, newStep],
    })

    setSelectedStep(sequence.steps.length)
  }

  const updateStep = (index: number, data: any) => {
    const updatedSteps = [...sequence.steps]
    updatedSteps[index] = { ...updatedSteps[index], ...data }
    setSequence({ ...sequence, steps: updatedSteps })
  }

  const deleteStep = (index: number) => {
    const updatedSteps = sequence.steps.filter((_: any, i: number) => i !== index)
    setSequence({ ...sequence, steps: updatedSteps })
    setSelectedStep(null)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-4" onClick={() => handleNavigation("/admin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Input
              value={sequence.title}
              onChange={(e) => setSequence({ ...sequence, title: e.target.value })}
              className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              placeholder="Sequence Title"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleNavigation(`/sequence/${params.id}`)}
              className="hover:bg-gray-900"
            >
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={() => console.log("Saving sequence:", sequence)} className="hover:bg-gray-900">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <Tabs defaultValue="sequence" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-black border-gray-800">
            <TabsTrigger value="sequence">Sequence</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="sequence" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sequence Steps */}
              <div className="lg:col-span-1">
                <Card className="bg-black border-gray-800 relative overflow-hidden">
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

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Sequence Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="steps">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {sequence.steps.map((step: any, index: number) => (
                              <Draggable key={step.id} draggableId={step.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-3 rounded-md cursor-pointer ${
                                      selectedStep === index ? "bg-gray-800" : "bg-black hover:bg-gray-900"
                                    }`}
                                    onClick={() => setSelectedStep(index)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        {step.type === "search" && (
                                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                            <Search />
                                          </div>
                                        )}
                                        {step.type === "results" && (
                                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                                            <LayoutGrid />
                                          </div>
                                        )}
                                        {step.type === "video" && (
                                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                                            <Play className="h-4 w-4 text-green-400" />
                                          </div>
                                        )}
                                        <div>
                                          <div className="font-medium capitalize">{step.type}</div>
                                          <div className="text-xs text-gray-400 truncate max-w-[180px]">
                                            {step.content || "No content"}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-500">{step.duration / 1000}s</div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    {sequence.steps.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No steps added yet. Add your first step below.
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-gray-800 flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => addStep("search")} className="hover:bg-gray-900">
                      <Plus className="h-3 w-3 mr-1" />
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addStep("results")}
                      className="hover:bg-gray-900"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Results
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addStep("video")} className="hover:bg-gray-900">
                      <Plus className="h-3 w-3 mr-1" />
                      Video
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Step Editor */}
              <div className="lg:col-span-2">
                {selectedStep !== null && sequence.steps[selectedStep] ? (
                  <Card className="bg-black border-gray-800 relative overflow-hidden">
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

                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-medium capitalize">
                        {sequence.steps[selectedStep].type} Step
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-gray-900"
                        onClick={() => deleteStep(selectedStep)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Common fields for all step types */}
                      <div className="space-y-2">
                        <Label>Step Duration (seconds)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[sequence.steps[selectedStep].duration / 1000]}
                            min={1}
                            max={20}
                            step={0.5}
                            onValueChange={(value) => updateStep(selectedStep, { duration: value[0] * 1000 })}
                            className="flex-1"
                          />
                          <div className="w-12 text-center">{sequence.steps[selectedStep].duration / 1000}s</div>
                        </div>
                      </div>

                      {/* Search step specific fields */}
                      {sequence.steps[selectedStep].type === "search" && (
                        <>
                          <div className="space-y-2">
                            <Label>Search Query</Label>
                            <Input
                              value={sequence.steps[selectedStep].content || ""}
                              onChange={(e) => updateStep(selectedStep, { content: e.target.value })}
                              placeholder="Enter search query"
                              className="bg-black border-gray-800"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Typing Speed (ms per character)</Label>
                            <div className="flex items-center gap-4">
                              <Slider
                                value={[sequence.steps[selectedStep].typingSpeed || 100]}
                                min={10}
                                max={300}
                                step={10}
                                onValueChange={(value) => updateStep(selectedStep, { typingSpeed: value[0] })}
                                className="flex-1"
                              />
                              <div className="w-12 text-center">
                                {sequence.steps[selectedStep].typingSpeed || 100}ms
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-predictions">Show Search Predictions</Label>
                            <Switch
                              id="show-predictions"
                              checked={sequence.steps[selectedStep].showPredictions}
                              onCheckedChange={(checked) => updateStep(selectedStep, { showPredictions: checked })}
                            />
                          </div>

                          {sequence.steps[selectedStep].showPredictions && (
                            <div className="space-y-2">
                              <Label>Search Predictions (one per line)</Label>
                              <Textarea
                                value={(sequence.steps[selectedStep].predictions || []).join("\n")}
                                onChange={(e) =>
                                  updateStep(selectedStep, {
                                    predictions: e.target.value.split("\n").filter(Boolean),
                                  })
                                }
                                placeholder="Enter search predictions"
                                className="bg-black border-gray-800 min-h-[100px]"
                              />
                            </div>
                          )}
                        </>
                      )}

                      {/* Results step specific fields */}
                      {sequence.steps[selectedStep].type === "results" && (
                        <>
                          <div className="space-y-2">
                            <Label>Search Query</Label>
                            <Input
                              value={sequence.steps[selectedStep].content || ""}
                              onChange={(e) => updateStep(selectedStep, { content: e.target.value })}
                              placeholder="Enter search query shown in results"
                              className="bg-black border-gray-800"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <Label>Results</Label>
                              <Button variant="outline" size="sm" className="hover:bg-gray-900">
                                <Plus className="h-3 w-3 mr-1" />
                                Add Result
                              </Button>
                            </div>

                            <div className="space-y-3">
                              {(sequence.steps[selectedStep].results || []).map((result: any, idx: number) => (
                                <Card key={idx} className="bg-black border-gray-800">
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="font-medium">{result.title}</div>
                                      <Select defaultValue={result.type}>
                                        <SelectTrigger className="w-24 h-7 text-xs">
                                          <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="video">Video</SelectItem>
                                          <SelectItem value="image">Image</SelectItem>
                                          <SelectItem value="text">Text</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="text-xs text-gray-400">{result.description}</div>
                                  </CardContent>
                                </Card>
                              ))}

                              {(!sequence.steps[selectedStep].results ||
                                sequence.steps[selectedStep].results.length === 0) && (
                                <div className="text-center py-4 text-gray-500 text-sm">No results added yet</div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Video step specific fields */}
                      {sequence.steps[selectedStep].type === "video" && (
                        <>
                          <div className="space-y-2">
                            <Label>Video Title</Label>
                            <Input
                              value={sequence.steps[selectedStep].content || ""}
                              onChange={(e) => updateStep(selectedStep, { content: e.target.value })}
                              placeholder="Enter video title"
                              className="bg-black border-gray-800"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Video URL</Label>
                            <Input
                              value={sequence.steps[selectedStep].videoUrl || ""}
                              onChange={(e) => updateStep(selectedStep, { videoUrl: e.target.value })}
                              placeholder="Enter video URL"
                              className="bg-black border-gray-800"
                            />
                          </div>

                          <div className="aspect-video bg-black rounded-md overflow-hidden">
                            {sequence.steps[selectedStep].videoUrl ? (
                              <div className="w-full h-full flex items-center justify-center bg-black text-gray-500">
                                Video preview (URL: {sequence.steps[selectedStep].videoUrl.substring(0, 30)}...)
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                No video URL provided
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-black border-gray-800 relative overflow-hidden">
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

                    <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                      <div className="text-gray-500 mb-4">
                        {sequence.steps.length === 0
                          ? "Add a step to get started"
                          : "Select a step to edit its properties"}
                      </div>

                      {sequence.steps.length === 0 && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addStep("search")}
                            className="hover:bg-gray-900"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Search Step
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black border-gray-800 relative overflow-hidden">
                {/* Frost/glare effect */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                    backgroundSize: "200% 200%",
                    animation: "glare 10s ease-in-out infinite",
                  }}
                />

                <CardHeader>
                  <CardTitle>Sequence Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sequence-title">Title</Label>
                    <Input
                      id="sequence-title"
                      value={sequence.title}
                      onChange={(e) => setSequence({ ...sequence, title: e.target.value })}
                      className="bg-black border-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sequence-description">Description</Label>
                    <Textarea
                      id="sequence-description"
                      value={sequence.description}
                      onChange={(e) => setSequence({ ...sequence, description: e.target.value })}
                      className="bg-black border-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sequence-thumbnail">Thumbnail</Label>
                    <div className="bg-black border border-gray-800 rounded-md p-4 text-center text-gray-500">
                      Thumbnail preview (first letter: {sequence.title.charAt(0).toUpperCase()})
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="sequence-published">Published</Label>
                    <Switch id="sequence-published" defaultChecked={!isNew} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-800 relative overflow-hidden">
                {/* Frost/glare effect */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                    backgroundSize: "200% 200%",
                    animation: "glare 10s ease-in-out infinite",
                  }}
                />

                <CardHeader>
                  <CardTitle>Playback Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Interaction Mode</Label>
                    <Select defaultValue="automatic">
                      <SelectTrigger className="bg-black border-gray-800">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatic">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Automatic (Timed)
                          </div>
                        </SelectItem>
                        <SelectItem value="manual">
                          <div className="flex items-center">
                            <MousePointer className="h-4 w-4 mr-2" />
                            Manual (Click to Advance)
                          </div>
                        </SelectItem>
                        <SelectItem value="interactive">
                          <div className="flex items-center">
                            <Keyboard className="h-4 w-4 mr-2" />
                            Interactive (User Input)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Loop Sequence</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Restart sequence when finished</span>
                      <Switch id="loop-sequence" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Show Custom Cursor</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Display a custom cursor during playback</span>
                      <Switch id="custom-cursor" defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Show Controls</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Display playback controls</span>
                      <Switch id="show-controls" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
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
