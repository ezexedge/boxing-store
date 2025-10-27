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
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}
