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
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useScrollLock } from "@/hooks/useScrollLock";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";

interface HeaderProps {
  enableScrollAnimation?: boolean;
}

const Header = ({ enableScrollAnimation = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  const handleNavigateToHome = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (location.pathname === "/") {
      scrollTo(0);
    } else {
      navigate("/");
    }
  };

  const handleLoginClick = (event: React.FormEvent) => {
    event.preventDefault();
    setShowLoginModal(true);
  };

  const handleSignupClick = (event: React.FormEvent) => {
    event.preventDefault();
    setShowSignupModal(true);
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

  // Usar o hook para gerenciar o scroll do menu mobile
  useScrollLock(isMenuOpen);

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
                className={`h-7 absolute inset-0 w-full min-[1050px]:h-full object-contain transition-opacity duration-300 ${
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

          {/* Nav Bar */}
          <nav className="hidden min-[980px]:block">
            <div className="flex items-baseline space-x-4 min-[1160px]:space-x-6">
              <a
                href="/"
                onClick={handleNavigateToHome}
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group cursor-pointer ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-600"
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
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#about", { offset: -80 });
                }}
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group cursor-pointer ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-600"
                    : "text-white hover:text-white"
                }`}
              >
                Quem Somos
                {!isScrolledState && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                )}
              </a>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#services", { offset: -80 });
                }}
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group cursor-pointer ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-600"
                    : "text-white hover:text-white"
                }`}
              >
                Serviços
                {!isScrolledState && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                )}
              </a>
              <a
                href="#courses"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#courses", { offset: -80 });
                }}
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group cursor-pointer ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-600"
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
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#blog", { offset: -80 });
                }}
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group cursor-pointer ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-600"
                    : "text-white hover:text-white"
                }`}
              >
                Blog
                {!isScrolledState && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                )}
              </a>

              <button
                onClick={handleSignupClick}
                className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group ${
                  isScrolledState
                    ? "text-gray-800 hover:text-blue-600"
                    : "text-white hover:text-white"
                }`}
              >
                Downloads
                {!isScrolledState && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                )}
              </button>
            </div>
          </nav>

          {/* Buttons */}
          <div className="hidden min-[980px]:flex gap-4 min-[1160px]:gap-6">
            <button
              onClick={handleSignupClick}
              className={`px-2 py-2 text-xs lg:text-sm font-medium transition-colors relative group cursor-pointer ${
                isScrolledState
                  ? "text-gray-800 hover:text-blue-600"
                  : "text-white hover:text-white"
              }`}
            >
              Cadastrar-se
              {!isScrolledState && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              )}
            </button>
            <Button
              onClick={handleLoginClick}
              className={`w-[110px] min-[1160px]:w-[130px] h-9 min-[1160px]:h-10 text-xs lg:text-sm font-medium transition-all duration-300 active:scale-[.98] ${
                isScrolledState
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-white hover:bg-blue-500 text-black hover:text-white"
              }`}
            >
              Login
            </Button>
          </div>

          {/* Hamburger Menu Button */}
          <div className="min-[980px]:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-colors ${
                isScrolledState
                  ? "text-gray-800 hover:text-blue-500"
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
            className="min-[980px]:hidden absolute top-full left-0 right-0 mx-6 mt-2 z-50"
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
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#about", { offset: -80 });
                  setIsMenuOpen(false);
                }}
                className="block text-slate-700 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer"
              >
                Quem Somos
              </a>

              {/* Dropdown Serviços Mobile */}
              <div>
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#services", { offset: -80 });
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex justify-between items-center text-slate-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                >
                  Serviços
                </a>
              </div>

              {/* Dropdown Cursos Mobile */}
              <div>
                <a
                  href="#courses"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#courses", { offset: -80 });
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex justify-between items-center text-slate-700 hover:text-blue-600 px-3 py-2 text-base font-medium"
                >
                  Cursos
                </a>
              </div>

              <a
                href="#blog"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#blog", { offset: -80 });
                  setIsMenuOpen(false);
                }}
                className="block text-slate-700 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer"
              >
                Blog
              </a>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-300">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    setShowSignupModal(true);
                  }}
                  className={`${components.button.neutral} justify-center w-full h-10 text-sm`}
                >
                  Cadastrar-se
                </button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full h-10 text-sm font-medium bg-emerald-500 hover:bg-emerald-700 text-white active:scale-[.98] transition-all duration-150"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Login */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onOpenSignup={() => setShowSignupModal(true)}
      />

      {/* Modal de Cadastro */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </header>
  );
};

export default Header;
