import React, { useState } from "react";
import { Input } from "./input";
import { Badge } from "./badge";
import { X } from "lucide-react";

interface ChipsInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  prependSymbol?: string;
  className?: string;
  validate?: (value: string) => boolean;
}

export function ChipsInput({
  value,
  onChange,
  placeholder,
  prependSymbol = "",
  className,
  validate,
}: ChipsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const addChip = () => {
    const chip = inputValue.trim();
    if (!chip) return;

    const formatted = prependSymbol ?
      (chip.startsWith(prependSymbol) ? chip.slice(prependSymbol.length) : chip)
      : chip;

    if (validate && !validate(formatted)) return;

    if (!value.includes(formatted)) {
      onChange([...value, formatted]);
      setInputValue("");
    }
  };

  const removeChip = (chipToRemove: string) => {
    onChange(value.filter((chip) => chip !== chipToRemove));
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addChip();
    }
  };

  return (
    <div className="space-y-2 w-full">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={className}
      />
      <div className="flex flex-wrap gap-2">
        {value.map((chip) => (
          <Badge
            key={chip}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {prependSymbol}{chip}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => removeChip(chip)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}