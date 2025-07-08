import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const EmailValidado = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmailToken(token);
    } else {
      // Página acessada diretamente sem token (via /m/sucesso)
      setVerificationStatus('success');
      setMessage('Email verificado com sucesso!');
    }
  }, [token]);

  const verifyEmailToken = async (verificationToken: string) => {
    try {
      // 🔍 Chamar API da Fase 1 para verificar token
      const response = await fetch(`/api/v1/whatsapp/verify-email/${verificationToken}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
  if (data.already_verified) {
    setVerificationStatus('success');
    setMessage('Este email já foi verificado anteriormente.');
  } else {
    setVerificationStatus('success');
    setMessage('Email verificado com sucesso! Sua conta está ativa.');
    
    // Se teve auto-login, salvar tokens
    if (data.auto_login && data.tokens) {
      localStorage.setItem('multibpo_access_token', data.tokens.access);
      localStorage.setItem('multibpo_refresh_token', data.tokens.refresh);
    }
    
    // 🔧 SALVAR DADOS DA VERIFICAÇÃO PARA USO POSTERIOR
    if (data.user_phone || data.whatsapp_redirect) {
      const verificacaoData = {
        user_phone: data.user_phone,
        whatsapp_redirect: data.whatsapp_redirect,
        verified_at: new Date().toISOString()
      };
      localStorage.setItem('verificacao_data', JSON.stringify(verificacaoData));
      console.log('📱 Dados de verificação salvos:', verificacaoData);
    }
  }
  
  if (data.user) {
    setUserEmail(data.user.email);
  }
}
    } catch (error) {
      console.error('Erro na verificação:', error);
      setVerificationStatus('error');
      setMessage('Erro de conexão. Tente novamente mais tarde.');
    }
  };

const handleBackToWhatsApp = () => {
  // 🔧 USAR NÚMERO DA IA MULTIBPO (não o seu número)
  const multibpoAINumber = '5511945648629';
  
  // 🔧 MENSAGEM CORRIGIDA
  const message = encodeURIComponent('Acabei de verificar meu email! Agora posso tirar dúvidas sobre a MULTI BPO e seus serviços. Vamos lá?');
  const whatsappUrl = `https://wa.me/${multibpoAINumber}?text=${message}`;
  
  console.log('🔗 Redirecionando para IA MultiBPO:', whatsappUrl);
  console.log('📱 Número da IA:', multibpoAINumber);
  
  // Abrir WhatsApp com a IA MultiBPO
  window.open(whatsappUrl, '_blank');
};

  const handleBackToSystem = () => {
    // Redireciona para a página principal
    navigate('/');
  };

  const handleTryAgain = () => {
    // Redirecionar para cadastro novamente
    navigate('/m/cadastro');
  };

  // 🔄 Loading state
  if (verificationStatus === 'loading') {
    return (
      <section className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full min-[480px]:max-w-[26rem]">
            <Card className="min-[480px]:shadow-2xl shadow-none border-none rounded-xl min-[480px]:py-10 min-[480px]:px-10 p-8">
              <CardHeader className="flex flex-col items-center gap-8 text-center p-0">
                <Link to="/">
                  <img
                    src="/lovable-uploads/logo.png"
                    alt="MULTI BPO"
                    className="h-8 w-auto"
                  />
                </Link>

                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 text-center leading-7">
                  Verificando seu email...
                </h1>

                <p className="text-base text-gray-600 text-center">
                  Aguarde enquanto validamos sua conta.
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Success state
  if (verificationStatus === 'success') {
    return (
      <section className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full min-[480px]:max-w-[26rem]">
            <Card className="min-[480px]:shadow-2xl shadow-none border-none rounded-xl min-[480px]:py-10 min-[480px]:px-10 p-8">
              <CardHeader className="flex flex-col items-center gap-8 text-center p-0 pb-14">
                <Link to="/">
                  <img
                    src="/lovable-uploads/logo.png"
                    alt="MULTI BPO"
                    className="h-8 w-auto"
                  />
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 text-center leading-7">
                  Cadastro validado com sucesso!
                </h1>

                <p className="text-base text-gray-600 text-center">
                  {message}
                </p>

                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Bem-vindo à <strong>MULTI BPO</strong>! Agora você tem acesso
                  completo a todos os nossos serviços e benefícios exclusivos.
                  {userEmail && (
                    <>
                      <br /><br />
                      <span className="font-medium">Email confirmado:</span> {userEmail}
                    </>
                  )}
                </p>
              </CardHeader>

              <div className="">
                <div className="w-full min-[480px]:max-w-[26rem] mx-auto space-y-4">
                  <Button
                    onClick={handleBackToWhatsApp}
                    className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 active:scale-[.99] text-white transition-all duration-150"
                  >
                    Voltar ao WhatsApp
                  </Button>
                  
                  <Button
                    onClick={handleBackToSystem}
                    variant="outline"
                    className="w-full h-12 text-base font-medium"
                  >
                    Ir para o site
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // ❌ Error states
  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full min-[480px]:max-w-[26rem]">
          <Card className="min-[480px]:shadow-2xl shadow-none border-none rounded-xl min-[480px]:py-10 min-[480px]:px-10 p-8">
            <CardHeader className="flex flex-col items-center gap-8 text-center p-0 pb-14">
              <Link to="/">
                <img
                  src="/lovable-uploads/logo.png"
                  alt="MULTI BPO"
                  className="h-8 w-auto"
                />
              </Link>

              <h1 className="text-2xl font-bold text-gray-800 text-center leading-7">
                {verificationStatus === 'expired' ? 'Link expirado' : 'Erro na verificação'}
              </h1>

              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>

              <p className="text-base text-gray-600 text-center">
                {message}
              </p>

              {userEmail && (
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-medium">Email:</span> {userEmail}
                </p>
              )}
            </CardHeader>

            <div className="">
              <div className="w-full min-[480px]:max-w-[26rem] mx-auto space-y-4">
                {verificationStatus === 'expired' ? (
                  <Button
                    onClick={handleTryAgain}
                    className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 active:scale-[.99] text-white transition-all duration-150"
                  >
                    Fazer novo cadastro
                  </Button>
                ) : (
                  <Button
                    onClick={handleBackToSystem}
                    className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 active:scale-[.99] text-white transition-all duration-150"
                  >
                    Voltar ao início
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EmailValidado;