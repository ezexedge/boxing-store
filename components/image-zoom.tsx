"use client"

import { useState, useRef, type MouseEvent } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ZoomIn } from "lucide-react"

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
}

export function ImageZoom({ src, alt, className = "" }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showZoom, setShowZoom] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPosition({ x, y })
  }

  return (
    <>
      <div
        ref={imageRef}
        className={`relative group cursor-zoom-in ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onClick={() => setIsZoomed(true)}
      >
        {/* Main Image */}
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />

        {/* Zoom Icon Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3 shadow-lg">
            <ZoomIn className="w-6 h-6 text-neutral-900" />
          </div>
        </div>

        {/* Hover Zoom Effect */}
        {showZoom && (
          <div
            className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: "200%",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </div>

      {/* Full Screen Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl w-full p-0">
          <div className="relative w-full h-[80vh]">
            <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-contain" priority />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
