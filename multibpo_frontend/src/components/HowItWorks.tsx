import { useScrollReveal } from "@/hooks/useScrollReveal";

const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();

  const steps = [
    {
      number: "01",
      title: "Análise e Diagnóstico",
      description:
        "Avaliamos seus processos atuais e identificamos oportunidades de automação e otimização.",
    },
    {
      number: "02",
      title: "Implementação Personalizada",
      description:
        "Configuramos e personalizamos nossa plataforma de acordo com as necessidades do seu escritório.",
    },
    {
      number: "03",
      title: "Treinamento da Equipe",
      description:
        "Capacitamos sua equipe para utilizar todas as funcionalidades da plataforma MULTIBPO.",
    },
    {
      number: "04",
      title: "Suporte Contínuo",
      description:
        "Oferecemos suporte 24/7 e atualizações constantes para garantir máxima eficiência.",
    },
  ];

  return (
    <section ref={ref} id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Como <span className="text-blue-600">Funciona</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Um processo simples e eficiente para transformar completamente a
            operação do seu escritório contábil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                index === 0
                  ? "delay-200"
                  : index === 1
                  ? "delay-300"
                  : index === 2
                  ? "delay-500"
                  : "delay-700"
              } ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-all duration-300 hover:bg-blue-700 hover:scale-110 hover:shadow-lg cursor-pointer">
                  {step.number}
                </div>
                {index < steps.length - 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
