import React, { useState, useEffect } from "react";
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}
interface WhatsAppChatProps {
  activeCategory: string;
}
const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ activeCategory }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const chatScenarios = {
    vendas: [
      {
        text: "Olá! Gostaria de saber mais sobre os serviços contábeis",
        sender: "user" as const,
      },
      {
        text: "Olá! 😊 Seria um prazer ajudá-lo! Oferecemos consultoria contábil completa. Qual é o porte da sua empresa?",
        sender: "bot" as const,
      },
      {
        text: "Somos uma empresa de médio porte, cerca de 50 funcionários",
        sender: "user" as const,
      },
      {
        text: "Perfeito! Para empresas do seu porte, temos pacotes especiais que incluem:\n\n📊 Contabilidade completa\n💰 Planejamento tributário\n📈 Relatórios gerenciais\n\nGostaria de agendar uma apresentação?",
        sender: "bot" as const,
      },
      {
        text: "Sim, tenho interesse!",
        sender: "user" as const,
      },
      {
        text: "Excelente! 🎉 Vou transferir você para nosso especialista em vendas. Qual o melhor horário para contato?",
        sender: "bot" as const,
      },
    ],
    atendimento: [
      {
        text: "Preciso de ajuda com uma dúvida sobre minha declaração",
        sender: "user" as const,
      },
      {
        text: "Olá! Claro, estou aqui para ajudar! 📋 Pode me dar mais detalhes sobre sua dúvida?",
        sender: "bot" as const,
      },
      {
        text: "Não entendi uma informação no relatório mensal",
        sender: "user" as const,
      },
      {
        text: "Sem problemas! Posso explicar qualquer item do relatório. 📊\n\nVocê poderia me informar:\n• Qual seção específica?\n• Número do relatório?\n\nAssim posso te dar uma explicação detalhada!",
        sender: "bot" as const,
      },
      {
        text: "É sobre os impostos retidos na seção 3.2",
        sender: "user" as const,
      },
      {
        text: "Perfeito! 💡 Os impostos retidos na seção 3.2 referem-se aos valores que foram descontados na fonte. Vou enviar um documento explicativo e agendar uma reunião para esclarecer melhor. Pode ser amanhã às 14h?",
        sender: "bot" as const,
      },
    ],
    promocoes: [
      {
        text: "Oi",
        sender: "user" as const,
      },
      {
        text: "Olá! 🎉 Temos uma promoção especial este mês!\n\n🔥 50% OFF na primeira mensalidade\n📅 Consultoria gratuita\n🎁 Setup inicial sem custo\n\nVálido até o final do mês! Interessado?",
        sender: "bot" as const,
      },
      {
        text: "Que tipos de serviços estão inclusos?",
        sender: "user" as const,
      },
      {
        text: "Ótima pergunta! A promoção inclui:\n\n✅ Contabilidade digital completa\n✅ Emissão de guias e relatórios\n✅ Suporte via WhatsApp\n✅ Portal do cliente 24/7\n✅ Backup automático na nuvem\n\nTudo isso com 50% de desconto! 💰",
        sender: "bot" as const,
      },
      {
        text: "Sounds good! Como faço para contratar?",
        sender: "user" as const,
      },
      {
        text: "Maravilha! 🚀 É super simples:\n\n1️⃣ Cadastro online (2 min)\n2️⃣ Envio de documentos\n3️⃣ Setup da sua conta\n4️⃣ Começamos a trabalhar!\n\nVou te enviar o link para começar agora mesmo! 📲",
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
  }, [activeCategory, messageIndex]);
  return (
    <div className="relative">
      {/* Mockup do Celular */}
      <div className="w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
          {/* Header do WhatsApp */}
          <div className="text-white p-4 flex items-center gap-3 bg-emerald-700">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">MULTIBPO Assistant</h3>
              <p className="text-xs opacity-90">Online agora</p>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div
            className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-custom"
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
                        ? "bg-emerald-700 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">
                      {message.text}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}

              {/* Indicador de digitação */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 px-4 py-2 rounded-lg rounded-bl-none border shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0.1s",
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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
