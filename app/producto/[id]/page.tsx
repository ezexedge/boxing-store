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
  const [mensajeStock, setMensajeStock] = useState<string>("")

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

  const getAvailableTalles = () => {
    if (!producto?.variantes) return []
    if (selectedColor) {
      const tallesForColor = producto.variantes
        .filter((v) => v.color === selectedColor)
        .map((v) => v.talle)
        .filter(Boolean)
      return [...new Set(tallesForColor)]
    }
    const allTalles = producto.variantes.map((v) => v.talle).filter(Boolean)
    return [...new Set(allTalles)]
  }

  const getSelectedVariantStock = () => {
    if (!producto?.variantes) return 0
    
    // Si solo hay color seleccionado pero no talle
    if (selectedColor && !selectedTalle) {
      const variantesConColor = producto.variantes.filter((v) => v.color === selectedColor)
      if (variantesConColor.length === 1) {
        return variantesConColor[0].stock
      }
      return 0
    }
    
    // Si hay ambos seleccionados
    if (selectedColor && selectedTalle) {
      const variante = producto.variantes.find((v) => v.color === selectedColor && v.talle === selectedTalle)
      return variante?.stock || 0
    }
    
    // Si no hay selección específica
    if (producto.variantes.length === 1) {
      return producto.variantes[0].stock
    }
    
    return 0
  }

  const getTotalStock = () => {
    if (!producto?.variantes) return 0
    return producto.variantes.reduce((sum, v) => sum + v.stock, 0)
  }

  const getStockForColor = (color: string) => {
    if (!producto?.variantes) return 0
    return producto.variantes.filter((v) => v.color === color).reduce((sum, v) => sum + v.stock, 0)
  }

  const getTalleStockForColor = (talle: string) => {
    if (!producto?.variantes || !selectedColor) return 0
    const variante = producto.variantes.find((v) => v.color === selectedColor && v.talle === talle)
    return variante?.stock || 0
  }

  const handleAddToCart = () => {
    if (!producto) return

    const availableColors = getAvailableColors()
    const availableTalles = getAvailableTalles()

    if (availableColors.length > 1 && !selectedColor) {
      alert("Por favor selecciona un color")
      return
    }
    
    if (availableTalles.length > 0 && !selectedTalle) {
      alert("Por favor selecciona un talle")
      return
    }

    const stock = getSelectedVariantStock()
    if (stock === 0) {
      alert("Esta variante no tiene stock disponible")
      return
    }

    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = currentCart.find(
      (item: any) =>
        item.productoId === producto.id &&
        item.color === (selectedColor || undefined) &&
        item.talle === (selectedTalle || undefined),
    )

    if (existingItem) {
      const totalCantidad = existingItem.cantidad + cantidad
      if (totalCantidad > stock) {
        alert(`No puedes agregar más de ${stock} unidades para esta variante.`)
        return
      }
    } else {
      if (cantidad > stock) {
        alert(`Solo hay ${stock} unidades disponibles para esta variante.`)
        return
      }
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
  const hasMultipleColors = availableColors.length > 1
  const hasTalles = availableTalles.length > 0
  const selectedStock = getSelectedVariantStock()
  const totalStock = getTotalStock()
  const shouldShowTalles = hasTalles && (hasMultipleColors ? selectedColor !== "" : true)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagen principal */}
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

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>

              <p className="text-3xl font-bold">${producto.precio.toLocaleString()}</p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Descripción</h2>
              <p className="text-neutral-700">{producto.descripcion}</p>
            </div>

            {/* Colores */}
            {hasMultipleColors && (
              <div>
                <h2 className="font-semibold mb-3">Color</h2>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((colorHex) => {
                    const color = getColorByHex(colorHex)
                    const isSelected = selectedColor === colorHex
                    const stockForColor = getStockForColor(colorHex)
                    const hasStock = stockForColor > 0
                    
                    return (
                      <button
                        key={colorHex}
                        onClick={() => {
                          if (!hasStock) return
                          setSelectedColor(colorHex)
                          setSelectedTalle("")
                          setMensajeStock("")
                        }}
                        disabled={!hasStock}
                        className="group relative"
                        title={color?.name || colorHex}
                      >
                        <div
                          className={`w-12 h-12 rounded-full border-2 transition-all ${
                            !hasStock 
                              ? "opacity-40 cursor-not-allowed border-neutral-200" 
                              : isSelected
                              ? "border-neutral-900 scale-110 shadow-lg"
                              : "border-neutral-300 hover:border-neutral-500 hover:scale-105"
                          }`}
                          style={{ backgroundColor: colorHex }}
                        />
                        {!hasStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-0.5 bg-neutral-400 rotate-45" />
                          </div>
                        )}
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded">
                          {color?.name || colorHex} {!hasStock && "(Sin stock)"}
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

            {/* Talles */}
            {shouldShowTalles && (
              <div>
                <h2 className="font-semibold mb-2">Talle</h2>
                <div className="flex flex-wrap gap-2">
                  {availableTalles.map((talle) => {
                    const talleStock = getTalleStockForColor(talle)
                    const isAvailable = talleStock > 0
                    const isSelected = selectedTalle === talle
                    
                    return (
                      <Button
                        key={talle}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => {
                          if (!isAvailable) {
                            setMensajeStock(`El talle ${talle} no tiene stock disponible.`)
                            return
                          }
                          setSelectedTalle(talle)
                          setMensajeStock("")
                        }}
                        disabled={!isAvailable}
                        className={`${
                          !isAvailable ? "opacity-40 cursor-not-allowed line-through" : ""
                        }`}
                      >
                        {talle}
                      </Button>
                    )
                  })}
                </div>
                {mensajeStock && <p className="text-sm text-red-500 mt-2">{mensajeStock}</p>}
              </div>
            )}
              <div className="mb-4">
                {selectedColor && selectedTalle ? (
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <p className="text-lg font-bold text-neutral-900">
                      {selectedStock > 0 ? `${selectedStock} unidades disponibles` : "Sin stock para esta combinación"}
                    </p>
                  </div>
                ) : selectedColor && hasTalles && !selectedTalle ? (
                 null
                ) : (
                  <p className="text-sm text-neutral-600">
                    {totalStock > 0 ? `Stock total: ${totalStock} unidades` : "Sin stock"}
                  </p>
                )}
              </div>
            {/* Cantidad */}
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
                    const maxStock = selectedStock > 0 ? selectedStock : totalStock
                    setCantidad(Math.min(maxStock, cantidad + 1))
                  }}
                  disabled={cantidad >= (selectedStock > 0 ? selectedStock : totalStock) || totalStock === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Agregar al carrito */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={
                totalStock === 0 || 
                selectedStock === 0 ||
                (hasMultipleColors && !selectedColor) ||
                (hasTalles && !selectedTalle)
              }
            >
              {totalStock === 0 
                ? "Sin Stock" 
                : selectedStock === 0 && selectedColor && selectedTalle
                ? "Sin Stock para esta combinación"
                : "Agregar al Carrito"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}