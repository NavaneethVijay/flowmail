"use client"

import React, { useState, type KeyboardEvent } from "react"
import { Input } from "./input"
import { Button } from "./button"
import { X, Plus } from "lucide-react"

interface ChipsInputProps {
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  prependSymbol?: string
  className?: string
  validate?: (value: string) => boolean
  maxChips?: number
}

export function ChipsInput({
  value,
  onChange,
  placeholder = "Type and press Enter...",
  prependSymbol = "",
  className,
  validate,
  maxChips = 100,
}: ChipsInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleAddChip = () => {
    const chip = inputValue.trim()
    if (!chip) return

    const formatted = prependSymbol ?
      (chip.startsWith(prependSymbol) ? chip.slice(prependSymbol.length) : chip)
      : chip

    if (validate && !validate(formatted)) return
    if (!value.includes(formatted) && value.length < maxChips) {
      onChange([...value, formatted])
      setInputValue("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddChip()
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeChip = (chipToRemove: string) => {
    onChange(value.filter((chip) => chip !== chipToRemove))
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md bg-background">
        {value.map((chip) => (
          <div
            key={chip}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-primary/10 text-primary"
          >
            <span>{prependSymbol}{chip}</span>
            <button
              type="button"
              onClick={() => removeChip(chip)}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary/20"
              aria-label={`Remove ${chip}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-0 shadow-none h-8 px-0"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {value.length > 0 ? `${value.length} item${value.length !== 1 ? "s" : ""}` : "No items added"}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddChip}
          disabled={!inputValue.trim()}
          className="h-8"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  )
}
