import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id } = params
    const data = await request.json()

    await prisma.variante.deleteMany({
      where: { productoId: id },
    })

    const producto = await prisma.producto.update({
      where: { id },
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
    console.error("[v0] Update producto error:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id } = params

    await prisma.producto.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete producto error:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
