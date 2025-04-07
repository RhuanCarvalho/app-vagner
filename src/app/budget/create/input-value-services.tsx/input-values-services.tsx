import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface InputValueServicesProps {
  value?: number | null;
  onChange?: (value: number) => void;
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const InputValueServices = ({ value = 0, onChange }: InputValueServicesProps) => {
  const [inputValue, setInputValue] = useState<number | null>(value || null);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    const numericValue = rawValue ? parseFloat(rawValue) / 100 : null; // Converte centavos corretamente

    setInputValue(numericValue);
    if (numericValue !== null) {
      onChange?.(numericValue);
    }
  };

  return (
    <input
     className="text-right"
      type="text"
      value={inputValue !== null ? formatCurrency(inputValue) : ""}
      placeholder="Digite aqui..."
      onChange={handleChange}
    />
  );
};

interface InputValueServicesCustomProps {
  value?: number | null;
  onChange?: (value: number) => void;
  className?: string;
  placeholder?: string;
}

export const InputValueServicesCustom = ({ value = 0, onChange, className, placeholder }: InputValueServicesCustomProps) => {
  const [inputValue, setInputValue] = useState<number | null>(value || null);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    const numericValue = rawValue ? parseFloat(rawValue) / 100 : null; // Converte centavos corretamente

    setInputValue(numericValue);
    if (numericValue !== null) {
      onChange?.(numericValue);
    }
  };

  return (
    <input
     className={twMerge("text-right", className)}
      type="text"
      value={inputValue !== null ? formatCurrency(inputValue) : ""}
      placeholder={!!placeholder ? placeholder : "Digite aqui..."}
      onChange={handleChange}
    />
  );
};