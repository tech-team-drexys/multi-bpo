import React, { useState, useEffect } from "react";
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}
interface WhatsAppChatProps {
  activeCategory: string;
  isVisible?: boolean;
}
const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  activeCategory,
  isVisible = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const chatScenarios = {
    tributacao: [
      {
        text: "Tenho dúvidas sobre qual regime tributário escolher para minha empresa",
        sender: "user" as const,
      },
      {
        text: "Olá! 📊 Posso te ajudar com isso! Para recomendar o melhor regime tributário, preciso saber:\n\n• Qual o faturamento anual da empresa?\n• Qual o tipo de atividade?\n• Quantos funcionários?",
        sender: "bot" as const,
      },
      {
        text: "Faturamento de R$ 2 milhões anuais, somos uma consultoria em TI com 15 funcionários",
        sender: "user" as const,
      },
      {
        text: "Perfeito! 💡 Com esse perfil, você tem 3 opções:\n\n📈 Lucro Presumido (11,33%)\n📊 Lucro Real (varia conforme lucro)\n🎯 Simples Nacional (não elegível)\n\nPara consultoria TI, geralmente o Lucro Presumido é mais vantajoso. Quer uma simulação detalhada?",
        sender: "bot" as const,
      },
      {
        text: "Sim, gostaria da simulação!",
        sender: "user" as const,
      },
      {
        text: "Ótimo! 🚀 Vou preparar uma simulação completa comparando os regimes. Nosso especialista entrará em contato em 30 minutos com os cálculos personalizados. Pode ser?",
        sender: "bot" as const,
      },
    ],
    questoesTrabalhistas: [
      {
        text: "Preciso calcular a rescisão de um funcionário que pediu demissão",
        sender: "user" as const,
      },
      {
        text: "Olá! 👨‍💼 Vou te ajudar com o cálculo da rescisão! Quando o funcionário pede demissão, ele tem direito a:\n\n• Saldo de salário\n• Férias vencidas + 1/3\n• 13º proporcional\n\n Pode passar as informações para eu calcular?",
        sender: "bot" as const,
      },
      {
        text: "Salário R$ 3.500, trabalhou 8 meses em 2024, tem 15 dias de férias vencidas",
        sender: "user" as const,
      },
      {
        text: "Perfeito! 📝 Calculando:\n\n💰 13º proporcional: R$ 2.333,33\n🏖️ Férias vencidas + 1/3: R$ 1.166,67\n📅 Saldo salário: conforme dias trabalhados\n\n⚠️ Lembre-se: não há direito ao FGTS e multa de 40% em pedido de demissão.",
        sender: "bot" as const,
      },
      {
        text: "E se ele tivesse sido demitido sem justa causa?",
        sender: "user" as const,
      },
      {
        text: "Na demissão sem justa causa, além dos valores anteriores, teria direito a:\n\n🏦 Saque do FGTS\n💰 Multa de 40% do FGTS\n📋 Seguro-desemprego\n🚨 Aviso prévio (30 dias)\n\nUma diferença significativa! Precisa de um relatório completo?",
        sender: "bot" as const,
      },
    ],
    procedimentosSocietarios: [
      {
        text: "Preciso fazer alteração do quadro societário da minha empresa",
        sender: "user" as const,
      },
      {
        text: "Olá! 🏢 Posso te orientar sobre alteração societária! Existem diferentes tipos:\n\n👥 Entrada de novo sócio\n🔄 Cessão de quotas\n📉 Retirada de sócio\n💰 Aumento de capital\n\nQual é o seu caso específico?",
        sender: "bot" as const,
      },
      {
        text: "Quero incluir minha esposa como sócia com 30% da empresa",
        sender: "user" as const,
      },
      {
        text: "Perfeito! 📋 Para incluir sua esposa como sócia, precisamos:\n\n📄 Alteração contratual\n🏛️ Registro na Junta Comercial\n📊 Definir como será a integralização\n💰 Verificar aspectos tributários\n\nO processo leva cerca de 15-20 dias úteis.",
        sender: "bot" as const,
      },
      {
        text: "Quais documentos preciso providenciar?",
        sender: "user" as const,
      },
      {
        text: "📑 Lista de documentos necessários:\n\n✅ Contrato social atual\n✅ RG e CPF dos sócios\n✅ Comprovante de endereço\n✅ Certidões negativas\n✅ Balanço patrimonial\n\nVou enviar um checklist completo e agendar uma reunião para iniciarmos! 🚀",
        sender: "bot" as const,
      },
    ],
  };
  useEffect(() => {
    setMessages([]);
    setMessageIndex(0);
    setIsTyping(false);
  }, [activeCategory]);
  useEffect(() => {
    if (!isVisible) return;

    const currentScenario =
      chatScenarios[activeCategory as keyof typeof chatScenarios];
    if (!currentScenario || messageIndex >= currentScenario.length) return;

    const message = currentScenario[messageIndex];
    const typingDelay =
      messageIndex === 0 ? 0 : message.sender === "bot" ? 500 : 700; // No delay for first message, AI: 0.5s, User: 0.7s

    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(
        () => {
          const newMessage: Message = {
            id: messageIndex,
            text: message.text,
            sender: message.sender,
            timestamp: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, newMessage]);
          setIsTyping(false);
          setMessageIndex((prev) => prev + 1);
        },
        message.sender === "bot" ? 500 : 1050
      ); // AI typing: 0.5s, User typing: 1.05s (0.7 * 1.5s)
    }, typingDelay);

    return () => clearTimeout(timer);
  }, [activeCategory, messageIndex, isVisible]);
  return (
    <div className="relative">
      {/* Mockup do Celular */}
      <div className="w-80 h-[590px] bg-gray-900 rounded-[3rem] p-2.5 shadow-2xl">
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden flex flex-col">
          {/* Header do WhatsApp */}
          <div className="text-gray-900 p-4 flex items-center gap-3 bg-[#f6f6f6]">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <img
                src="/logo-multi-bpo.png"
                alt="logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-md">Luca IA</h3>
              <p className="text-xs opacity-90">Consultor Contábil</p>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div
            className="flex-1 p-4 overflow-y-auto bg-[#f0e7de] scrollbar-custom"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.1"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg shadow-sm animate-fade-in ${
                      message.sender === "user"
                        ? "bg-[#e2ffc7] text-gray-900 rounded-br-none border"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">
                      {message.text}
                    </p>
                    <p className={`text-xs mt-1 text-gray-500`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}

              {/* Indicador de digitação */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#f6f6f6] text-gray-800 px-4 py-2 rounded-lg rounded-bl-none border shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0.1s",
                        }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0.2s",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input do WhatsApp */}
          <div className="p-3 bg-white border-t">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <span className="text-gray-400 text-sm flex-1 px-2">
                Digite uma mensagem...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhatsAppChat;
