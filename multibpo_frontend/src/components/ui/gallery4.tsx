"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { typography, spacing, components } from "@/lib/design-system";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items?: Gallery4Item[];
}

export interface CategoryCarouselProps {
  title: string;
  items: Gallery4Item[];
}

const data = [
  {
    id: "terceirizacao-contabil",
    title: "Terceirização do Departamento Contábil",
    description:
      "Escrituração completa e auditoria por IA para mais segurança e produtividade.",
    href: "#",
    image: "/services-pictures/servico-1-contabilidade.png",
  },
  {
    id: "terceirizacao-fiscal",
    title: "Terceirização do Departamento Fiscal / Tributário",
    description:
      "Apuração e entrega fiscal sem erros e sem atrasos, com conformidade garantida por IA.",
    href: "#",
    image: "/services-pictures/servico-2-fiscal-tributario.png",
  },
  {
    id: "terceirizacao-dp",
    title: "Terceirização do Departamento Pessoal (DP)",
    description:
      "Gestão automatizada da folha, admissões, férias e eSocial com agilidade total.",
    href: "#",
    image: "/services-pictures/servico-3-dp.png",
  },
  {
    id: "terceirizacao-paralegal",
    title: "Terceirização do Departamento Paralegal / Legalização",
    description:
      "Abertura, alteração e regularização de empresas com rapidez e sem burocracia.",
    href: "#",
    image: "/services-pictures/servico-4-legalizacao-empresas.png",
  },
  {
    id: "planejamento-tributario",
    title: "Planejamento Tributário Inteligente",
    description:
      "Reduza impostos com estratégias legais e tecnologia de análise tributária. Elisão Fiscal com inteligência.",
    href: "#",
    image: "/services-pictures/servico-5-planejamento-tributario.png",
  },
  {
    id: "assessoria-tributaria",
    title: "Assessoria Tributária e Regularização Fiscal",
    description:
      "Regularize CNPJs, reenquadre empresas e recupere créditos com apoio técnico e jurídico.",
    href: "#",
    image: "/services-pictures/servico-6-regularizacao-fiscal.png",
  },
  {
    id: "certificados-digitais",
    title: "Emissão de Certificados Digitais e-CPF e e-CNPJ",
    description:
      "Certificação digital com agilidade e validade jurídica garantida.",
    href: "#",
    image: "/services-pictures/servico-7-certificado-digital.png",
  },
  {
    id: "radar-receita",
    title: "Habilitação no RADAR da Receita Federal",
    description:
      "Libere o comércio exterior dos seus clientes com segurança e rapidez.",
    href: "#",
    image: "/services-pictures/servico-8-radar-receita-federal.png",
  },
  {
    id: "bpo-financeiro",
    title: "BPO Financeiro com Inteligência e Precisão",
    description:
      "Terceirize toda a rotina financeira com controle, fluxo de caixa e cobrança automatizada. Gestão Financeira eficiente.",
    href: "#",
    image: "/services-pictures/servico-9-bpo-financeiro.png",
  },
  {
    id: "registro-marca",
    title: "Registro de Marca no INPI",
    description:
      "Proteja o nome e a identidade do seu cliente antes que alguém registre primeiro.",
    href: "#",
    image: "/services-pictures/servico-10-registro-de-marca.png",
  },
  {
    id: "cursos-treinamentos",
    title: "Cursos e Treinamentos para Equipes Contábeis",
    description:
      "Capacitação prática e atualizada para elevar o desempenho técnico da sua equipe.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?w=400&h=250&fit=crop",
  },
  {
    id: "atendimento-ia-whatsapp",
    title: "Atendimento ao Cliente com IA (WhatsApp)",
    description:
      "Atendimento automatizado e humanizado com IA que atendem seus clientes 24h com eficiência e empatia.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
  },
  {
    id: "consultoria-tecnica-ia",
    title: "Consultoria Técnica com IA (Web + WhatsApp)",
    description:
      "Tire dúvidas técnicas com IA treinada e suporte humano especializado.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1518186233392-c232efbf2373?w=400&h=250&fit=crop",
  },
  {
    id: "endereco-fiscal",
    title: "Endereço Fiscal em Alphaville",
    description:
      "Domicílio fiscal seguro para empresas, em um endereço de alto padrão e prestígio, com incentivo fiscal.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
  },
  {
    id: "estruturacao-holdings",
    title: "Estruturação de Holdings",
    description:
      "Organize o patrimônio do seu cliente com proteção, sucessão e economia tributária.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
  },
  {
    id: "recrutamento-ia",
    title: "Recrutamento e Seleção com IA",
    description:
      "Encontre talentos com mais rapidez, precisão e assertividade usando inteligência artificial.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=400&h=250&fit=crop",
  },
  {
    id: "marketing-digital",
    title:
      "Marketing Digital para Escritórios Contábeis, Gestão de Redes Sociais e Criação de Conteúdo",
    description:
      "Fortaleça sua marca contábil, atraia clientes e se destaque online, tenha presença nas redes sociais.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
  },
  {
    id: "sites-contabeis",
    title: "Criação e Otimização de Sites Contábeis",
    description:
      "Sites profissionais com foco em autoridade, conversão e presença no Google.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
  },
];

