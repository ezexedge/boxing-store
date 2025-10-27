"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Producto } from "@/lib/types"
import { Header } from "@/components/header"
import { ProductCarousel } from "@/components/product-carousel"
import { HeroBanner } from "@/components/hero-banner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"

export default function HomePage() {
  const searchParams = useSearchParams()
  const genero = searchParams.get("genero")
  const categoria = searchParams.get("categoria")

  const [latestProducts, setLatestProducts] = useState<Producto[]>([])
  const [menProducts, setMenProducts] = useState<Producto[]>([])
  const [womenProducts, setWomenProducts] = useState<Producto[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHomeProducts()
  }, [genero, categoria])

  const fetchHomeProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/productos")
      const data = await response.json()

      if (!data.productos || !Array.isArray(data.productos)) {
        console.error("[v0] Invalid API response:", data)
        return
      }

      if (genero || categoria) {
        let filtered = data.productos
        if (genero) {
          filtered = filtered.filter((p: Producto) => p.genero === genero)
        }
        if (categoria) {
          filtered = filtered.filter((p: Producto) => p.categoria === categoria)
        }
        setFilteredProducts(filtered)
      } else {
        // Default homepage view
        const sorted = [...data.productos].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        setLatestProducts(sorted.slice(0, 8))

        const menProds = data.productos.filter((p: Producto) => p.genero === "hombre")
        const womenProds = data.productos.filter((p: Producto) => p.genero === "mujer")

        setMenProducts(shuffleArray(menProds).slice(0, 8))
        setWomenProducts(shuffleArray(womenProds).slice(0, 8))
      }
    } catch (error) {
      console.error("[v0] Fetch productos error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const ProductSection = ({
    title,
    products,
    viewAllLink,
  }: {
    title: string
    products: Producto[]
    viewAllLink?: string
  }) => (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-balance">{title}</h2>
        {viewAllLink && (
          <Button variant="ghost" asChild>
            <Link href={viewAllLink} className="flex items-center gap-2">
              Ver todo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      <ProductCarousel products={products} />
    </section>
  )

  const getFilteredTitle = () => {
    const generoText = genero === "hombre" ? "Hombre" : genero === "mujer" ? "Mujer" : ""
    const categoriaText = categoria ? categoria.charAt(0).toUpperCase() + categoria.slice(1) : ""

    if (generoText && categoriaText) {
      return `${categoriaText} para ${generoText}`
    } else if (generoText) {
      return `Productos para ${generoText}`
    } else if (categoriaText) {
      return categoriaText
    }
    return "Productos"
  }

  if (genero || categoria) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{getFilteredTitle()}</h1>
            <p className="text-neutral-600">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-neutral-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-600 mb-4">No se encontraron productos</p>
              <Button asChild>
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    )
  }

  // Default homepage view
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroBanner />

      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-16">
            {[...Array(3)].map((_, sectionIdx) => (
              <div key={sectionIdx}>
                <div className="h-8 w-48 bg-neutral-200 rounded mb-6 animate-pulse" />
                <div className="flex gap-6 overflow-hidden">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-none w-[280px] h-96 bg-neutral-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <ProductSection title="Últimos Ingresos" products={latestProducts} />

            {menProducts.length > 0 && (
              <ProductSection title="Productos para Hombre" products={menProducts} viewAllLink="/?genero=hombre" />
            )}

            {womenProducts.length > 0 && (
              <ProductSection title="Productos para Mujer" products={womenProducts} viewAllLink="/?genero=mujer" />
            )}
          </>
        )}
      </main>
    </div>
  )
}
