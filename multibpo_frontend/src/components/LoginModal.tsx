import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Eye, EyeOff } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup?: () => void;
}

const LoginModal = ({ isOpen, onClose, onOpenSignup }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Usar o hook para gerenciar o scroll
  useScrollLock(isOpen);

  const handleGoogleLogin = () => {
    console.log("Login com Google");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  const handleClose = () => {
    setIsClosing(true);
    // Aguarda a animação terminar antes de fechar
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Duração da animação
  };

  const handleSignupClick = () => {
    onClose();
    if (onOpenSignup) {
      setTimeout(() => {
        onOpenSignup();
      }, 250);
    }
  };

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
              alt="Imagem do login"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          </div>

          {/* Lado direito - Conteúdo */}
          <div className="flex-1 flex flex-col justify-center p-4 md:p-10 lg:p-12 relative bg-white overflow-y-auto">
            <div className="w-full max-w-xs md:max-w-sm mx-auto">
              {/* Logo */}
              <div className="flex justify-center mb-4 md:mb-6">
                <img
                  src="/lovable-uploads/logo.png"
                  alt="MULTI BPO"
                  className="h-8 w-auto"
                />
              </div>

              {/* Título */}
              <div className="text-left mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Bem-vindo de volta!
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Faça login para acessar sua conta.
                </p>
              </div>

              {/* Formulário */}
              <div className="space-y-4 md:space-y-6">
                {/* Botão Google */}
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-11 md:h-12 text-sm md:text-base font-medium text-gray-700 bg-white border-gray-300 hover:bg-gray-50 transition-all duration-200"
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
                  Continuar com Google
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

                {/* Formulário de login */}
                <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
                  {/* Campo Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 md:h-12 text-sm md:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Opções */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-gray-600"
                      >
                        Lembrar-se de mim
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left sm:text-right"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>

                  {/* Botão Login */}
                  <Button
                    type="submit"
                    className="w-full h-11 md:h-12 text-sm md:text-base font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
                  >
                    Login
                  </Button>
                </form>

                {/* Link para cadastro */}
                <div className="text-center pt-3 md:pt-4">
                  <p className="text-sm text-gray-600">
                    Não possui uma conta?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      onClick={handleSignupClick}
                    >
                      Cadastre-se
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
