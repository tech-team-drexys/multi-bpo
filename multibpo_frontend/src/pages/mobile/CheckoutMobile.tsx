import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Ticket,
  Check,
  AlertCircle,
  Shield,
  Crown,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importando o componente CEPSearch
import { CEPSearch, type Address } from "@/components/CEPSearch";

interface CheckoutMobileProps {
  planName?: string;
  planDescription?: string;
  originalPrice?: number;
  discount?: number;
}

const CheckoutMobile = ({
  planName = "Plano Premium",
  planDescription = "Acesso completo à consultoria com IA da Multi BPO",
  originalPrice = 199.9,
  discount = 100.0,
}: CheckoutMobileProps) => {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [couponMessage, setCouponMessage] = useState("");

  // Estado para endereço selecionado via CEPSearch
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Cupons válidos (em produção, isso viria de uma API)
  const validCoupons = {
    QUEROAGORA: { discount: 100, description: "Desconto de 50%" },
    SPECIAL25: { discount: 25, description: "Desconto de R$ 25,00" },
    // Adicione novos cupons aqui:
    // NOVO50: { discount: 50, description: "Desconto de R$ 50,00" },
    // BLACKFRIDAY: { discount: 75, description: "Desconto de R$ 75,00" },
  };

  // Função para aplicar cupom
  const applyCoupon = () => {
    if (!coupon.trim()) {
      setCouponStatus("error");
      setCouponMessage("Digite um cupom válido");
      return;
    }

    setCouponStatus("loading");

    // Simula uma chamada de API
    setTimeout(() => {
      const upperCoupon = coupon.trim().toUpperCase();
      const couponData = validCoupons[upperCoupon as keyof typeof validCoupons];

      if (couponData) {
        setAppliedCoupon(upperCoupon);
        setCouponDiscount(couponData.discount);
        setCouponStatus("success");
        setCouponMessage(couponData.description);
        setCoupon(""); // Limpa o campo
      } else {
        setCouponStatus("error");
        setCouponMessage("Cupom inválido ou expirado");
      }
    }, 1000);
  };

  // Função para remover cupom
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponStatus("idle");
    setCouponMessage("");
  };

  // Calcula o total com base no cupom aplicado
  const total = originalPrice - (appliedCoupon ? couponDiscount : 0);

  // Função para lidar com a seleção de endereço do CEPSearch
  const handleAddressSelect = (address: Address | null) => {
    setSelectedAddress(address);
    if (address) {
      // Extrair informações do endereço selecionado
      const streetParts = address.street.split(", ");
      setStreet(streetParts[0] || "");
      setNumber(streetParts[1] || "");
      setNeighborhood(address.neighborhood);
      setCity(address.city);
      setState(address.state);
      setCep(address.cep);
      setComplement(address.complement || "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Checkout:", {
      cpfCnpj,
      cardNumber,
      cardholderName,
      expiryDate,
      cvc,
      address: { cep, street, number, complement, neighborhood, city, state },
      selectedAddress,
      appliedCoupon,
      couponDiscount,
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 min-[580px]:py-4">
      <div className="w-full min-[580px]:max-w-[32rem] min-[580px]:mx-auto flex">
        <Card className="min-[520px]:shadow-2xl shadow-none border-none min-[580px]:rounded-xl rounded-none py-4 px-3 flex flex-col w-full">
          <CardHeader className="pb-7 flex-shrink-0 bg-white text-gray-900 rounded-t-xl -m-3 mb-6 p-6 border-b border-gray-100">
            {/* Logo MULTI BPO */}
            <div className="flex justify-start mb-6">
              <img
                src="/lovable-uploads/logo.png"
                alt="MULTI BPO"
                className="h-8 w-auto"
              />
            </div>

            {/* Assinar Plano Premium */}
            <div className="text-sm text-gray-600 mb-1">Assinar {planName}</div>

            {/* Preço principal */}
            <div className="font-bold">
              <div className="flex items-center mb-4">
                <div
                  className={`${
                    appliedCoupon
                      ? "line-through text-gray-700 text-xl"
                      : "text-gray-800 text-4xl"
                  }`}
                >
                  R$ {originalPrice.toFixed(2)}
                  {!appliedCoupon && (
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      por mês
                    </span>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="text-3xl font-bold text-green-500 ml-4">
                    R$ {total.toFixed(2)}
                    <span className="text-sm font-normal text-green-500 ml-1">
                      por mês
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes do plano */}
            <div className="border-0 shadow-none bg-blue-50 rounded-md">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Crown className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="w-full">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {planName}
                    </h3>
                    <div className="flex items-start justify-between gap-10">
                      <div>
                        <p className="text-sm text-gray-600">
                          {planDescription}
                        </p>
                      </div>

                      <p className="text-sm font-medium text-blue-600 whitespace-nowrap">
                        R$ {originalPrice.toFixed(2)} / mês
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Formulário de checkout */}
          <CardContent className="flex-1 flex flex-col">
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Campo CPF/CNPJ */}
                <div>
                  <label
                    htmlFor="cpfCnpj"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CPF / CNPJ
                  </label>
                  <Input
                    id="cpfCnpj"
                    type="text"
                    placeholder="Digite seu CPF ou CNPJ"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    className="h-11 md:h-12 text-sm md:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Componente CEPSearch substituindo o input de endereço */}
                <CEPSearch
                  onAddressSelect={handleAddressSelect}
                  label="Endereço de Cobrança"
                  placeholder="Digite seu CEP"
                  className=""
                />

                {/* Forma de Pagamento */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Forma de Pagamento
                  </Label>
                  <Select defaultValue="card">
                    <SelectTrigger className="h-12">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Cartão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dados do cartão */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Dados do cartão
                  </h3>

                  <div className="space-y-2">
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 1234 1234 1234"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="cardExpiry"
                      type="text"
                      placeholder="MM / AA"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="h-12"
                      required
                    />
                    <Input
                      id="cardCvv"
                      type="text"
                      placeholder="CVC"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cardName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nome do titular do cartão
                    </Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="Nome completo"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                {/* Salvar dados para futuras compras */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Checkbox id="save-data" className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor="save-data"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Usar dados nas próximas compras
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Seus dados de pagamento e endereço serão salvos com
                      segurança para facilitar futuras compras.
                    </p>
                  </div>
                </div>

                {/* Resumo da Compra */}
                <div className="border-0 shadow-none bg-gray-50 p-6 rounded-2xl">
                  <div className="pb-6">
                    <p className="text-base font-medium">Resumo da Compra</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor:</span>
                      <span className="text-sm font-medium">
                        R$ {originalPrice.toFixed(2)}
                        <span className="text-sm font-thin text-gray-500 ml-1">
                          / mês
                        </span>
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Cupom ({appliedCoupon}):
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          - R$ {couponDiscount.toFixed(2)}
                          <span className="text-sm font-thin text-green-500 ml-1">
                            / mês
                          </span>
                        </span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="text-lg text-gray-800">
                        R$ {total.toFixed(2)}
                        <span className="text-sm font-thin text-gray-500 ml-1">
                          / mês
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campo Cupom de Desconto */}
              <div className="flex flex-col gap-4 pt-6">
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-blue-600" />
                      </div>
                      <Input
                        id="coupon"
                        type="text"
                        placeholder="Cupom de desconto"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                        className="h-12 text-base bg-white border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors !focus:outline-none !outline-none text-center pr-20"
                        disabled={couponStatus === "loading"}
                      />
                      <Button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponStatus === "loading" || !coupon.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3 text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {couponStatus === "loading"
                          ? "Aplicando..."
                          : "Aplicar"}
                      </Button>
                    </div>

                    {/* Mensagem de status do cupom */}
                    {couponStatus === "success" && (
                      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        <Check className="w-4 h-4" />
                        {couponMessage}
                      </div>
                    )}

                    {couponStatus === "error" && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        {couponMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-green-800">
                          Cupom aplicado: {appliedCoupon}
                        </div>
                        <div className="text-xs text-green-600">
                          {couponMessage}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={removeCoupon}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remover
                    </Button>
                  </div>
                )}

                {/* Botão Continuar */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-[.99] text-white transition-all duration-150"
                >
                  Finalizar Compra
                </Button>
              </div>
            </form>
            <div className="flex items-center justify-center gap-2 mt-5">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-thin text-gray-500">
                Pagamento seguro e protegido
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutMobile;
export type { CheckoutMobileProps };
