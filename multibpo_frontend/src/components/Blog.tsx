import { ArrowRight } from "lucide-react";
import {
  spacing,
  backgrounds,
  typography,
  components,
  borderRadius,
  shadows,
} from "@/lib/design-system";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Blog = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`${spacing.section.md} ${backgrounds.primary}`}
    >
      <div className={spacing.container}>
        {/* Header */}
        <div
          className={`text-left ${
            spacing.content.md
          } transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className={`${typography.heading.lg} text-gray-900 mb-4`}>
            Blog
          </h2>
          <p className={`${typography.body.lg} text-gray-600 max-w-2xl`}>
            Acompanhe as últimas novidades, dicas e insights sobre contabilidade
            e gestão empresarial.
          </p>
        </div>

        {/* Blog Card - Increased size */}
        <div
          className={`flex justify-center transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <a
            href="/blog/ia-revolucionando-contabilidade"
            className={`${components.card.base} ${components.card.hover} overflow-hidden max-w-4xl w-full group block`}
          >
            <div className="relative h-80 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop"
                alt="Artigo sobre contabilidade digital"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`bg-blue-600 text-white px-3 py-1 ${borderRadius.sm} text-sm font-medium`}
                >
                  Contabilidade Digital
                </span>
              </div>
            </div>

            <div className="p-10 bg-gray-50">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>15 de Janeiro, 2024</span>
                <span>•</span>
                <span>5 min de leitura</span>
              </div>

              <h3 className={`${typography.heading.md} text-gray-900 mb-6`}>
                Como a Inteligência Artificial está Revolucionando a
                Contabilidade
              </h3>

              <p
                className={`${typography.body.md} text-gray-600 mb-6 leading-relaxed`}
              >
                Descubra como a IA está transformando processos contábeis,
                automatizando tarefas repetitivas e permitindo que contadores
                foquem em atividades estratégicas de maior valor.
              </p>

              <div className={`${components.button.default} font-medium`}>
                <span className="transition-transform duration-200">
                  Ler mais
                </span>
                <ArrowRight className={components.button.defaultArrow} />
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
