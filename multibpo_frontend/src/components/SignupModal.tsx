import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { X } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";
import PhoneModal from "./PhoneModal";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappNumbers, setWhatsappNumbers] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleUserEmail, setGoogleUserEmail] = useState("");

  // Usar o hook para gerenciar o scroll
  useScrollLock(isOpen || showPhoneModal);

  const handleGoogleRegister = () => {
    // Simular dados do usuário do Google
    const mockGoogleUser = {
      email: "usuario@gmail.com",
      name: "Usuário Google",
      picture: "https://via.placeholder.com/40",
    };

    setGoogleUserEmail(mockGoogleUser.email);
    console.log("Cadastro com Google:", mockGoogleUser);

    // Fechar modal atual e abrir modal de telefone
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowPhoneModal(true);
    }, 200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cadastro:", {
      email,
      whatsapp: whatsappNumbers,
      password,
      confirmPassword,
      acceptTerms,
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
    setGoogleUserEmail("");
  };

  const handlePhoneModalBack = () => {
    setShowPhoneModal(false);
    // Reabrir o modal de cadastro
    setTimeout(() => {
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPhoneModal) {
          handlePhoneModalClose();
        } else {
          handleClose();
        }
      }
    };

    if (isOpen || showPhoneModal) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, showPhoneModal]);

  if (!isOpen && !showPhoneModal) return null;

  // Se o modal de telefone estiver aberto, renderizar ele
  if (showPhoneModal) {
    return (
      <PhoneModal
        isOpen={showPhoneModal}
        onClose={handlePhoneModalClose}
        onBack={handlePhoneModalBack}
        userEmail={googleUserEmail}
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
        className={`relative w-[calc(100vw-2rem)] max-w-md md:max-w-5xl min-[1200px]:max-w-6xl h-[90vh] md:h-[80vh] bg-white rounded-xl shadow-2xl transition-all duration-200 ${
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

        <div className="flex flex-col md:flex-row h-full rounded-xl overflow-hidden">
          {/* Lado esquerdo - Imagem */}
          <div className="flex-1 relative hidden md:flex">
            <img
              src="/login-image.jpeg"
              alt="Imagem do cadastro"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          </div>

          {/* Lado direito - Conteúdo */}
          <div className="flex-1 flex flex-col justify-start p-10 lg:p-12 relative bg-white overflow-y-auto">
            <div className="w-full max-w-sm md:max-w-md mx-auto">
              {/* Logo */}
              <div className="flex justify-start mb-4 md:mb-6">
                <img
                  src="/lovable-uploads/logo.png"
                  alt="MULTI BPO"
                  className="h-8 w-auto"
                />
              </div>

              {/* Título */}
              <div className="text-left mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Cadastre-se e tenha acesso à benefícios exclusivos
                </h1>
              </div>

              {/* Formulário */}
              <div className="space-y-4 md:space-y-6">
                {/* Botão Google */}
                <Button
                  onClick={handleGoogleRegister}
                  variant="outline"
                  className="w-full h-11 md:h-12 text-sm md:text-base font-medium text-gray-700 bg-white border-gray-300 hover:bg-gray-50 active:scale-[.98] transition-all duration-150"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Cadastro com Google
                </Button>

                {/* Separador */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500 font-medium">
                      OU
                    </span>
                  </div>
                </div>

                {/* Formulário de cadastro */}
                <form
                  onSubmit={handleRegister}
                  className="space-y-3 md:space-y-4"
                >
                  {/* Campo E-mail */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      E-mail
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 md:h-12 text-sm md:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Campo WhatsApp */}
                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      WhatsApp
                    </label>
                    <PhoneInput
                      id="whatsapp"
                      placeholder="(11) 99999-9999"
                      value={whatsapp}
                      onChange={setWhatsapp}
                      onNumbersChange={setWhatsappNumbers}
                      className="h-11 md:h-12 text-sm md:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Campo Senha */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Senha
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 md:h-12 text-sm md:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Campo Confirmar Senha */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirmar Senha
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 md:h-12 text-sm md:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Captcha */}
                  <div className="flex items-center justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 md:h-12 text-sm md:text-base font-medium text-gray-700 bg-white border-gray-300 hover:bg-gray-50 active:scale-[.98] transition-all duration-150"
                    >
                      Captcha
                    </Button>
                  </div>

                  {/* Termos */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) =>
                        setAcceptTerms(checked as boolean)
                      }
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      Aceito os{" "}
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
                    </label>
                  </div>

                  {/* Botão Cadastrar */}
                  <Button
                    type="submit"
                    className="w-full h-11 md:h-12 text-sm md:text-base font-medium bg-blue-600 hover:bg-blue-700 text-white active:scale-[.98] transition-all duration-150"
                    disabled={!acceptTerms}
                  >
                    Cadastrar
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
