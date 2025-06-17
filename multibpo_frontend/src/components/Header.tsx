import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { components } from "@/lib/design-system";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  enableScrollAnimation?: boolean;
}

const Header = ({ enableScrollAnimation = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNavigateToHome = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (!enableScrollAnimation) return;

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableScrollAnimation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup function to restore scroll on component unmount if menu was open
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Se a animação não está habilitada, sempre use o estilo "scrolled"
  const isScrolledState = enableScrollAnimation ? hasScrolled : true;

  const toggleMobileDropdown = (dropdownName: string) => {
    setOpenMobileDropdown(
      openMobileDropdown === dropdownName ? null : dropdownName
    );
  };

  const servicosCategories = [
    {
      title: "Terceirização",
      items: [
        "Terceirização do Departamento Contábil",
        "Terceirização do Departamento Fiscal / Tributário",
        "Terceirização do Departamento Pessoal (DP)",
        "Terceirização do Departamento Paralegal / Legalização",
        "BPO Financeiro com Inteligência e Precisão",
      ],
    },
    {
      title: "Consultoria & Assessoria",
      items: [
        "Planejamento Tributário Inteligente",
        "Assessoria Tributária e Regularização Fiscal",
        "Consultoria Técnica com IA (Web + WhatsApp)",
        "Estruturação de Holdings",
        "Cursos e Treinamentos para Equipes Contábeis",
      ],
    },
    {
      title: "Serviços Digitais",
      items: [
        "Emissão de Certificados Digitais e-CPF e e-CNPJ",
        "Habilitação no RADAR da Receita Federal",
        "Registro de Marca no INPI",
        "Atendimento ao Cliente com IA (WhatsApp)",
        "Endereço Fiscal em Alphaville",
        "Recrutamento e Seleção com IA",
        "Marketing Digital para Escritórios Contábeis",
        "Criação e Otimização de Sites Contábeis",
      ],
    },
  ];

  const cursosCategories = [
    {
      title: "Contabilidade",
      items: ["Contabilidade Digital", "Gestão de Escritórios"],
    },
    {
      title: "Marketing & Tecnologia",
      items: ["Marketing para Contadores", "Inteligência Artificial"],
    },
    {
      title: "Ferramentas",
      items: ["Excel Avançado", "Power BI"],
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-300 py-1 ${
        isScrolledState
          ? "bg-white border-b border-gray-200"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-14 lg:px-14">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a
              href="/"
              onClick={handleNavigateToHome}
              className="relative w-[100px] lg:w-[120px] h-8 cursor-pointer"
            >
              {/* Logo light (antes da animação) */}
              <img
                src="/lovable-uploads/light-logo.png"
                alt="MULTIBPO Logo"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                  isScrolledState ? "opacity-0" : "opacity-100"
                }`}
              />
              {/* Logo dark (após a animação) */}
              <img
                src="/lovable-uploads/logo.png"
                alt="MULTIBPO Logo"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                  isScrolledState ? "opacity-100" : "opacity-0"
                }`}
              />
            </a>
          </div>

          <nav className="hidden min-[945px]:block">
            <div className="flex items-baseline space-x-4 lg:space-x-6">
              <a
                href="/"
                onClick={handleNavigateToHome}
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group cursor-pointer ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-800"
                    : "text-white hover:text-white"
                }`}
              >
                Início
                {!isScrolledState && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                )}
              </a>
              <a
                href="#about"
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-800"
                    : "text-white hover:text-white"
                }`}
              >
                Quem Somos
                {!isScrolledState && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                )}
              </a>
              <div className="relative group">
                <div
                  className={`flex items-center px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative cursor-pointer ${
                    isScrolledState
                      ? "text-gray-800 hover:text-blue-800"
                      : "text-white hover:text-white"
                  }`}
                >
                  Serviços
                  <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                  {!isScrolledState && (
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  )}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[650px] bg-slate-100 shadow-lg border-0 p-6 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="grid grid-cols-3 gap-8">
                    {servicosCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="text-left">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm text-left">
                          {category.title}
                        </h4>
                        <div className="space-y-2">
                          {category.items.map((item, index) => (
                            <div
                              key={index}
                              className="text-gray-800 hover:bg-white/50 cursor-pointer transition-all duration-200 text-xs p-2 rounded text-left"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href="#courses"
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-800"
                    : "text-white hover:text-white"
                }`}
              >
                Cursos
                {!isScrolledState && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                )}
              </a>
              <a
                href="#blog"
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-800"
                    : "text-white hover:text-white"
                }`}
              >
                Blog
                {!isScrolledState && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                )}
              </a>
            </div>
          </nav>

          <div className="hidden min-[945px]:flex gap-2 lg:gap-6">
            <div
              className={`${components.button.default} ${
                isScrolledState
                  ? "text-blue-600 hover:text-blue-700"
                  : "text-white hover:text-gray-200"
              }`}
            >
              Começar Agora
              <ArrowRight
                className={`${components.button.defaultArrow} ${
                  !isScrolledState ? "text-white" : ""
                }`}
              />
            </div>
            <Button
              className={`w-[110px] lg:w-[130px] h-9 lg:h-10 text-xs lg:text-sm font-medium transition-colors duration-300 ${
                isScrolledState
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-white hover:bg-green-500 text-black hover:text-white"
              }`}
            >
              Login
            </Button>
          </div>

          <div className="min-[945px]:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-colors ${
                isScrolledState
                  ? "text-gray-800 hover:text-blue-600"
                  : "text-white hover:text-blue-300"
              }`}
            >
              {isMenuOpen ? (
                <X
                  size={24}
                  className={isScrolledState ? "text-gray-800" : "text-white"}
                />
              ) : (
                <Menu
                  size={24}
                  className={isScrolledState ? "text-gray-800" : "text-white"}
                />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="min-[945px]:hidden absolute top-full left-0 right-0 mx-6 mt-2 z-50"
          >
            <div className="py-6 px-6 space-y-1 bg-gray-100 rounded-xl shadow-lg max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-custom">
              <a
                href="/"
                onClick={(e) => {
                  handleNavigateToHome(e);
                  setIsMenuOpen(false);
                }}
                className="block text-slate-700 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer"
              >
                Início
              </a>
              <a
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
              >
                Quem Somos
              </a>

              {/* Dropdown Serviços Mobile */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown("servicos")}
                  className="w-full flex justify-between items-center text-slate-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                >
                  Serviços
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      openMobileDropdown === "servicos" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileDropdown === "servicos" && (
                  <div className="pl-6 pb-2 space-y-1">
                    {servicosCategories.map((category) =>
                      category.items.map((item, index) => (
                        <a
                          key={`${category.title}-${index}`}
                          href={`#service-${item
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-slate-600 hover:text-blue-500 px-3 py-1.5 text-sm"
                        >
                          {item}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Dropdown Cursos Mobile */}
              <div>
                <button
                  onClick={() => toggleMobileDropdown("cursos")}
                  className="w-full flex justify-between items-center text-slate-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                >
                  Cursos
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      openMobileDropdown === "cursos" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileDropdown === "cursos" && (
                  <div className="pl-6 pb-2 space-y-1">
                    {cursosCategories.map((category) =>
                      category.items.map((item, index) => (
                        <a
                          key={`${category.title}-${index}`}
                          href={`#course-${item
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-slate-600 hover:text-blue-500 px-3 py-1.5 text-sm"
                        >
                          {item}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>

              <a
                href="#blog"
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
              >
                Blog
              </a>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-300">
                <div
                  onClick={() => setIsMenuOpen(false)}
                  className={`${components.button.default} justify-center w-full h-10 text-sm`}
                >
                  Começar Agora
                  <ArrowRight className={components.button.defaultArrow} />
                </div>
                <Button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full h-10 text-sm font-medium bg-emerald-500 hover:bg-emerald-700 text-white"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
