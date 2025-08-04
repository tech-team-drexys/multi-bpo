import { useState, useCallback } from "react";

export const usePhoneMask = (initialValue: string = "") => {
  const [value, setValue] = useState(initialValue);

  const applyMask = useCallback((input: string) => {
    // Remove tudo que não é número
    const numbers = input.replace(/\D/g, "");

    // Aplica a máscara (XX) XXXXX-XXXX
    let masked = "";

    if (numbers.length <= 2) {
      masked = `(${numbers}`;
    } else if (numbers.length <= 7) {
      masked = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      masked = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7
      )}`;
    } else {
      // Limita a 11 dígitos (DDD + 9 dígitos)
      masked = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }

    return masked;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const masked = applyMask(input);
      setValue(masked);
    },
    [applyMask]
  );

  const getNumbersOnly = useCallback(() => {
    return value.replace(/\D/g, "");
  }, [value]);

  const clearMask = useCallback(() => {
    setValue("");
  }, []);

  return {
    value,
    handleChange,
    getNumbersOnly,
    clearMask,
    setValue: (newValue: string) => setValue(applyMask(newValue)),
  };
};
