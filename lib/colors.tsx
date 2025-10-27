export const PRODUCT_COLORS = [
  { name: "Negro", hex: "#000000" },
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Rojo", hex: "#DC2626" },
  { name: "Azul", hex: "#2563EB" },
  { name: "Verde", hex: "#16A34A" },
  { name: "Amarillo", hex: "#EAB308" },
  { name: "Naranja", hex: "#EA580C" },
  { name: "Rosa", hex: "#EC4899" },
  { name: "Morado", hex: "#9333EA" },
  { name: "Gris", hex: "#6B7280" },
  { name: "Azul Marino", hex: "#1E3A8A" },
  { name: "Verde Oliva", hex: "#65A30D" },
] as const

export type ProductColor = (typeof PRODUCT_COLORS)[number]

export function getColorByHex(hex: string): ProductColor | undefined {
  return PRODUCT_COLORS.find((c) => c.hex.toLowerCase() === hex.toLowerCase())
}

export function getColorByName(name: string): ProductColor | undefined {
  return PRODUCT_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase())
}
