"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const bannerImages = [
  {
    url: "/boxing-training-equipment-dark-background.jpg",
    title: "Equipamiento de Boxing de Alta Calidad",
    description: "Descubre nuestra colección de ropa deportiva diseñada para entrenamientos intensos.",
  },
  {
    url: "/professional-boxing-gear-athlete-training.jpg",
    title: "Entrena Como un Profesional",
    description: "Calidad profesional para atletas exigentes. Ropa que resiste tus entrenamientos más duros.",
  },
]

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    gsap.set(imageRefs.current[0], { opacity: 1, scale: 1 })
    gsap.set(contentRefs.current[0], { opacity: 1, y: 0 })

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length)
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    const nextIndex = currentIndex
    const prevIndex = (currentIndex - 1 + bannerImages.length) % bannerImages.length

    // Animate out previous slide
    gsap.to(imageRefs.current[prevIndex], {
      opacity: 0,
      scale: 1.1,
      duration: 1,
      ease: "power2.inOut",
    })
    gsap.to(contentRefs.current[prevIndex], {
      opacity: 0,
      y: -30,
      duration: 0.6,
      ease: "power2.inOut",
    })

    // Animate in current slide
    gsap.fromTo(
      imageRefs.current[nextIndex],
      { opacity: 0, scale: 1.1 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power2.inOut",
      },
    )
    gsap.fromTo(
      contentRefs.current[nextIndex],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
      },
    )
  }, [currentIndex])

  const goToSlide = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCurrentIndex(index)
    // Restart auto-rotation
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length)
    }, 5000)
  }

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-neutral-900">
      {bannerImages.map((banner, index) => (
        <div
          key={index}
          ref={(el) => {
            imageRefs.current[index] = el
          }}
          className="absolute inset-0 opacity-0"
        >
          <Image
            src={banner.url || "/placeholder.svg"}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>
      ))}

      <div className="relative h-full">
        {bannerImages.map((banner, index) => (
          <div
            key={index}
            ref={(el) => {
              contentRefs.current[index] = el
            }}
            className="absolute inset-0 opacity-0"
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-3xl text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">{banner.title}</h1>
                <p className="text-lg md:text-xl text-neutral-200 mb-8 text-pretty">{banner.description}</p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild className="bg-white text-neutral-900 hover:bg-neutral-100">
                    <Link href="/?genero=hombre">Colección Hombre</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white text-white hover:bg-white/10 bg-transparent"
                  >
                    <Link href="/?genero=mujer">Colección Mujer</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
