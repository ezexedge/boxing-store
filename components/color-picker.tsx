"use client"

import { PRODUCT_COLORS } from "@/lib/colors"
import { Check } from "lucide-react"

interface ColorPickerProps {
  selectedColor: string
  onColorSelect: (hex: string) => void
  availableColors?: string[]
}

export function ColorPicker({ selectedColor, onColorSelect, availableColors }: ColorPickerProps) {
  const colors = availableColors ? PRODUCT_COLORS.filter((c) => availableColors.includes(c.hex)) : PRODUCT_COLORS

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color.hex}
          type="button"
          onClick={() => onColorSelect(color.hex)}
          className="group relative"
          title={color.name}
        >
          <div
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor === color.hex
                ? "border-neutral-900 scale-110"
                : "border-neutral-300 hover:border-neutral-500"
            }`}
            style={{ backgroundColor: color.hex }}
          >
            {selectedColor === color.hex && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check
                  className="w-5 h-5"
                  style={{ color: color.hex === "#FFFFFF" || color.hex === "#EAB308" ? "#000000" : "#FFFFFF" }}
                />
              </div>
            )}
          </div>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded">
            {color.name}
          </span>
        </button>
      ))}
    </div>
  )
}
