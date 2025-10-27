import { getColorByHex } from "@/lib/colors"

interface ColorDisplayProps {
  colors: string[]
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function ColorDisplay({ colors, size = "md", showLabel = false }: ColorDisplayProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className="flex items-center gap-1.5">
      {colors.slice(0, 5).map((hex, index) => {
        const color = getColorByHex(hex)
        return (
          <div
            key={index}
            className={`${sizeClasses[size]} rounded-full border border-neutral-300`}
            style={{ backgroundColor: hex }}
            title={color?.name || hex}
          />
        )
      })}
      {colors.length > 5 && <span className="text-xs text-neutral-500">+{colors.length - 5}</span>}
      {showLabel && colors.length === 1 && (
        <span className="text-sm text-neutral-600">{getColorByHex(colors[0])?.name}</span>
      )}
    </div>
  )
}
