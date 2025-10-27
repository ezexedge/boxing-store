"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem } from "./types"

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productoId: string, color?: string, talle?: string) => void
  updateQuantity: (productoId: string, cantidad: number, color?: string, talle?: string) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Load cart from localStorage on mount
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.productoId === newItem.productoId && item.color === newItem.color && item.talle === newItem.talle,
      )

      if (existingIndex > -1) {
        const updated = [...currentItems]
        updated[existingIndex].cantidad += newItem.cantidad
        return updated
      }

      return [...currentItems, newItem]
    })
  }

  const removeItem = (productoId: string, color?: string, talle?: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => !(item.productoId === productoId && item.color === color && item.talle === talle)),
    )
  }

  const updateQuantity = (productoId: string, cantidad: number, color?: string, talle?: string) => {
    if (cantidad <= 0) {
      removeItem(productoId, color, talle)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productoId === productoId && item.color === color && item.talle === talle ? { ...item, cantidad } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
