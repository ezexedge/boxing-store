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

    const [totalProductos, totalPedidos, pedidosPagados, ventasTotal] = await Promise.all([
      prisma.producto.count(),
      prisma.pedido.count(),
      prisma.pedido.count({ where: { estado: "pagado" } }),
      prisma.pedido.aggregate({
        where: { estado: "pagado" },
        _sum: { total: true },
      }),
    ])

    return NextResponse.json({
      totalProductos,
      totalPedidos,
      pedidosPagados,
      ventasTotal: ventasTotal._sum.total || 0,
    })
  } catch (error) {
    console.error("[v0] Get stats error:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
