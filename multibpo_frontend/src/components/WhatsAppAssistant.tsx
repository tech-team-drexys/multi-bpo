import React, { useState } from "react";
import WhatsAppChat from "./WhatsAppChat";
import {
  Clock,
  Users,
  Zap,
  Target,
  DollarSign,
  Headphones,
  Megaphone,
} from "lucide-react";

const WhatsAppAssistant = () => {
  const [activeCategory, setActiveCategory] = useState("vendas");

  const categories = [
    {
      id: "vendas",
      title: "Vendas",
      icon: DollarSign,
      description:
        "Automatize o processo de vendas e captação de novos clientes",
    },
    {
      id: "atendimento",
      title: "Atendimento",
      icon: Headphones,
      description: "Suporte 24/7 para dúvidas e solicitações dos clientes",
    },
    {
      id: "promocoes",
      title: "Promoções",
      icon: Megaphone,
      description: "Campanhas automáticas de marketing e ofertas especiais",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Atendimento 24/7",
      description:
        "Automatize respostas e atenda seus clientes a qualquer hora do dia.",
    },
    {
      icon: Zap,
      title: "Resposta Rápida",
      description:
        "Redução de 80% no tempo de resposta para dúvidas frequentes.",
    },
    {
      icon: Target,
      title: "Qualificação de Leads",
      description:
        "Identifique automaticamente clientes com maior potencial de conversão.",
    },
    {
      icon: Users,
      title: "Integração Completa",
      description: "Conecte com seus sistemas contábeis e CRM existentes.",
    },
  ];

  return (
    <section id="whatsapp-assistant" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Assistente Virtual <span className="text-green-500">WhatsApp</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automatize o atendimento ao cliente com inteligência artificial.
            Veja como nosso chatbot inteligente pode transformar seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Menu de Categorias - Lado Esquerdo */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
              Escolha uma categoria para ver em ação:
            </h3>

            <div className="space-y-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                    activeCategory === category.id
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        activeCategory === category.id
                          ? "bg-green-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <category.icon
                        className={`w-6 h-6 ${
                          activeCategory === category.id
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h4
                        className={`text-xl font-semibold mb-2 ${
                          activeCategory === category.id
                            ? "text-green-600"
                            : "text-gray-900"
                        }`}
                      >
                        {category.title}
                      </h4>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Simulação de Chat - Lado Direito */}
          <div className="flex justify-center">
            <WhatsAppChat activeCategory={activeCategory} />
          </div>
        </div>

        {/* Seção de Benefícios */}
        <div className="mt-16">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
            <h4 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Benefícios do Assistente Virtual
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-left">
                  <benefit.icon
                    className="w-8 h-8 text-blue-600 mb-3"
                    strokeWidth={1.5}
                  />
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppAssistant;
