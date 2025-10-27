import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] MercadoPago webhook received:", body)

    // Handle payment notification
    if (body.type === "payment") {
      const paymentId = body.data.id

      // In production, you should verify the payment with MercadoPago API
      // For now, we'll update the order status based on the webhook

      const externalReference = body.external_reference

      if (externalReference) {
        await prisma.pedido.update({
          where: { id: externalReference },
          data: { estado: "pagado" },
        })

        console.log("[v0] Order updated to paid:", externalReference)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
