import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const pedidos = await prisma.pedido.findMany({
      include: {
        user: {
          select: {
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        items: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ pedidos })
  } catch (error) {
    console.error("[v0] Get pedidos error:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}
