import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface InputValueServicesProps {
  value?: number | null;
  onChange?: (value: number) => void;
  className?: string;
  onFocus?: () => void;
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const InputValueServices = ({ value = 0, onChange, className, onFocus }: InputValueServicesProps) => {
  const [inputValue, setInputValue] = useState<number | null>(value || null);


  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const rawValue = event.target.value.replace(/\D/g, ""); // Remove tudo que não for número
  //   const numericValue = rawValue ? parseFloat(rawValue) / 100 : null; // Converte centavos corretamente

  //   setInputValue(numericValue);
  //   if (numericValue !== null) {
  //     onChange?.(numericValue);
  //   }
  // };

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
      type="text"
      placeholder="Digite aqui..."
      // value={inputValue !== null ? formatCurrency(inputValue) : ""}
      // onChange={handleChange}
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