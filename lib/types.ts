export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  role: "user" | "admin"
}

export interface Variante {
  id: string
  productoId: string
  color: string
  talle: string
  stock: number
  createdAt: Date
  updatedAt: Date
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: "remeras" | "shorts" | "buzos" | "tops"
  genero: "hombre" | "mujer"
  imagenes: string[]
  variantes: Variante[]
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productoId: string
  nombre: string
  precio: number
  cantidad: number
  color?: string
  talle?: string
  imagen: string
}

export interface Pedido {
  id: string
  userId: string
  total: number
  estado: "pendiente" | "pagado" | "enviado" | "entregado"
  mercadopagoId?: string
  createdAt: Date
  updatedAt: Date
  items: PedidoItem[]
}

export interface PedidoItem {
  id: string
  productoId: string
  cantidad: number
  precio: number
  color?: string
  talle?: string
  producto: Producto
}
