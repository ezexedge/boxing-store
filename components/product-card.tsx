import Link from "next/link"
import Image from "next/image"
import type { Producto } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ColorDisplay } from "@/components/color-display"

interface ProductCardProps {
  producto: Producto
}

export function ProductCard({ producto }: ProductCardProps) {
  const totalStock = producto.variantes?.reduce((sum, variante) => sum + variante.stock, 0) || 0
  const availableColors = [...new Set(producto.variantes?.map((v) => v.color) || [])]

  return (
    <Link href={`/producto/${producto.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square relative bg-neutral-100">
          <Image
            src={producto.imagenes[0] || "/placeholder.svg?height=400&width=400"}
            alt={producto.nombre}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{producto.nombre}</h3>
          <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{producto.descripcion}</p>
          <p className="text-xl font-bold">${producto.precio.toLocaleString()}</p>
          {availableColors.length > 0 && (
            <div className="mt-2">
              <ColorDisplay colors={availableColors} size="sm" />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm text-neutral-600">
            {totalStock > 0 ? `Stock disponible: ${totalStock} unidades` : "Sin stock"}
          </p>
        </CardFooter>
      </Card>
    </Link>
  )
}
