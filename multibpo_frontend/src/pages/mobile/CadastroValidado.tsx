import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const CadastroValidado = () => {
  const handleBackToSystem = () => {
    // Redireciona para a página principal ou dashboard
    window.location.href = "/";
  };

  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full min-[480px]:max-w-[26rem]">
          <Card className="min-[480px]:shadow-2xl shadow-none border-none rounded-xl min-[480px]:py-10 min-[480px]:px-10 p-8">
            <CardHeader className="flex flex-col items-center gap-8 text-center p-0 pb-14">
              {/* Logo MULTI BPO - Centralizada */}
              <Link to="/">
                <img
                  src="/lovable-uploads/logo.png"
                  alt="MULTI BPO"
                  className="h-8 w-auto"
                />
              </Link>

              {/* Título */}
              <h1 className="text-2xl font-bold text-gray-800 text-center leading-7">
                Cadastro validado com sucesso!
              </h1>

              {/* Mensagem de confirmação */}
              <p className="text-base text-gray-600 text-center">
                Seu cadastro foi validado com sucesso. Você já pode voltar a
                usar o sistema.
              </p>

              {/* Ícone de Sucesso */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              {/* Mensagem adicional */}
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Bem-vindo à <strong>MULTI BPO</strong>! Agora você tem acesso
                completo a todos os nossos serviços e benefícios exclusivos.
              </p>
            </CardHeader>

            {/* Botão para voltar ao sistema */}
            <div className="">
              <div className="w-full min-[480px]:max-w-[26rem] mx-auto space-y-4">
                <Button
                  onClick={handleBackToSystem}
                  className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 active:scale-[.99] text-white transition-all duration-150"
                >
                  Voltar ao WhatsApp
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CadastroValidado;
