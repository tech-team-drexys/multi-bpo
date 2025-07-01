import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

const CadastroMobile = () => {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔗 Pré-preencher telefone se vier do WhatsApp
  useEffect(() => {
    const phoneParam = searchParams.get('phone');
    if (phoneParam) {
      // Formatar telefone brasileiro
      const cleanPhone = phoneParam.replace(/\D/g, '');
      let formattedPhone = cleanPhone;
      
      if (cleanPhone.length === 11 && !cleanPhone.startsWith('55')) {
        formattedPhone = `+55${cleanPhone}`;
      } else if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
        formattedPhone = `+${cleanPhone}`;
      }
      
      setWhatsapp(formattedPhone);
    }
  }, [searchParams]);

  const clearErrors = () => {
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    if (!acceptTerms) {
      newErrors.terms = "Você deve aceitar os termos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleRegister = () => {
    // TODO: Implementar cadastro com Google futuramente
    console.log("Cadastro com Google - em desenvolvimento");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    clearErrors();

    try {
      // 🌐 Chamar API da Fase 1 para registro
      const response = await fetch('/api/v1/whatsapp/mobile/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          whatsapp: whatsapp.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Sucesso: Redirecionar para página de verificação
        const verifyUrl = `/m/verificar-email?email=${encodeURIComponent(data.email || email)}`;
        navigate(verifyUrl);
      } else {
        // ❌ Erro da API
        if (data.field_errors) {
          setErrors(data.field_errors);
        } else {
          setErrors({ general: data.message || 'Erro ao cadastrar usuário' });
        }
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErrors({ general: 'Erro de conexão. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full min-[520px]:max-w-[27rem]">
        <Card className="min-[520px]:shadow-2xl shadow-none border-none rounded-xl py-4 px-3">
          <CardHeader className="text-center pb-8">
            {/* Logo MULTI BPO */}
            <div className="flex justify-center mb-6">
              <Link to="/">
                <img
                  src="/lovable-uploads/logo.png"
                  alt="MULTIBPO Logo"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Título H1 */}
            <h1 className="text-xl font-bold text-gray-800 text-center leading-tight">
              Cadastre-se e tenha acesso à benefícios exclusivos
            </h1>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Erro geral */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            {/* Botão Cadastro com Google */}
            <Button
              onClick={handleGoogleRegister}
              variant="outline"
              className="w-full h-12 text-gray-800 text-base font-medium bg-gray-50 border-gray-300 hover:bg-gray-50 active:bg-gray-100 active:scale-[.99] transition-all duration-150"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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

            {/* Separador OR */}
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

            {/* Formulário de Cadastro */}
            <form onSubmit={handleRegister} className="space-y-4">
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
                  className={`h-10 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors !focus:outline-none !outline-none ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Campo WhatsApp */}
              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  WhatsApp
                </label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="Digite seu número de WhatsApp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={`h-10 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors !focus:outline-none !outline-none ${
                    errors.whatsapp ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.whatsapp && (
                  <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>
                )}
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
                  className={`h-10 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors !focus:outline-none !outline-none ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Campo Repetir Senha */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Repetir Senha
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`h-10 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors !focus:outline-none !outline-none ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Checkbox - Aceitar Política de Privacidade e Termos de Uso */}
              <div className="flex items-center space-x-3 pt-1 pb-6">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked === true)
                  }
                  className="flex-shrink-0"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-gray-600 leading-tight cursor-pointer"
                >
                  Aceito a{" "}
                  <Link
                    to="/m/politica"
                    className="text-blue-600 hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidade
                  </Link>{" "}
                  e os{" "}
                  <Link
                    to="/m/politica"
                    className="text-blue-600 hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Termos de Uso
                  </Link>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
                )}
              </div>

              {/* Botão Captcha */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 text-gray-800 text-base font-medium bg-gray-50 border-gray-300 hover:bg-gray-50 active:bg-gray-100 active:scale-[.98] transition-all duration-150"
              >
                Captcha
              </Button>

              {/* Botão Cadastrar-se */}
              <Button
                type="submit"
                className="w-full h-10 text-base font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-[.99] text-white transition-all duration-150"
                disabled={!acceptTerms || isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </Button>
            </form>

            {/* Link para Login 
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Já possui conta?{" "}
                <Link
                  to="/m/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Entre aqui
                </Link>
              </p>
            </div>
            */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CadastroMobile;