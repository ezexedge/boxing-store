import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { mercadopago } from "@/lib/mercadopago"

export async function POST(request: Request) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 })
    }

    // Calculate total and create order
    const total = items.reduce((sum: number, item: any) => sum + item.precio * item.cantidad, 0)

    // Create order in database
    const pedido = await prisma.pedido.create({
      data: {
        userId: payload.userId,
        total,
        estado: "pendiente",
        items: {
          create: items.map((item: any) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precio: item.precio,
            color: item.color,
            talle: item.talle,
          })),
        },
      },
    })

    // Create MercadoPago preference
    const preference = await mercadopago.preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.productoId,
          title: item.nombre,
          quantity: item.cantidad,
          unit_price: item.precio,
          currency_id: "ARS",
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?pedidoId=${pedido.id}`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/pending`,
        },
        auto_return: "approved",
        external_reference: pedido.id,
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/webhooks/mercadopago`,
      },
    })

    // Update order with MercadoPago ID
    await prisma.pedido.update({
      where: { id: pedido.id },
      data: { mercadopagoId: preference.id },
    })

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      pedidoId: pedido.id,
    })
  } catch (error) {
    console.error("[v0] Create checkout error:", error)
    return NextResponse.json({ error: "Error al crear el checkout" }, { status: 500 })
  }
}
