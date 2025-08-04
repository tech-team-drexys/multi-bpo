import {
  Shield,
  Zap,
  FileText,
  Sparkles,
  CheckCircle,
  FileUser,
  Landmark,
  Building,
  User,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faChartLine,
  faFileContract,
  faLandmark,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

const ConsultoriaIA = () => {
  const { ref: headerRef, isVisible: headerVisible } =
    useScrollReveal<HTMLDivElement>();
  const { ref: mainContentRef, isVisible: mainContentVisible } =
    useScrollReveal<HTMLDivElement>();
  const { ref: imageRef, isVisible: imageVisible } =
    useScrollReveal<HTMLDivElement>();
  const { ref: useCasesHeaderRef, isVisible: useCasesHeaderVisible } =
    useScrollReveal<HTMLDivElement>();
  const { ref: useCasesGridRef, isVisible: useCasesGridVisible } =
    useScrollReveal<HTMLDivElement>();

  // Typewriter animation state
  const [currentText, setCurrentText] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const questions = [
    "Como calcular o ICMS-ST para produtos importados?",
    "Qual regime tributário é melhor para minha empresa?",
    "Como fazer a rescisão de um funcionário CLT?",
    "Quais documentos preciso para abrir uma filial?",
  ];

  useEffect(() => {
    if (!useCasesGridVisible) return;

    const currentQuestion = questions[currentQuestionIndex];

    const timeout = setTimeout(
      () => {
        if (isPaused) {
          setIsPaused(false);
          setIsDeleting(true);
          return;
        }

        if (isDeleting) {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
          }
        } else {
          if (currentText.length < currentQuestion.length) {
            setCurrentText(currentQuestion.slice(0, currentText.length + 1));
          } else {
            setIsPaused(true);
          }
        }
      },
      isPaused ? 2000 : isDeleting ? 30 : 50
    );

    return () => clearTimeout(timeout);
  }, [
    currentText,
    isDeleting,
    isPaused,
    currentQuestionIndex,
    questions,
    useCasesGridVisible,
  ]);

  const benefits = [
    {
      icon: Shield,
      title: "Embasamento Legal",
      description:
        "Fundamentado em legislações, normas técnicas, instruções normativas e jurisprudências atualizadas.",
    },
    {
      icon: Zap,
      title: "Respostas Instantâneas",
      description:
        "Tire dúvidas e resolva problemas com agilidade e precisão. Sem ficar em filas de espera ou aguardar respostas por e-mail.",
    },
    {
      icon: CheckCircle,
      title: "Segurança nas Entregas",
      description:
        "Mais confiança, menos retrabalho e zero dúvidas sem resposta. Gere confiança e crie autoridade.",
    },
    {
      icon: User,
      title: "Especialistas Humanos",
      description:
        "Quando necessário, direcionamos o atendimento para nossos profissionais especializados humanos. ",
    },
  ];

  const useCases = [
    {
      icon: faLandmark,
      title: "Consultoria Tributária",
      description:
        "Esclareça dúvidas sobre regimes tributários, créditos de PIS/COFINS, ICMS-ST e outros pontos críticos com respostas contextualizadas e seguras.",
    },
    {
      icon: faFileContract,
      title: "Consultoria Trabalhista",
      description:
        "Receba orientações sobre admissões, rescisões, afastamentos e obrigações legais com clareza e base na legislação atualizada.",
    },
    {
      icon: faBuilding,
      title: "Consultoria Societária",
      description:
        "Conte com apoio na elaboração de alterações contratuais, abertura de empresas, filiais, registros e processos societários complexos.",
    },
    {
      icon: faChartLine,
      title: "Consultoria Contábil",
      description:
        "Tire dúvidas técnicas e operacionais sobre rotinas contábeis e lançamentos, com respostas que aliam agilidade e fundamentação legal.",
    },
  ];

  return (
    <section className="pt-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          ref={headerRef}
          className={`text-center mb-20 scroll-reveal ${
            headerVisible ? "is-visible" : ""
          }`}
        >
          <div className="inline-flex items-center gap-2 border border-gray-200 bg-gray-100 text-gray-900 px-6 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            AI Powered
          </div>
          <h2 className="text-[2.5rem] font-bold text-gray-900 mb-8 leading-tight">
            Consultoria Técnica com{" "}
            <span className="text-blue-600">Inteligência Artificial - IA</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Tire dúvidas, resolva problemas e tome decisões técnicas com total
            segurança e confiança. Reduza retrabalhos e garanta conformidade
            legal em todas as suas operações com o suporte de uma base sólida de
            conhecimento especializado.
          </p>
        </div>

        {/* Main Visual Section - Conteúdo Escrito à Esquerda, Imagem à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center mb-16">
          {/* Conteúdo Escrito - Lado Esquerdo */}
          <div
            ref={mainContentRef}
            className={`space-y-8 scroll-reveal-from-left ${
              mainContentVisible ? "is-visible" : ""
            }`}
          >
            <div className="space-y-5">
              <h3 className="text-3xl font-bold text-gray-800 leading-tight">
                Inteligência que entende o seu dia a dia{" "}
                <span className="text-blue-600">Contábil</span>
              </h3>
              <p className="text-md text-gray-600 leading-relaxed">
                Muito além de respostas genéricas. Com base sólida, linguagem
                especializada e compreensão contextual, nossa IA entrega o que
                você precisa para atuar com mais precisão — como ter um
                especialista ao seu lado, 24h por dia.
              </p>
            </div>
          </div>

          {/* Imagem - Lado Direito */}
          <div
            ref={imageRef}
            className={`relative scroll-reveal-from-right ${
              imageVisible ? "is-visible" : ""
            }`}
          >
            <img
              src="/wagner-contador.png"
              alt="Interface da Consultoria IA"
              className="h-[26rem] object-cover rounded-lg"
            />

            {/* Tags no canto inferior direito */}
            <div className="absolute bottom-1 left-64 space-y-3">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-5 py-3 shadow-lg border border-gray-100">
                <p className="text-base font-medium text-gray-900">
                  Wagner Ramos
                </p>
                <p className="text-sm text-gray-700">
                  Analista Fiscal MULTI BPO
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Benefícios - Parte de Baixo */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32 scroll-reveal ${
            mainContentVisible ? "is-visible" : ""
          }`}
        >
          {benefits.map((benefit, index) => {
            const { ref: benefitRef, isVisible: benefitVisible } =
              useScrollReveal<HTMLDivElement>();
            return (
              <div
                key={index}
                ref={benefitRef}
                className={`group p-6 bg-white rounded-xl shadow-sm border border-gray-100 
                  scroll-reveal scroll-reveal-delay-${(index + 1) * 100} ${
                  benefitVisible ? "is-visible" : ""
                }`}
              >
                <div className="flex flex-col items-start space-y-3">
                  <div className="w-12 h-12 bg-blue-500 flex items-center justify-center rounded-xl">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Use Cases Section */}
        <div className="space-y-20">
          {/* Header - mantém centralizado */}
          <div
            ref={useCasesHeaderRef}
            className={`text-center scroll-reveal ${
              useCasesHeaderVisible ? "is-visible" : ""
            }`}
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Uma IA, <span className="text-blue-600">Todas as Soluções</span>
            </h3>
            <p className="text-md text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Pare de buscar especialistas diferentes para cada problema. Nossa
              IA domina os departamentos tributário, trabalhista, societário e
              contábil simultaneamente, oferecendo soluções integradas e
              precisas em segundos. É como ter uma equipe completa de
              consultores trabalhando para você.
            </p>
          </div>

          {/* Grid com imagem à esquerda e cards à direita */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - AI Chat Mockup */}
            <div
              ref={useCasesGridRef}
              className={`transition-all duration-1000 ${
                useCasesGridVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="relative">
                {/* Browser Mockup */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Browser Header */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white rounded-md px-3 py-1 mx-4">
                      <span className="text-xs text-gray-600">
                        app.multibpo.com.br/ia
                      </span>
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 h-96 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <img
                          src="/logo-multi-bpo.png"
                          alt="Logo da MULTI BPO"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Luca IA</h4>
                        <p className="text-sm text-gray-600">
                          Consultor Contábil
                        </p>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 space-y-4 mb-6">
                      {/* Bot welcome message */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <img
                            src="/logo-multi-bpo.png"
                            alt="Logo da MULTI BPO"
                          />
                        </div>
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100 max-w-xs">
                          <p className="text-sm text-gray-800">
                            Olá! Sou o Luca, a IA da MULTI BPO. Como posso
                            ajudar você hoje?
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Input Area - Fixo no final */}
                    <div className="mt-auto">
                      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-800">
                              {currentText}
                              {!isPaused && (
                                <span className="animate-pulse text-blue-600">
                                  |
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-10 h-10 rounded-full text-gray-600 transition-all bg-transparent hover:bg-gray-400/10 hover:text-gray-800"
                        >
                          <a href="#prompt">
                            <FontAwesomeIcon
                              icon={faArrowUp}
                              className="!w-4 !h-4"
                            />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Cards */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 scroll-reveal ${
                useCasesGridVisible ? "is-visible" : ""
              }`}
            >
              {useCases.map((useCase, index) => {
                const { ref: cardRef, isVisible: cardVisible } =
                  useScrollReveal<HTMLDivElement>();
                return (
                  <div
                    key={index}
                    ref={cardRef}
                    className={`group p-6 bg-white rounded-xl shadow-sm border border-gray-100 
                      scroll-reveal scroll-reveal-delay-${(index + 1) * 100} ${
                      cardVisible ? "is-visible" : ""
                    }`}
                  >
                    <div className="flex flex-col items-start space-y-3">
                      <FontAwesomeIcon
                        icon={useCase.icon}
                        className="w-6 h-6 text-blue-500"
                      />

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {useCase.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {useCase.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultoriaIA;
