import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-slate-600 bg-white border-t border-gray-300">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Primeira div - ~40% (2 colunas de 5) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo e descrição */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Link to="/">
                  <img
                    src="/lovable-uploads/logo.png"
                    alt="MULTIBPO Logo"
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              <p className="text-gray-500 leading-relaxed">
                Somos especialistas em automação e terceirização de processos
                para escritórios de contabilidade, trazendo a Inteligência para
                sua contabilidade operar no automático.
              </p>
            </div>

            {/* Redes sociais */}
            <div className="space-y-3">
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-pink-600 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-600 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-700 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-red-600 transition-all duration-300"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-gray-800 transition-all duration-300"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-black transition-all duration-300"
                  aria-label="X (Twitter)"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* CRC e endereço */}
            <div className="space-y-2 text-sm text-gray-500">
              <p className="font-medium">
                MULTI BPO DO BRASIL LTDA | CRC/SP 045316
              </p>
              <p>Alameda Araguaia 2044 | Conj. 910 - Bloco 1</p>
              <p>Alphaville, Barueri - SP | CEP 06455-000</p>
            </div>
          </div>

          {/* Segunda div - ~60% (3 colunas de 5) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Empresa */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className=" hover:underline">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Nossa Equipe
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Carreiras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Serviços */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Serviços</h3>
              <div className="space-y-3">
                {/* Terceirização */}
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left text-gray-600 hover:underline transition-colors"
                    onClick={() => {
                      const content = document.getElementById(
                        "light-terceirizacao-content"
                      );
                      const icon = document.getElementById(
                        "light-terceirizacao-icon"
                      );
                      if (content && icon) {
                        content.classList.toggle("hidden");
                        icon.classList.toggle("rotate-180");
                      }
                    }}
                  >
                    <span>Terceirização</span>
                    <svg
                      id="light-terceirizacao-icon"
                      className="w-4 h-4 transition-transform duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <ul
                    id="light-terceirizacao-content"
                    className="mt-2 ml-3 space-y-1 text-xs text-gray-500 hidden"
                  >
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Terceirização do Departamento Contábil
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Terceirização do Departamento Fiscal / Tributário
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Terceirização do Departamento Pessoal (DP)
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Terceirização do Departamento Paralegal / Legalização
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        BPO Financeiro com Inteligência e Precisão
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Consultoria & Assessoria */}
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left text-gray-600 hover:underline transition-colors"
                    onClick={() => {
                      const content = document.getElementById(
                        "light-consultoria-content"
                      );
                      const icon = document.getElementById(
                        "light-consultoria-icon"
                      );
                      if (content && icon) {
                        content.classList.toggle("hidden");
                        icon.classList.toggle("rotate-180");
                      }
                    }}
                  >
                    <span>Consultoria & Assessoria</span>
                    <svg
                      id="light-consultoria-icon"
                      className="w-4 h-4 transition-transform duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <ul
                    id="light-consultoria-content"
                    className="mt-2 ml-3 space-y-1 text-xs text-gray-500 hidden"
                  >
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Planejamento Tributário Inteligente
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Assessoria Tributária e Regularização Fiscal
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Consultoria Técnica com IA (Web + WhatsApp)
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Estruturação de Holdings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Cursos e Treinamentos para Equipes Contábeis
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Serviços Digitais */}
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left text-gray-600 hover:underline transition-colors"
                    onClick={() => {
                      const content = document.getElementById(
                        "light-digitais-content"
                      );
                      const icon = document.getElementById(
                        "light-digitais-icon"
                      );
                      if (content && icon) {
                        content.classList.toggle("hidden");
                        icon.classList.toggle("rotate-180");
                      }
                    }}
                  >
                    <span>Serviços Digitais</span>
                    <svg
                      id="light-digitais-icon"
                      className="w-4 h-4 transition-transform duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <ul
                    id="light-digitais-content"
                    className="mt-2 ml-3 space-y-1 text-xs text-gray-500 hidden"
                  >
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Certificados Digitais e-CPF e e-CNPJ
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Habilitação no RADAR da Receita Federal
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Registro de Marca no INPI
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Atendimento ao Cliente com IA (WhatsApp)
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Endereço Fiscal em Alphaville
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Recrutamento e Seleção com IA
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Marketing Digital para Escritórios Contábeis
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors"
                      >
                        Criação e Otimização de Sites Contábeis
                      </a>
                    </li>
                  </ul>
                </div>
                <a
                  href="#"
                  className="flex w-full text-left text-gray-600 hover:underline transition-colors"
                >
                  Downloads
                </a>
              </div>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:underline">
                    Fale conosco
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm sm:pr-8">
            © MULTI BPO DO BRASIL LTDA | CNPJ 46.505.712/0001-63 | Todos os
            direitos reservados • Powered by Drexys
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="https://wa.me/5511980883377?text=Olá! Gostaria de saber mais sobre os serviços da MultiBPO."
              className="text-gray-500 hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contato
            </Link>
            <Link
              to="/politica-de-privacidade"
              className="text-gray-500 hover:underline text-sm"
            >
              Política de Privacidade
            </Link>
            <Link
              to="/termos-de-uso"
              className="text-gray-500 hover:underline text-sm"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
