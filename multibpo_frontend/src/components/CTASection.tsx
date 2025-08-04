import { components } from "@/lib/design-system";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CTASection = () => {
  const { ref: containerRef, isVisible: containerVisible } =
    useScrollReveal<HTMLDivElement>();
  const { ref: titleRef, isVisible: titleVisible } =
    useScrollReveal<HTMLHeadingElement>();
  const { ref: textRef, isVisible: textVisible } =
    useScrollReveal<HTMLParagraphElement>();
  const { ref: buttonsRef, isVisible: buttonsVisible } =
    useScrollReveal<HTMLDivElement>();

  const whatsappMessage = encodeURIComponent("Olá, Luca! Tudo bem?");
  const whatsappUrl = `https://wa.me/5511945648629?text=${whatsappMessage}`;

  return (
    <section className="px-4">
      <div
        ref={containerRef}
        className={`max-w-7xl mx-auto text-center mt-36 bg-white rounded-2xl p-12 shadow-lg border border-gray-200 scroll-reveal-scale ${
          containerVisible ? "is-visible" : ""
        }`}
      >
        <h2
          ref={titleRef}
          className={`text-4xl font-bold text-gray-900 mb-6 scroll-reveal scroll-reveal-delay-100 ${
            titleVisible ? "is-visible" : ""
          }`}
        >
          Descubra o <span className="text-blue-600">Potencial</span>
        </h2>
        <h4 className="text-xl lg:text-2xl font-medium text-gray-600 mb-8 leading-relaxed">
          Inicie seu{" "}
          <span className="font-semibold text-gray-800">teste gratuito</span>{" "}
          agora,{" "}
          <span className="font-semibold text-blue-600">sem cobrança</span>.{" "}
          <br />
          <span className="text-lg text-gray-500">
            Não solicitamos cartão de crédito.
          </span>
        </h4>
        <p
          ref={textRef}
          className={`text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed scroll-reveal scroll-reveal-delay-200 ${
            textVisible ? "is-visible" : ""
          }`}
        >
          Experimente agora e veja na prática como nossa tecnologia responde às
          suas dúvidas em segundos — direto no seu computador ou no seu
          WhatsApp.
        </p>

        <div
          ref={buttonsRef}
          className={`flex flex-col sm:flex-row gap-8 justify-center items-center scroll-reveal scroll-reveal-delay-300 ${
            buttonsVisible ? "is-visible" : ""
          }`}
        >
          <Button
            asChild
            className="text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-5 active:scale-[.98] transition-all duration-150"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Teste no seu WhatsApp
            </a>
          </Button>
          <div className={`${components.button.default} text-sm font-medium`}>
            Teste no Site
            <ArrowRight className={components.button.defaultArrow} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
