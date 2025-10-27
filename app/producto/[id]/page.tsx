"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import type { Producto } from "@/lib/types"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { ChevronLeft, Minus, Plus } from "lucide-react"
import { ImageZoom } from "@/components/image-zoom"
import { getColorByHex } from "@/lib/colors"

export default function ProductoPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedTalle, setSelectedTalle] = useState<string>("")
  const [cantidad, setCantidad] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchProducto()
  }, [params.id])

  const fetchProducto = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/productos/${params.id}`)
      const data = await response.json()

      if (data.error) {
        console.error("[v0] Fetch producto error:", data.error)
        setProducto(null)
        return
      }

      setProducto(data.producto)

      if (data.producto.variantes && data.producto.variantes.length === 1) {
        const variant = data.producto.variantes[0]
        setSelectedColor(variant.color)
        setSelectedTalle(variant.talle)
      } else if (data.producto.variantes && data.producto.variantes.length > 0) {
        // Auto-select if only one option exists
        const colores = [...new Set(data.producto.variantes.map((v: any) => v.color))]
        const talles = [...new Set(data.producto.variantes.map((v: any) => v.talle))]

        if (colores.length === 1) setSelectedColor(colores[0])
        if (talles.length === 1) setSelectedTalle(talles[0])
      }
    } catch (error) {
      console.error("[v0] Fetch producto error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAvailableColors = () => {
    if (!producto?.variantes) return []
    return [...new Set(producto.variantes.map((v) => v.color))]
  }

  const getAllTalles = () => {
    if (!producto?.variantes) return []
    return [...new Set(producto.variantes.map((v) => v.talle))]
  }

  const getAvailableTalles = () => {
    if (!producto?.variantes) return []
    if (selectedColor) {
      return [...new Set(producto.variantes.filter((v) => v.color === selectedColor).map((v) => v.talle))]
    }
    return [...new Set(producto.variantes.map((v) => v.talle))]
  }

  const getSelectedVariantStock = () => {
    if (!producto?.variantes || !selectedColor || !selectedTalle) return 0
    const variante = producto.variantes.find((v) => v.color === selectedColor && v.talle === selectedTalle)
    return variante?.stock || 0
  }

  const getTotalStock = () => {
    if (!producto?.variantes) return 0
    return producto.variantes.reduce((sum, v) => sum + v.stock, 0)
  }

  const getStockForColor = (color: string) => {
    if (!producto?.variantes) return 0
    return producto.variantes.filter((v) => v.color === color).reduce((sum, v) => sum + v.stock, 0)
  }

  const handleAddToCart = () => {
    if (!producto) return

    const availableColors = getAvailableColors()
    const availableTalles = getAvailableTalles()

    if (availableColors.length > 1 && !selectedColor) {
      alert("Por favor selecciona un color")
      return
    }
    if (availableTalles.length > 1 && !selectedTalle) {
      alert("Por favor selecciona un talle")
      return
    }

    const stock = getSelectedVariantStock()
    if (stock === 0) {
      alert("Esta variante no tiene stock disponible")
      return
    }

    addItem({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
      color: selectedColor || undefined,
      talle: selectedTalle || undefined,
      imagen: producto.imagenPortada || producto.imagenes[0],
    })

    alert("Producto agregado al carrito")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-neutral-200 rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-neutral-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
                <div className="h-24 bg-neutral-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-neutral-600">Producto no encontrado</p>
        </div>
      </div>
    )
  }

  const availableColors = getAvailableColors()
  const availableTalles = getAvailableTalles()
  const allTalles = getAllTalles()
  const hasMultipleColors = availableColors.length > 1
  const hasMultipleTalles = allTalles.length > 1
  const selectedStock = getSelectedVariantStock()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-neutral-100 rounded-lg overflow-hidden">
              <ImageZoom
                src={producto.imagenes[selectedImage] || "/placeholder.svg?height=600&width=600"}
                alt={producto.nombre}
                className="w-full h-full"
              />
            </div>
            {producto.imagenes.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {producto.imagenes.map((imagen, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative bg-neutral-100 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedImage === index ? "border-neutral-900" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={imagen || "/placeholder.svg"}
                      alt={`${producto.nombre} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
              <div className="mb-4">
                {producto.variantes?.length === 1 ? (
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <p className="text-sm font-medium text-neutral-700">
                      Color: <span className="font-semibold">{selectedColor}</span> | Talle:{" "}
                      <span className="font-semibold">{selectedTalle}</span>
                    </p>
                    <p className="text-lg font-bold text-neutral-900 mt-1">
                      {selectedStock > 0 ? `${selectedStock} unidades disponibles` : "Sin stock"}
                    </p>
                  </div>
                ) : selectedColor && selectedTalle ? (
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <p className="text-lg font-bold text-neutral-900">
                      {selectedStock > 0 ? `${selectedStock} unidades disponibles` : "Sin stock para esta combinación"}
                    </p>
                  </div>
                ) : selectedColor && !selectedTalle ? (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">
                      Selecciona un talle para ver el stock disponible
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Stock disponible en {selectedColor}: {getStockForColor(selectedColor)} unidades
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-600">
                    {selectedStock > 0 ? `${selectedStock} unidades disponibles` : "Sin stock"}
                  </p>
                )}
              </div>
              <p className="text-3xl font-bold">${producto.precio.toLocaleString()}</p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Descripción</h2>
              <p className="text-neutral-700">{producto.descripcion}</p>
            </div>

            {producto.variantes?.length !== 1 && (
              <>
                {/* Color Selector - Only show if multiple colors */}
                {hasMultipleColors && (
                  <div>
                    <h2 className="font-semibold mb-3">Color</h2>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map((colorHex) => {
                        const color = getColorByHex(colorHex)
                        const isSelected = selectedColor === colorHex
                        return (
                          <button
                            key={colorHex}
                            onClick={() => {
                              setSelectedColor(colorHex)
                              const tallesForColor = producto.variantes
                                ?.filter((v) => v.color === colorHex)
                                .map((v) => v.talle)
                              if (selectedTalle && !tallesForColor?.includes(selectedTalle)) {
                                setSelectedTalle("")
                              }
                            }}
                            className="group relative"
                            title={color?.name || colorHex}
                          >
                            <div
                              className={`w-12 h-12 rounded-full border-2 transition-all ${
                                isSelected
                                  ? "border-neutral-900 scale-110 shadow-lg"
                                  : "border-neutral-300 hover:border-neutral-500 hover:scale-105"
                              }`}
                              style={{ backgroundColor: colorHex }}
                            />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded">
                              {color?.name || colorHex}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    {selectedColor && (
                      <p className="text-sm text-neutral-600 mt-3">
                        Color seleccionado: {getColorByHex(selectedColor)?.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Size Selector - Only show if multiple sizes */}
                {hasMultipleTalles && (
                  <div>
                    <h2 className="font-semibold mb-2">Talle</h2>
                    <div className="flex flex-wrap gap-2">
                      {allTalles.map((talle) => {
                        const isAvailable = producto.variantes?.some(
                          (v) => v.talle === talle && v.stock > 0 && (!selectedColor || v.color === selectedColor),
                        )

                        return (
                          <Button
                            key={talle}
                            variant={selectedTalle === talle ? "default" : "outline"}
                            onClick={() => setSelectedTalle(talle)}
                            disabled={!isAvailable}
                            className={!isAvailable ? "opacity-50" : ""}
                          >
                            {talle}
                          </Button>
                        )
                      })}
                    </div>
                    {selectedColor && (
                      <p className="text-xs text-neutral-500 mt-2">
                        {availableTalles.length > 0
                          ? `Talles disponibles para ${getColorByHex(selectedColor)?.name}`
                          : `No hay talles disponibles para ${getColorByHex(selectedColor)?.name}`}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Quantity Selector */}
            <div>
              <h2 className="font-semibold mb-2">Cantidad</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{cantidad}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const maxStock = selectedColor && selectedTalle ? selectedStock : getTotalStock()
                    setCantidad(Math.min(maxStock, cantidad + 1))
                  }}
                  disabled={cantidad >= (selectedColor && selectedTalle ? selectedStock : getTotalStock())}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={getTotalStock() === 0 || (selectedColor && selectedTalle && selectedStock === 0)}
            >
              {getTotalStock() === 0 ? "Sin Stock" : "Agregar al Carrito"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
