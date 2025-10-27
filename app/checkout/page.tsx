"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    MercadoPago: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user, token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mpPublicKey, setMpPublicKey] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
      return
    }

    if (items.length === 0) {
      router.push("/carrito")
      return
    }

    fetch("/api/checkout/get-public-key")
      .then((res) => res.json())
      .then((data) => setMpPublicKey(data.publicKey))
      .catch((err) => console.error("[v0] Error fetching MP key:", err))

    // Load MercadoPago SDK
    const script = document.createElement("script")
    script.src = "https://sdk.mercadopago.com/js/v2"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [user, items, router])

  const handleCheckout = async () => {
    if (!mpPublicKey) {
      setError("Error al cargar la configuración de pago")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      })

      if (!response.ok) {
        throw new Error("Error al crear el checkout")
      }

      const data = await response.json()

      const mp = new window.MercadoPago(mpPublicKey)
      mp.checkout({
        preference: {
          id: data.preferenceId,
        },
        autoOpen: true,
      })

      // Clear cart after successful checkout creation
      clearCart()
    } catch (err) {
      console.error("[v0] Checkout error:", err)
      setError("Error al procesar el pago. Por favor intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={`${item.productoId}-${item.color}-${item.talle}`} className="flex justify-between">
                  <span>
                    {item.nombre} x {item.cantidad}
                    {item.color && ` - ${item.color}`}
                    {item.talle && ` - ${item.talle}`}
                  </span>
                  <span className="font-semibold">${(item.precio * item.cantidad).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

          <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading || !mpPublicKey}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Pagar con MercadoPago"
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
