"use client"

import { useState, useRef, useEffect } from "react"
import type { Producto } from "@/lib/types"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductCarouselProps {
  products: Producto[]
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      return () => container.removeEventListener("scroll", checkScroll)
    }
  }, [products])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const targetScroll = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    })
  }

  if (products.length === 0) return null

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((producto) => (
          <div key={producto.id} className="flex-none w-[280px]">
            <ProductCard producto={producto} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
