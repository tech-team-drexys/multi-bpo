import React from "react";
import { Input } from "./input";
import { usePhoneMask } from "@/hooks/usePhoneMask";

interface PhoneInputProps {
  id?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onNumbersChange?: (numbers: string) => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      id = "phone",
      placeholder = "(11) 99999-9999",
      className = "",
      required = false,
      disabled = false,
      value: externalValue,
      onChange,
      onNumbersChange,
      ...props
    },
    ref
  ) => {
    const { value, handleChange, getNumbersOnly, setValue } = usePhoneMask(
      externalValue || ""
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e);

      // Chama callbacks externos se fornecidos
      if (onChange) {
        onChange(e.target.value);
      }

      if (onNumbersChange) {
        onNumbersChange(getNumbersOnly());
      }
    };

    // Sincroniza com valor externo se fornecido
    React.useEffect(() => {
      if (externalValue !== undefined && externalValue !== value) {
        setValue(externalValue);
      }
    }, [externalValue, setValue, value]);

    return (
      <Input
        ref={ref}
        id={id}
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className={className}
        required={required}
        disabled={disabled}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";
