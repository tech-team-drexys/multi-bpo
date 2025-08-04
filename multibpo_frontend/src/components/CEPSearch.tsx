import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Check, Search, MapPin, Loader2 } from "lucide-react";

interface Address {
  id: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  complement?: string;
}

interface CEPSearchProps {
  onAddressSelect?: (address: Address | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function CEPSearch({
  onAddressSelect,
  label = "Endereço de Cobrança",
  placeholder = "Digite seu CEP",
  className = "",
}: CEPSearchProps) {
  // CEP search state
  const [cep, setCep] = useState("");
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock CEP search function
  const searchCEP = async (cepValue: string) => {
    setIsSearching(true);
    setHasSearched(false);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock address data based on CEP
    const mockAddresses: Address[] = [
      {
        id: "1",
        street: "Rua das Flores, 123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        cep: cepValue,
      },
      {
        id: "2",
        street: "Rua das Flores, 456",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        cep: cepValue,
        complement: "Apt 201",
      },
      {
        id: "3",
        street: "Rua das Flores, 789",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        cep: cepValue,
        complement: "Sala 15",
      },
    ];

    setSearchResults(mockAddresses);
    setIsSearching(false);
    setHasSearched(true);
  };

  const handleCEPSearch = () => {
    if (cep.length >= 8) {
      searchCEP(cep);
    }
  };

  const handleCEPChange = (value: string) => {
    // Format CEP as user types (XXXXX-XXX)
    const formatted = value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d{3})$/, "$1-$2");
    setCep(formatted);

    // Reset search results when CEP changes
    if (searchResults.length > 0) {
      setSearchResults([]);
      setSelectedAddress(null);
      setHasSearched(false);
      onAddressSelect?.(null);
    }
  };

  const selectAddress = (address: Address) => {
    setSelectedAddress(address);
    onAddressSelect?.(address);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

      {/* CEP Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={cep}
          onChange={(e) => handleCEPChange(e.target.value)}
          className="h-12 flex-1"
          maxLength={9}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCEPSearch}
          disabled={cep.length < 8 || isSearching}
          className="h-12 px-4"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-700">Buscando endereços...</span>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && searchResults.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Selecione seu endereço:
          </Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((address) => (
              <Card
                key={address.id}
                className={`cursor-pointer transition-all ${
                  selectedAddress?.id === address.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => selectAddress(address)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                      {selectedAddress?.id === address.id ? (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {address.street}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {address.neighborhood}, {address.city} - {address.state}
                      </p>
                      <p className="text-xs text-gray-500">
                        CEP: {address.cep}
                      </p>
                      {address.complement && (
                        <p className="text-xs text-gray-600 mt-1">
                          {address.complement}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {hasSearched && searchResults.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Nenhum endereço encontrado para este CEP. Verifique se o CEP está
            correto.
          </p>
        </div>
      )}

      {/* Selected Address Display */}
      {selectedAddress && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Endereço selecionado:
                </p>
                <p className="text-sm text-green-700">
                  {selectedAddress.street}
                </p>
                <p className="text-xs text-green-600">
                  {selectedAddress.neighborhood}, {selectedAddress.city} -{" "}
                  {selectedAddress.state}
                </p>
                <p className="text-xs text-green-600">
                  CEP: {selectedAddress.cep}
                </p>
                {selectedAddress.complement && (
                  <p className="text-xs text-green-600">
                    {selectedAddress.complement}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export type { Address };
