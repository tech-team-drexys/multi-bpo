import React, { useState } from "react";
import { PhoneInput } from "./phone-input";

// Exemplo de uso do PhoneInput
export const PhoneInputExample = () => {
  const [phone, setPhone] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Exemplo de uso do PhoneInput</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefone com máscara
        </label>
        <PhoneInput
          placeholder="(11) 99999-9999"
          value={phone}
          onChange={setPhone}
          onNumbersChange={setPhoneNumbers}
          className="w-full"
        />
      </div>

      <div className="text-sm text-gray-600">
        <p>Valor com máscara: {phone}</p>
        <p>Apenas números: {phoneNumbers}</p>
      </div>
    </div>
  );
};
