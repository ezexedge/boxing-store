"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { useAuth } from "@/lib/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PedidoWithDetails {
  id: string
  total: number
  estado: string
  createdAt: string
  user: {
    nombre: string
    apellido: string
    email: string
  }
  items: Array<{
    cantidad: number
    precio: number
    color?: string
    talle?: string
    producto: {
      nombre: string
    }
  }>
}

export default function AdminPedidosPage() {
  const { token } = useAuth()
  const [pedidos, setPedidos] = useState<PedidoWithDetails[]>([])

  useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    try {
      const response = await fetch("/api/admin/pedidos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setPedidos(data.pedidos)
    } catch (error) {
      console.error("[v0] Fetch pedidos error:", error)
    }
  }

  const handleStatusChange = async (pedidoId: string, newEstado: string) => {
    try {
      const response = await fetch(`/api/admin/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: newEstado }),
      })

      if (response.ok) {
        fetchPedidos()
      }
    } catch (error) {
      console.error("[v0] Update pedido error:", error)
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Pedido #{pedido.id.slice(0, 8)}</h3>
                <p className="text-sm text-neutral-600">
                  {pedido.user.nombre} {pedido.user.apellido} - {pedido.user.email}
                </p>
                <p className="text-sm text-neutral-600">{new Date(pedido.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${pedido.total.toLocaleString()}</p>
                <Select value={pedido.estado} onValueChange={(value) => handleStatusChange(pedido.id, value)}>
                  <SelectTrigger className="w-40 mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="pagado">Pagado</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Items:</h4>
              <div className="space-y-2">
                {pedido.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.producto.nombre} x {item.cantidad}
                      {item.color && ` - ${item.color}`}
                      {item.talle && ` - ${item.talle}`}
                    </span>
                    <span className="font-semibold">${(item.precio * item.cantidad).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
