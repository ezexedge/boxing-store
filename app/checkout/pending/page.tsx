"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export default function CheckoutPendingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Clock className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Pago Pendiente</h1>
          <p className="text-neutral-600 mb-6">Tu pago está siendo procesado. Te notificaremos cuando se complete.</p>
          <Button className="w-full" onClick={() => router.push("/")}>
            Volver a la Tienda
          </Button>
        </div>
      </main>
    </div>
  )
}
