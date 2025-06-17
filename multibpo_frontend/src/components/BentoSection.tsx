
import { Zap, Shield, User, CheckCircle, Clock } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { spacing, backgrounds, typography } from "@/lib/design-system";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    Icon: Zap,
    name: "Respostas Imediatas",
    description:
      "Tire dúvidas e resolva problemas com agilidade através da nossa IA especializada.",
    href: "/",
    cta: "Saiba mais",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Shield,
    name: "Base Legal Sólida",
    description:
      "Fundamentado em legislações, normas técnicas e jurisprudências atualizadas.",
    href: "/",
    cta: "Saiba mais",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: User,
    name: "Especialistas Humanos",
    description:
      "Quando necessário, direcionamento para nossos profissionais especializados.",
    href: "/",
    cta: "Saiba mais",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CheckCircle,
    name: "Segurança nas Entregas",
    description:
      "Mais confiança, menos retrabalho e zero dúvidas sem resposta.",
    href: "/",
    cta: "Saiba mais",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Clock,
    name: "Apoio Constante",
    description:
      "Suporte técnico disponível sempre que precisar, sem depender de grupos informais.",
    href: "/",
    cta: "Saiba mais",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

const BentoSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`${spacing.section.md} ${backgrounds.secondary}`}
    >
      <div className={spacing.container}>
        <div
          className={`text-center ${
            spacing.content.md
          } transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className={`${typography.heading.lg} text-gray-900 mb-4`}>
            Consultoria Técnica com <span className="text-blue-600">IA</span>
          </h2>
          <p
            className={`${typography.body.lg} text-gray-600 max-w-3xl mx-auto`}
          >
            Tire dúvidas, resolva problemas e tome decisões técnicas com
            segurança, agilidade e base legal.
          </p>
        </div>
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
};

export default BentoSection;
