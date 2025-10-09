// components/ui/SelectWithSearch.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, Check } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface SelectWithSearchProps {
  options: Option[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function SelectWithSearch({
  options,
  value,
  onValueChange,
  placeholder = "Selecione uma opção",
  className = "",
  disabled = false
}: SelectWithSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (optionValue: string) => {
    if (disabled) return
    onValueChange(optionValue)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleToggle = () => {
    if (disabled) return
    setIsOpen(!isOpen)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        className={`w-full justify-between ${
          disabled 
            ? "bg-gray-100 cursor-not-allowed opacity-50" 
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className={
          disabled 
            ? "text-muted-foreground" 
            : selectedOption 
              ? "text-foreground" 
              : "text-muted-foreground"
        }>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${
          isOpen ? "rotate-180" : ""
        } ${disabled ? "text-muted-foreground" : ""}`} />
      </Button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Campo de busca */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3"
                autoFocus
              />
            </div>
          </div>

          {/* Lista de opções */}
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                Nenhuma opção encontrada
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                    option.value === value ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  {option.value === value && <Check className="h-4 w-4" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}