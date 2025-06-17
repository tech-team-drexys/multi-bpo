import { Card, CardContent } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Testimonials = () => {
  const { ref, isVisible } = useScrollReveal();

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Sócia-Diretora",
      company: "Contábil Silva & Associados",
      content:
        "O MULTIBPO revolucionou nossa operação. Conseguimos atender 3x mais clientes com a mesma equipe. A automação dos processos contábeis foi um divisor de águas para nosso crescimento.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "João Santos",
      role: "Contador Responsável",
      company: "Santos Contabilidade",
      content:
        "A integração com WhatsApp mudou completamente nosso atendimento ao cliente. Agora oferecemos suporte 24/7 e nossos clientes estão muito mais satisfeitos com a agilidade das respostas.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Ana Costa",
      role: "Gerente Financeira",
      company: "Costa & Partners",
      content:
        "Reduzimos nossos custos operacionais em mais de 50% após implementar a plataforma MULTIBPO. O ROI foi alcançado em apenas 3 meses. Recomendo para todos os escritórios contábeis.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=80&h=80&fit=crop&crop=face",
    },
  ];

  return (
    <section ref={ref} id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O Que Nossos <span className="text-blue-600">Clientes</span> Dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Depoimentos reais de contadores que transformaram seus negócios com
            nossas soluções digitais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                index === 0
                  ? "delay-200"
                  : index === 1
                  ? "delay-500"
                  : "delay-700"
              } ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 border-gray-200">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="flex text-yellow-400 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="border-t pt-6 flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-blue-600">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
