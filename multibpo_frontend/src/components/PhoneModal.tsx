import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { X, Phone, ArrowLeft } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";
import VerificationModal from "./VerificationModal";

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  userEmail?: string;
}

const PhoneModal = ({
  isOpen,
  onClose,
  onBack,
  userEmail,
}: PhoneModalProps) => {
  const [phone, setPhone] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Usar o hook para gerenciar o scroll
  useScrollLock(isOpen || showVerificationModal);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleBack = () => {
    if (onBack) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onBack();
      }, 200);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Telefone enviado:", { email: userEmail, phone: phoneNumbers });

    // Fechar modal atual e abrir modal de verificação
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowVerificationModal(true);
    }, 200);

    setIsSubmitting(false);
  };

  const handleVerificationModalClose = () => {
    setShowVerificationModal(false);
    setPhone("");
  };

  const handleVerificationModalBack = () => {
    setShowVerificationModal(false);
    // Reabrir o modal de telefone
    setTimeout(() => {
      setIsClosing(false);
    }, 200);
  };

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showVerificationModal) {
          handleVerificationModalClose();
        } else {
          handleClose();
        }
      }
    };

    if (isOpen || showVerificationModal) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, showVerificationModal]);

  if (!isOpen && !showVerificationModal) return null;

  // Se o modal de verificação estiver aberto, renderizar ele
  if (showVerificationModal) {
    return (
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={handleVerificationModalClose}
        onBack={handleVerificationModalBack}
        userEmail={userEmail}
        userPhone={phone}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-[calc(100vw-2rem)] max-w-md bg-white rounded-xl shadow-2xl transition-all duration-200 ${
          isClosing
            ? "opacity-0 scale-95 translate-y-4"
            : "opacity-100 scale-100 translate-y-0 animate-in fade-in-0 zoom-in-95"
        }`}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="w-5 h-5 text-gray-500" />
          <span className="sr-only">Close</span>
        </button>

        {/* Botão voltar */}
        {onBack && (
          <button
            onClick={handleBack}
            className="absolute left-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
            <span className="sr-only">Voltar</span>
          </button>
        )}

        <div className="p-6 md:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/lovable-uploads/logo.png"
              alt="MULTI BPO"
              className="h-8 w-auto"
            />
          </div>

          {/* Ícone do telefone */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Quase lá!
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Precisamos do seu número de celular para completar o cadastro.
            </p>
          </div>

          {/* Email do usuário (se disponível) */}
          {userEmail && (
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {userEmail}
              </p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Telefone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Número de Celular
              </label>
              <PhoneInput
                id="phone"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={setPhone}
                onNumbersChange={setPhoneNumbers}
                className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enviaremos um código de verificação por SMS
              </p>
            </div>

            {/* Botão Enviar */}
            <Button
              type="submit"
              disabled={!phone.trim() || isSubmitting}
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white active:scale-[.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enviando...
                </div>
              ) : (
                "Enviar Código"
              )}
            </Button>
          </form>

          {/* Informações adicionais */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Ao continuar, você concorda com nossos{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Termos de Uso
              </button>{" "}
              e{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Política de Privacidade
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneModal;
