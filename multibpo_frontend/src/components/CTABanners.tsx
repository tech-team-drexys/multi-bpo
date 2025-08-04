import React from "react";
import { spacing, backgrounds } from "@/lib/design-system";

const CTABanners = () => {
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de saber mais sobre os serviços da MultiBPO."
  );
  const whatsappUrl = `https://wa.me/5511980883377?text=${whatsappMessage}`;

  const cards = [
    {
      title: "Seu",
      highlight: "Escritório Contábil",
      highlightEnd: "está preso no passado?",
      description:
        "Enquanto você perde horas com processos repetitivos, dúvidas, retrabalho, perde prazos, outros escritórios estão acelerando seus processos com Inteligência Artificial - IA.",
      listItems: [
        "Pare de pagar multas desnecessárias",
        "Reduza processos repetitivos",
        "Elimine o retrabalho",
        "Acabe com as dúvidas",
      ],
      ctaText: "Saia do passado",
      secondaryText: "Começar Agora",
      backgroundImage: "/extended-accouting.png",
      focusImage: "/accounting-mini.png",
    },
    {
      title: "Venha para o futuro com a",
      highlight: "MULTI BPO",
      description:
        "Junte-se aos contadores que trocaram o caos por clareza. Com nossa consultoria de IA híbrida:",
      listItems: [
        "Você atende melhor",
        "Responde mais rápido",
        "Ganha mais tempo para crescer",
        "Maximiza os lucros do seu Escritório",
        "Aumente sua carteira de clientes",
      ],
      ctaText: "Quero crescer",
      secondaryText: "Começar Agora",
      backgroundImage: "/extended-new-office.png",
      focusImage: "/modern-office.png",
    },
  ];
  return (
    <section className="relative z-20">
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative min-h-screen flex flex-col overflow-hidden"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${card.backgroundImage})`,
              }}
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content Container - Card pai */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.3fr] gap-8 sm:gap-12 lg:gap-16 xl:gap-28 items-center w-full">
                {/* content card */}
                <div className="flex flex-col justify-between h-full bg-white/95 backdrop-blur-sm py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 order-2 xl:order-1">
                  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    {/* Título */}
                    <h2 className="text-xl sm:text-2xl lg:text-3xl leading-tight font-bold text-gray-900">
                      {card.title}{" "}
                      <span className="text-blue-600 font-bold">
                        {card.highlight}
                      </span>
                      {card.highlightEnd && ` ${card.highlightEnd}`}
                    </h2>

                    {/* Parágrafo */}
                    <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                      {card.description}
                    </p>

                    {/* Lista com checkmarks */}
                    <ul className="space-y-3 sm:space-y-4">
                      {card.listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-sm sm:text-base text-gray-800 font-medium">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Botão */}
                  <div className="pt-6 sm:pt-8">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="group w-full bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[.98]">
                        {card.ctaText}
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>
                    </a>
                  </div>
                </div>

                {/* focus image */}
                <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.8)] order-1 xl:order-2">
                  <img
                    src={card.focusImage}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};
export default CTABanners;
