import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const LandingPageChart = () => {
  const [expandedParents, setExpandedParents] = useState({});

  const parentSections = [
    {
      id: "landing-page",
      title: "Landing Page",
      color: "from-blue-600 via-purple-600 to-indigo-700",
      icon: "LP",
      features: [
        "Otimização de assets",
        "WA no canto",
        "Altura da Tela",
        "Gatilhos Subliminares",
      ],
      children: [
        {
          title: "Header",
          items: [
            "Conteúdo",
            "Scroll",
            "Buttons",
            "Dropdown Menu",
            "Hamburguer Menu",
            "Aprove",
          ],
          color: "bg-blue-500",
        },
        {
          title: "Hero",
          items: [
            "Vídeo - Otimização",
            "Typewriter",
            "Placeholder dinâmico",
            "Botões com Sugestões de Prompt",
            "Conteúdo",
          ],
          color: "bg-purple-500",
        },
        {
          title: "Benefícios",
          items: ["Copy Persuasivo", "Bento Grid", "Display Cards"],
          color: "bg-green-500",
        },
        {
          title: "Serviços",
          items: [
            "Conteúdo",
            "Netflix Style Carroussel",
            "Seta que move imagens",
            "Imagens",
            "Aprove",
          ],
          color: "bg-orange-500",
        },
        {
          title: "Consultoria TAHIA",
          items: [
            "Copy",
            "Imagens/Animação da aplicação:",
            "• Consult. Tributário",
            "• Consult. Trabalhista/DP",
            "• Consult Societária",
            "Oferta com Gatilhos:",
            "• Apenas 1000 primeiros",
            "• Restam x unidades (Lógica)",
            "• Contrate x Degustação",
          ],
          color: "bg-red-500",
        },
        {
          title: "Cursos",
          items: ["Conteúdo", "Imagens", "Aprove"],
          color: "bg-teal-500",
        },
        {
          title: "CTA Banner",
          items: ["Pesquisa", "Conteúdo", "Imagens/Posters"],
          color: "bg-indigo-500",
        },
        {
          title: "Quem Somos",
          items: ["Foto / Banner", "Breve Resumo"],
          color: "bg-pink-500",
        },
        {
          title: "Blog",
          items: ["Foto", "Post Placeholder"],
          color: "bg-yellow-500",
        },
        {
          title: "Footer",
          items: [
            "Conteúdo",
            "Hover",
            "Social Media Row",
            "Style",
            "Adaptações pros serviços",
          ],
          color: "bg-gray-500",
        },
      ],
    },
    // {
    //   id: "aplicacao",
    //   title: "Aplicação",
    //   color: "from-emerald-600 via-teal-600 to-cyan-700",
    //   icon: "APP",
    //   features: [
    //     "Interface Principal",
    //     "Funcionalidades Core",
    //     "UX/UI Elements",
    //     "Interações",
    //   ],
    //   children: [
    //     {
    //       title: "Animação entre páginas",
    //       items: ["Transições suaves", "Loading states", "Page transitions"],
    //       color: "bg-emerald-500",
    //     },
    //     {
    //       title: "Aviso de limite de mensagens",
    //       items: ["Modal de aviso", "Contador de mensagens", "Upgrade prompt"],
    //       color: "bg-teal-500",
    //     },
    //     {
    //       title: "Cores / Layout",
    //       items: [
    //         "Theme system",
    //         "Color palette",
    //         "Responsive design",
    //         "Dark/Light mode",
    //       ],
    //       color: "bg-cyan-500",
    //     },
    //     {
    //       title: "Animações de mensagens",
    //       items: [
    //         "Typing animation",
    //         "Message bubbles",
    //         "Send animation",
    //         "Smooth scroll",
    //       ],
    //       color: "bg-blue-500",
    //     },
    //     {
    //       title: "Adicionar doc / pic Menu",
    //       items: [
    //         "File upload",
    //         "Image preview",
    //         "Document handling",
    //         "Drag & drop",
    //       ],
    //       color: "bg-indigo-500",
    //     },
    //     {
    //       title: "Interromper prompt Button",
    //       items: ["Stop generation", "Cancel request", "Loading states"],
    //       color: "bg-purple-500",
    //     },
    //     {
    //       title: "Scrollbar",
    //       items: ["Custom styling", "Auto-scroll", "Smooth behavior"],
    //       color: "bg-pink-500",
    //     },
    //     {
    //       title: "Descer para final da conversa Button",
    //       items: [
    //         "Auto scroll to bottom",
    //         "New message indicator",
    //         "Smooth animation",
    //       ],
    //       color: "bg-red-500",
    //     },
    //     {
    //       title: "Row de Ferramentas (Dragable)",
    //       items: ["Draggable toolbar", "Tool positioning", "State persistence"],
    //       color: "bg-orange-500",
    //     },
    //     {
    //       title: "Sidebar",
    //       items: [
    //         "Navigation menu",
    //         "Collapsible",
    //         "User settings",
    //         "Chat history",
    //       ],
    //       color: "bg-yellow-500",
    //     },
    //   ],
    // },
    // {
    //   id: "politica-privacidade",
    //   title: "Política de Privacidade",
    //   color: "from-gray-600 via-slate-600 to-zinc-700",
    //   icon: "PP",
    //   features: ["Compliance", "LGPD", "Transparência", "Direitos do usuário"],
    //   children: [],
    // },
    // {
    //   id: "termos-uso",
    //   title: "Termos de Uso",
    //   color: "from-stone-600 via-neutral-600 to-gray-700",
    //   icon: "TU",
    //   features: [
    //     "Condições gerais",
    //     "Responsabilidades",
    //     "Limitações",
    //     "Acordos",
    //   ],
    //   children: [],
    // },
    // {
    //   id: "produtos",
    //   title: "Produtos",
    //   color: "from-violet-600 via-purple-600 to-fuchsia-700",
    //   icon: "PRD",
    //   features: ["Catálogo", "Preços", "Features", "Comparações"],
    //   children: [],
    // },
    // {
    //   id: "quem-somos-page",
    //   title: "Quem Somos",
    //   color: "from-rose-600 via-pink-600 to-red-700",
    //   icon: "QS",
    //   features: ["História", "Equipe", "Missão", "Valores"],
    //   children: [],
    // },
    // {
    //   id: "blog-page",
    //   title: "Blog",
    //   color: "from-amber-600 via-yellow-600 to-orange-700",
    //   icon: "BLG",
    //   features: ["Artigos", "Categorias", "Busca", "SEO"],
    //   children: [],
    // },
    // {
    //   id: "cadastro-simples",
    //   title: "Cadastro Simples",
    //   color: "from-lime-600 via-green-600 to-emerald-700",
    //   icon: "CS",
    //   features: [
    //     "Formulário básico",
    //     "Validação",
    //     "Email confirmation",
    //     "Quick signup",
    //   ],
    //   children: [],
    // },
    // {
    //   id: "cadastro-completo",
    //   title: "Cadastro Completo + Asaas",
    //   color: "from-teal-600 via-cyan-600 to-blue-700",
    //   icon: "CC",
    //   features: [
    //     "Dados completos",
    //     "Integração Asaas",
    //     "Pagamento",
    //     "Verificação",
    //   ],
    //   children: [],
    // },
    // {
    //   id: "login",
    //   title: "Login",
    //   color: "from-sky-600 via-blue-600 to-indigo-700",
    //   icon: "LOG",
    //   features: ["Autenticação", "Recuperação de senha", "2FA", "Social login"],
    //   children: [],
    // },
    // {
    //   id: "captura-cursos",
    //   title: "Página de Captura Cursos",
    //   color: "from-indigo-600 via-purple-600 to-violet-700",
    //   icon: "PCC",
    //   features: [
    //     "Lead capture",
    //     "Course preview",
    //     "CTA otimizado",
    //     "Formulário conversão",
    //   ],
    //   children: [],
    // },
  ];

  const toggleParent = (parentId) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Arquitetura do Sistema
          </h1>
        </div>

        <div className="space-y-12">
          {parentSections.map((parent) => (
            <div key={parent.id} className="relative">
              {/* Card Pai */}
              <div
                className={`bg-gradient-to-br ${parent.color} text-white rounded-2xl shadow-2xl border-4 border-white/20 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full animate-pulse"></div>

                <div className="relative z-10 p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mr-4">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-gray-800 font-bold text-xs">
                          {parent.icon}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold">{parent.title}</h2>
                    {parent.children.length > 0 && (
                      <button
                        onClick={() => toggleParent(parent.id)}
                        className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        {expandedParents[parent.id] ? (
                          <ChevronDown size={24} />
                        ) : (
                          <ChevronRight size={24} />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {parent.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-colors"
                      >
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 inline-block">
                      <span className="text-sm font-semibold">
                        {parent.children.length > 0
                          ? `${
                              parent.children.length
                            } Componentes • ${parent.children.reduce(
                              (total, section) => total + section.items.length,
                              0
                            )} Elementos Totais`
                          : "Página Individual"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards Filhos */}
              {parent.children.length > 0 && expandedParents[parent.id] && (
                <div className="relative mt-8">
                  <div className="absolute inset-0 flex items-start justify-center">
                    <div className="w-px h-12 bg-gradient-to-b from-purple-400 to-transparent"></div>
                  </div>

                  <div className="pt-12 flex flex-wrap justify-center gap-6">
                    {parent.children.map((section, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 relative w-72"
                      >
                        {/* Indicador de conexão */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-px h-6 bg-gradient-to-b from-purple-400 to-transparent"></div>
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full border-2 border-white"></div>

                        {/* Header do Card */}
                        <div className="p-4 border-b border-gray-100">
                          <h3 className="text-lg font-bold text-gray-800 text-center">
                            {section.title}
                          </h3>
                        </div>

                        {/* Lista de itens estilo Organization */}
                        <div className="p-4 space-y-2">
                          {section.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className={`${
                                section.color
                              } text-white rounded-lg p-3 text-sm font-medium hover:opacity-90 transition-opacity ${
                                item.startsWith("•")
                                  ? "ml-4 bg-opacity-80 text-xs"
                                  : item.includes(":")
                                  ? "bg-opacity-60 font-bold text-xs"
                                  : ""
                              }`}
                            >
                              {item.startsWith("•")
                                ? item.substring(2)
                                : item.includes(":")
                                ? item
                                : item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPageChart;
