import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id } = await params
    const { estado } = await request.json()

    const pedido = await prisma.pedido.update({
      where: { id },
      data: { estado },
    })

    return NextResponse.json({ pedido })
  } catch (error) {
    console.error("[v0] Update pedido error:", error)
    return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 })
  }
}
