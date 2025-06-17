import { FeatureSteps } from "@/components/ui/feature-section";
import { spacing, backgrounds } from "@/lib/design-system";

const useCases = [
  {
    step: "Caso 1",
    title: "Dúvidas sobre Tributação",
    content:
      "Tire dúvidas sobre regimes tributários, enquadramentos e otimização fiscal com nossa IA especializada.",
    image: "/ai-chip.png",
  },
  {
    step: "Caso 2",
    title: "Questões Trabalhistas",
    content:
      "Consulte sobre legislação trabalhista, cálculos de rescisão e obrigações acessórias com precisão.",
    image: "/mockup-example2.png",
  },
  {
    step: "Caso 3",
    title: "Procedimentos Societários",
    content:
      "Obtenha orientações sobre alterações contratuais, registros e procedimentos societários complexos.",
    image: "/mockup-example2.png",
  },
];

const ExampleUseCases = () => {
  return (
    <section className={`${spacing.section.md} ${backgrounds.primary}`}>
      <FeatureSteps
        features={useCases}
        title="Exemplos de Casos de Uso"
        description="Veja na prática como nossa IA pode revolucionar o atendimento e suporte técnico do seu escritório contábil."
        autoPlayInterval={8000}
      />
    </section>
  );
};

export default ExampleUseCases;
