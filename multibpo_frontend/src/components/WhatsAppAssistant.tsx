import React, { useState } from "react";
import WhatsAppChat from "./WhatsAppChat";
import { Building, Landmark, FileText, FileUser } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WhatsAppAssistant = () => {
  const [activeCategory, setActiveCategory] = useState("tributacao");

  const { ref: headerRef, isVisible: headerVisible } =
    useScrollReveal<HTMLDivElement>();
  const { ref: categoriesRef, isVisible: categoriesVisible } =
    useScrollReveal<HTMLDivElement>();
  const { ref: chatRef, isVisible: chatVisible } =
    useScrollReveal<HTMLDivElement>();

  const categories = [
    {
      id: "tributacao",
      title: "Tributação",
      icon: Landmark,
      description:
        "Esclareça dúvidas sobre regimes tributários, enquadramentos e estratégias fiscais com nossa IA especializada em contabilidade.",
    },
    {
      id: "questoesTrabalhistas",
      title: "Questões Trabalhistas",
      icon: FileUser,
      description:
        "Tenha respostas precisas sobre legislação trabalhista, CLT, cálculos de rescisão e obrigações acessórias, com agilidade e segurança.",
    },
    {
      id: "procedimentosSocietarios",
      title: "Procedimentos Societários",
      icon: Building,
      description:
        "Obtenha orientações sobre alterações contratuais, registros e procedimentos societários complexos.",
    },
  ];

  return (
    <section id="whatsapp-assistant" className="pt-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-20 scroll-reveal ${
            headerVisible ? "is-visible" : ""
          }`}
        >
          <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4">
            Nossa IA Contábil direto no{" "}
            <span className="text-blue-600">seu WhatsApp</span>
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            A mesma tecnologia inteligente que você já conhece, também
            disponível no seu WhatsApp, 24h por dia 7 dias por semana — com
            rapidez, eficiência e precisão no atendimento. Sem filas de espera e
            limites de consulta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Menu de Categorias - Lado Esquerdo */}
          <div
            ref={categoriesRef}
            className={`space-y-6 scroll-reveal-from-left ${
              categoriesVisible ? "is-visible" : ""
            }`}
          >
            <div className="space-y-4">
              {categories.map((category, index) => {
                const { ref: categoryRef, isVisible: categoryVisible } =
                  useScrollReveal<HTMLButtonElement>();
                return (
                  <button
                    key={category.id}
                    ref={categoryRef}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left scroll-reveal scroll-reveal-delay-${
                      (index + 1) * 100
                    } ${categoryVisible ? "is-visible" : ""} ${
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
                );
              })}
            </div>
          </div>

          {/* Simulação de Chat - Lado Direito */}
          <div
            ref={chatRef}
            className={`flex justify-center scroll-reveal-from-right ${
              chatVisible ? "is-visible" : ""
            }`}
          >
            <WhatsAppChat
              activeCategory={activeCategory}
              isVisible={chatVisible}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppAssistant;
