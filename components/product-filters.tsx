"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void
  availableColors: string[]
  availableSizes: string[]
}

export interface FilterState {
  categorias: string[]
  colores: string[]
  talles: string[]
}

const CATEGORIAS = [
  { value: "remeras", label: "Remeras" },
  { value: "shorts", label: "Shorts" },
  { value: "buzos", label: "Buzos" },
  { value: "tops", label: "Tops" },
]

export function ProductFilters({ onFilterChange, availableColors, availableSizes }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categorias: [],
    colores: [],
    talles: [],
  })

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [type]: prev[type].includes(value) ? prev[type].filter((v) => v !== value) : [...prev[type], value],
      }
      onFilterChange(newFilters)
      return newFilters
    })
  }

  const clearFilters = () => {
    const emptyFilters = {
      categorias: [],
      colores: [],
      talles: [],
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = filters.categorias.length > 0 || filters.colores.length > 0 || filters.talles.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtros</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Categoría Filter */}
      <div className="space-y-3">
        <h3 className="font-medium">Categoría</h3>
        <div className="space-y-2">
          {CATEGORIAS.map((categoria) => (
            <div key={categoria.value} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${categoria.value}`}
                checked={filters.categorias.includes(categoria.value)}
                onCheckedChange={() => toggleFilter("categorias", categoria.value)}
              />
              <Label htmlFor={`cat-${categoria.value}`} className="cursor-pointer">
                {categoria.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      {availableColors.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Color</h3>
          <div className="space-y-2">
            {availableColors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.colores.includes(color)}
                  onCheckedChange={() => toggleFilter("colores", color)}
                />
                <Label htmlFor={`color-${color}`} className="cursor-pointer">
                  {color}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Talle Filter */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Talle</h3>
          <div className="space-y-2">
            {availableSizes.map((talle) => (
              <div key={talle} className="flex items-center space-x-2">
                <Checkbox
                  id={`talle-${talle}`}
                  checked={filters.talles.includes(talle)}
                  onCheckedChange={() => toggleFilter("talles", talle)}
                />
                <Label htmlFor={`talle-${talle}`} className="cursor-pointer">
                  {talle}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
