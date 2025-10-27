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

    const productos = await prisma.producto.findMany({
      include: {
        variantes: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ productos })
  } catch (error) {
    console.error("[v0] Get admin productos error:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const data = await request.json()

    const producto = await prisma.producto.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number.parseFloat(data.precio),
        categoria: data.categoria,
        genero: data.genero,
        imagenes: data.imagenes || [],
        imagenPortada: data.imagenPortada || data.imagenes?.[0] || null,
        variantes: {
          create: data.variantes || [],
        },
      },
      include: {
        variantes: true,
      },
    })

    return NextResponse.json({ producto })
  } catch (error) {
    console.error("[v0] Create producto error:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
