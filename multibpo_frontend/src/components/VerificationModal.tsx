import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ArrowLeft, CheckCircle } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  userEmail?: string;
  userPhone?: string;
}

const VerificationModal = ({
  isOpen,
  onClose,
  onBack,
  userEmail,
  userPhone,
}: VerificationModalProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Usar o hook para gerenciar o scroll
  useScrollLock(isOpen);

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

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Permitir apenas um caractere

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Mover para o próximo input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) return;

    setIsSubmitting(true);

    // Simular verificação
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Código verificado:", {
      email: userEmail,
      phone: userPhone,
      code: fullCode,
    });

    // Simular sucesso
    setIsVerified(true);
    setIsSubmitting(false);

    // Fechar modal após 2 segundos
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleResendCode = () => {
    setTimeLeft(60);
    setCode(["", "", "", "", "", ""]);
    console.log("Código reenviado para:", userPhone);
  };

  // Timer para reenvio
  useEffect(() => {
    if (timeLeft > 0 && isOpen) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isOpen]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

          {/* Ícone de verificação */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Verificação de Código
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Digite o código de 6 dígitos enviado para seu celular.
            </p>
          </div>

          {/* Informações do usuário */}
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            {userEmail && (
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Email:</span> {userEmail}
              </p>
            )}
            {userPhone && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Celular:</span> {userPhone}
              </p>
            )}
          </div>

          {/* Formulário de verificação */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Código de Verificação
              </label>
              <div className="flex justify-between gap-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="h-12 w-12 text-center text-lg font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                ))}
              </div>
            </div>

            {/* Botão Verificar */}
            <Button
              type="submit"
              disabled={code.join("").length !== 6 || isSubmitting}
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white active:scale-[.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verificando...
                </div>
              ) : (
                "Verificar Código"
              )}
            </Button>
          </form>

          {/* Reenviar código */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Não recebeu o código?</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={timeLeft > 0}
              className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {timeLeft > 0 ? `Reenviar em ${timeLeft}s` : "Reenviar código"}
            </button>
          </div>

          {/* Mensagem de sucesso */}
          {isVerified && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800 font-medium">
                  Verificação concluída com sucesso!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
