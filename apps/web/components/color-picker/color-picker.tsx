import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Check } from "lucide-react"
import { useState } from "react"

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
] as const

type Color = (typeof COLORS)[number]

type ColorPickerProps = {
  value?: Color
  onChange?: (color: string) => void
}

export function ColorPicker({ value = "#6366f1", onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value)

  function handleChange(nextColor: Color) {
    setColor(nextColor)
    onChange?.(nextColor)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-md"
            aria-label="Choose color"
          />
        }
      >
        <span
          className="size-4 rounded-sm"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div className="text-sm font-medium">Choose color</div>

          {/* Preset colors */}
          <div className="grid grid-cols-6 gap-2">
            {COLORS.map((preset) => {
              const selected = color.toLowerCase() === preset

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleChange(preset)}
                  className="flex size-8 items-center justify-center rounded-md transition hover:scale-105"
                  style={{ backgroundColor: preset }}
                  aria-label={preset}
                >
                  {selected && (
                    <Check className="size-4 text-white drop-shadow" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