// Função para separar os serviços por categoria
const categorizeServices = (services: Gallery4Item[]) => {
  // Definindo os IDs dos serviços para cada categoria conforme o header
  const terceirizacaoIds = [
    "terceirizacao-contabil",
    "terceirizacao-fiscal",
    "terceirizacao-dp",
    "terceirizacao-paralegal",
    "bpo-financeiro",
  ];
  const consultoriaIds = [
    "planejamento-tributario",
    "assessoria-tributaria",
    "consultoria-tecnica-ia",
    "estruturacao-holdings",
    "cursos-treinamentos",
  ];
  const servicosDigitaisIds = [
    "certificados-digitais",
    "radar-receita",
    "registro-marca",
    "atendimento-ia-whatsapp",
    "endereco-fiscal",
    "recrutamento-ia",
    "marketing-digital",
    "sites-contabeis",
  ];
  return {
    terceirizacao: services.filter((service) =>
      terceirizacaoIds.includes(service.id)
    ),
    consultoria: services.filter((service) =>
      consultoriaIds.includes(service.id)
    ),
    servicosDigitais: services.filter((service) =>
      servicosDigitaisIds.includes(service.id)
    ),
  };
};

// Componente individual para cada carrossel de categoria
const CategoryCarousel = ({ title, items }: CategoryCarouselProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setScrollProgress(carouselApi.scrollProgress());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    carouselApi.on("scroll", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
      carouselApi.off("scroll", updateSelection);
    };
  }, [carouselApi]);

  // Calculate active dot based on scroll progress
  const totalDots = Math.min(items.length, 15);
  const activeDotIndex = Math.round(scrollProgress * (totalDots - 1));
  return (
    <div className="mb-20 last:mb-0">
      <div className="container mx-auto mb-8">
        <h3 className={`${typography.heading.md} text-gray-900 mb-4`}>
          {title}
        </h3>
      </div>

      <div className="w-full relative">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            dragFree: true,
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          {/* Botão de navegação esquerda */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollPrev();
            }}
            disabled={!canScrollPrev}
            className="absolute left-4 top-[13.5rem] -translate-y-1/2 z-20 h-12 w-12 bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            <ArrowLeft className="size-5" />
          </Button>

          {/* Botão de navegação direita */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollNext();
            }}
            disabled={!canScrollNext}
            className="absolute right-4 top-[13.5rem] -translate-y-1/2 z-20 h-12 w-12 bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            <ArrowRight className="size-5" />
          </Button>

          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <a href={item.href} className="group rounded-xl">
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9] transition-all duration-300 flex flex-col justify-end">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_0%,transparent_10%,hsl(var(--primary)/0.2)_25%,hsl(var(--primary)/0.6)_50%,hsl(var(--primary)/0.8)_70%,hsl(var(--primary)/0.95)_85%,hsl(var(--primary)/1)_100%)] mix-blend-multiply" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                    <div className="relative z-10 p-6 text-primary-foreground md:p-8 mt-auto transition-transform duration-500 ease-out group-hover:-translate-y-4">
                      <div className="mb-2 pt-4 text-base font-semibold md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="mb-8 text-xs md:mb-12 lg:mb-9 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                        {item.description}
                      </div>
                      <div className="inline-flex items-center bg-[#00a85a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors relative z-20">
                        Saiba mais{" "}
                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {items.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({
              length: totalDots,
            }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  activeDotIndex === index ? "bg-primary" : "bg-primary/20"
                }`}
                onClick={() => carouselApi?.scrollTo(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal com categorias separadas
const CategorizedGallery = ({
  title = "Nossos Serviços",
  description = "Uma plataforma completa de BPO desenvolvida especificamente para revolucionar a gestão de escritórios contábeis modernos.",
  items = data,
}: Gallery4Props) => {
  const categorizedServices = categorizeServices(items);
  return (
    <section className={`pb-32 pt-44 bg-white`}>
      <div className="container mx-auto">
        <div className={`${spacing.content.md} text-center `}>
          <h2 className={`${typography.heading.lg} text-gray-900 mb-6`}>
            Nossos <span className="text-blue-600">Serviços</span>
          </h2>
          <p
            className={`${typography.body.lg} text-gray-600 max-w-3xl mx-auto`}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Terceirização */}
      <CategoryCarousel
        title="Terceirização"
        items={categorizedServices.terceirizacao}
      />

      {/* Consultoria & Assessoria */}
      <CategoryCarousel
        title="Consultoria & Assessoria"
        items={categorizedServices.consultoria}
      />

      {/* Serviços Digitais */}
      <CategoryCarousel
        title="Serviços Digitais"
        items={categorizedServices.servicosDigitais}
      />
    </section>
  );
};

// Componente original Gallery4 mantido para compatibilidade
const Gallery4 = ({
  title = "Nossos Serviços",
  description = "Descubra como empresas líderes estão aproveitando tecnologias modernas para construir experiências digitais excepcionais. Estes casos de estudo mostram aplicações reais e histórias de sucesso.",
  items = data,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setScrollProgress(carouselApi.scrollProgress());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    carouselApi.on("scroll", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
      carouselApi.off("scroll", updateSelection);
    };
  }, [carouselApi]);

  // Calculate active dot based on scroll progress
  const totalDots = Math.min(items.length, 15);
  const activeDotIndex = Math.round(scrollProgress * (totalDots - 1));
  return (
    <section className="bg-slate-100 pb-32 pt-20">
      <div className="container mx-auto">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-20">
          <div className="flex flex-col gap-4">
            <h2 className={`${typography.heading.lg} text-gray-900 mb-4`}>
              Nossos <span className="text-blue-600">Serviços</span>
            </h2>
            <p
              className={`${typography.body.lg} text-gray-600 max-w-3xl mx-auto`}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full relative">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            dragFree: true,
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          {/* Botão de navegação esquerda */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollPrev();
            }}
            disabled={!canScrollPrev}
            className="absolute left-4 top-[13.5rem] -translate-y-1/2 z-20 h-12 w-12 bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            <ArrowLeft className="size-5" />
          </Button>

          {/* Botão de navegação direita */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              carouselApi?.scrollNext();
            }}
            disabled={!canScrollNext}
            className="absolute right-4 top-[13.5rem] -translate-y-1/2 z-20 h-12 w-12 bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            <ArrowRight className="size-5" />
          </Button>

          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <a href={item.href} className="group rounded-xl">
                  <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9] transition-all duration-300 flex flex-col justify-end">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_0%,transparent_10%,hsl(var(--primary)/0.2)_25%,hsl(var(--primary)/0.6)_50%,hsl(var(--primary)/0.8)_70%,hsl(var(--primary)/0.95)_85%,hsl(var(--primary)/1)_100%)] mix-blend-multiply" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                    <div className="relative z-10 p-6 text-primary-foreground md:p-8 mt-auto transition-transform duration-500 ease-out group-hover:-translate-y-4">
                      <div className="mb-2 pt-4 text-base font-semibold md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="mb-8 text-xs md:mb-12 lg:mb-9 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                        {item.description}
                      </div>
                      <div className="inline-flex items-center bg-[#00a85a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors relative z-20">
                        Saiba mais{" "}
                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({
            length: totalDots,
          }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                activeDotIndex === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export { Gallery4, CategorizedGallery };
