"use client"

import { CalendarIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { useState } from "react"

interface DatePickerProps {
  value?: Date | string | null
  onChange: (date: Date | null) => void
  placeholder?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const dateValue = value ? new Date(value) : undefined

  const handleSelect = (date: Date | undefined) => {
    onChange(date ?? null)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {dateValue ? (
              dateValue.toLocaleDateString()
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={dateValue} onSelect={handleSelect} />
        {value && (
          <div className="border p-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
            >
              Clear Date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
