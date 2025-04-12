import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface InputValueServicesProps {
  value?: number | null;
  onChange?: (value: number) => void;
  className?: string;
  onFocus?: () => void;
  disabled?: boolean;
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const InputValueServices = ({ value = 0, onChange, className, onFocus, disabled=false }: InputValueServicesProps) => {

  const [displayValue, setDisplayValue] = useState(formatCurrency(value as number));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const numeric = input.replace(/\D/g, ""); // só números
    const floatValue = numeric ? parseFloat(numeric) / 100 : 0;

    setDisplayValue(formatCurrency(floatValue));
    onChange?.(floatValue); // sempre envia número, mesmo que 0
  };

  return (
    <input
      className={twMerge("text-right", className)}
      disabled={disabled}
      type="text"
      placeholder="Digite aqui..."
      value={displayValue}
      onChange={handleChange}
      onFocus={onFocus}
    />
  );
};

interface InputValueServicesCustomProps {
  value?: number | null;
  onChange?: (value: number) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const InputValueServicesCustom = ({ value = 0, onChange, className, placeholder, disabled = false }: InputValueServicesCustomProps) => {
  
  const [displayValue, setDisplayValue] = useState(formatCurrency(value as number));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const numeric = input.replace(/\D/g, ""); // só números
    const floatValue = numeric ? parseFloat(numeric) / 100 : 0;

    setDisplayValue(formatCurrency(floatValue));
    onChange?.(floatValue); // sempre envia número, mesmo que 0
  };
  
  useEffect(()=> {
    setDisplayValue(formatCurrency(value as number));
    onChange?.(value as number); // sempre envia número, mesmo que 0
  }, [value])

  return (
    <input
      className={twMerge("text-right", className)}
      disabled={disabled}
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={!!placeholder ? placeholder : "Digite aqui..."}
    />
  );
};