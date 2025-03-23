"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Maximize, Minimize, File, FileText, Play, X, Music } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"

type MediaItem = {
  id: string
  type: "image" | "video" | "audio" | "pdf" | "other"
  url: string
  title?: string
  thumbnail?: string
}

interface MediaGalleryProps {
  items: MediaItem[]
  className?: string
}

export default function MediaGallery({ items, className }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Touch event handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrevious()
    }
  }

  // When modal opens, set current index to selected index
  useEffect(() => {
    if (selectedIndex !== null) {
      setCurrentIndex(selectedIndex)
    }
  }, [selectedIndex])

  return (
    <div className={cn("w-full", className)}>
      {/* Thumbnail grid */}
      <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent -mx-4 px-4 touch-pan-x">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border hover:border-primary focus:border-primary focus:outline-none transition-colors"
          >
            <ThumbnailRenderer item={item} />
          </button>
        ))}
      </div>

      {/* Modal for viewing media */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogOverlay className="bg-background/95" />
        <DialogContent
          className="bg-white max-w-full sm:max-w-[90vw] h-[90vh] p-0 border-none"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div
            ref={containerRef}
            className="w-full h-full flex flex-col bg-background rounded-lg overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Main viewer */}
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0">
                {selectedIndex !== null && <MediaRenderer item={items[currentIndex]} />}
              </div>

              {/* Top controls */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2 bg-gradient-to-b from-black/50 to-transparent text-white">
                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-black/20">
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
                <div className="text-sm font-medium">
                  {currentIndex + 1} / {items.length}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedIndex(null)}
                  className="text-white hover:bg-black/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Side navigation */}
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/30 text-white hover:bg-black/50"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/30 text-white hover:bg-black/50"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Thumbnail strip in modal */}
            <div className="flex overflow-x-auto p-2 gap-2 bg-muted/30 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent touch-pan-x">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2",
                    currentIndex === index ? "border-primary" : "border-transparent",
                  )}
                >
                  <ThumbnailRenderer item={item} />
                </button>
              ))}
            </div>

            {/* Title bar */}
            {items[currentIndex]?.title && (
              <div className="p-3 text-sm font-medium bg-background">{items[currentIndex].title}</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MediaRenderer({ item }: { item: MediaItem }) {
  switch (item.type) {
    case "image":
      return (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <img
            src={item.url || "/placeholder.svg?height=400&width=600"}
            alt={item.title || "Image"}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )
    case "video":
      return (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <video src={item.url} controls className="max-w-full max-h-full" poster={item.thumbnail} />
        </div>
      )
    case "audio":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-6">
          <div className="mb-6">
            <Music className="h-24 w-24 text-primary opacity-75" />
          </div>
          <div className="w-full max-w-md">
            <h3 className="text-lg font-medium text-center mb-4">{item.title || "Áudio"}</h3>
            <audio src={item.url} controls className="w-full" controlsList="nodownload" />
          </div>
        </div>
      )
    case "pdf":
      return (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <iframe src={item.url} className="w-full h-full" title={item.title || "PDF Document"} />
        </div>
      )
    default:
      return (
        <div className="flex items-center justify-center w-full h-full bg-muted">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-4"
          >
            <File className="h-12 w-12 text-primary" />
            <span className="text-sm font-medium">View File</span>
          </a>
        </div>
      )
  }
}

function ThumbnailRenderer({ item }: { item: MediaItem }) {
  switch (item.type) {
    case "image":
      return (
        <div className="w-full h-full bg-black">
          <img
            src={item.url || "/placeholder.svg?height=100&width=100"}
            alt={item.title || "Thumbnail"}
            className="w-full h-full object-cover"
          />
        </div>
      )
    case "video":
      return (
        <div className="relative w-full h-full bg-black">
          <img
            src={item.thumbnail || "/placeholder.svg?height=100&width=100"}
            alt={item.title || "Video thumbnail"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="h-6 w-6 text-white" />
          </div>
        </div>
      )
    case "audio":
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-b from-primary/10 to-primary/20">
          <Music className="h-10 w-10 text-primary" />
        </div>
      )
    case "pdf":
      return (
        <div className="flex items-center justify-center w-full h-full bg-muted">
          <FileText className="h-8 w-8 text-primary" />
        </div>
      )
    default:
      return (
        <div className="flex items-center justify-center w-full h-full bg-muted">
          <File className="h-8 w-8 text-primary" />
        </div>
      )
  }
}

