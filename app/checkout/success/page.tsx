"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const pedidoId = searchParams.get("pedidoId")

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>
          <p className="text-neutral-600 mb-2">Tu pedido ha sido procesado correctamente.</p>
          {pedidoId && <p className="text-sm text-neutral-500 mb-6">Número de pedido: {pedidoId}</p>}
          <div className="space-y-2">
            <Button className="w-full" onClick={() => router.push("/")}>
              Volver a la Tienda
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
