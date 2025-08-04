import { ArrowRight } from "lucide-react";
import {
  spacing,
  backgrounds,
  typography,
  components,
  colors,
} from "@/lib/design-system";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";

const SecondHero = () => {
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de saber mais sobre os serviços da MultiBPO."
  );
  const whatsappUrl = `https://wa.me/5511980883377?text=${whatsappMessage}`;
  const { ref: sectionRef, isVisible } = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      className={`${spacing.section.lg} ${backgrounds.secondary} relative min-h-screen flex items-center overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${backgrounds.accent}`}></div>

      <div className={`${spacing.container} relative z-10`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            {/* Main Title */}
            <h2
              className={`${typography.heading.xl} text-${colors.neutral.gray900} mb-6 leading-tight`}
            >
              Transforme Seu{" "}
              <span className={`text-${colors.primary.main}`}>
                Escritório Contábil
              </span>
            </h2>

            <h3
              className={`${typography.heading.md} text-gray-800 ${spacing.content.xs} leading-relaxed max-w-xl`}
            >
              Através da Terceirização de Departamentos
            </h3>

            {/* Description */}
            <p
              className={`${typography.body.md} text-${colors.neutral.gray600} ${spacing.content.sm} leading-relaxed max-w-xl`}
            >
              Descubra como milhares de contadores estão revolucionando seus
              escritórios com tecnologia de ponta e processos automatizados que
              entregam resultados reais com Inteligência Artificial - IA.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-6 ${spacing.content.sm}`}
            >
              <a href="#" className={`${components.button.default}`}>
                Comece Agora
                <ArrowRight className={`${components.button.defaultArrow}`} />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="default"
                  className={`text-white bg-green-500 hover:bg-green-600 px-8 py-3 text-md active:scale-[.98] transition-all duration-150`}
                  size="lg"
                >
                  Maximize seus Lucros
                </Button>
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-12 opacity-0"
            }`}
          >
            <img
              src="/andre-braga.png"
              alt="Interface da Consultoria IA"
              className="h-[35rem] object-cover rounded-lg"
            />

            {/* Tags no canto inferior direito */}
            <div className="absolute bottom-4 left-6 space-y-3">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-8 py-3 shadow-lg border border-gray-100">
                <p className="text-base font-medium text-gray-900">
                  André Braga
                </p>
                <p className="text-sm text-gray-700">CEO da MULTI BPO</p>
                <p className="text-sm text-gray-700">CRA 6-006176 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondHero;
