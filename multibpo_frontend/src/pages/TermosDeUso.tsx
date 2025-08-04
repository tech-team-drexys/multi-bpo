import Header from "@/components/Header";
import LightFooter from "@/components/Footer";
import { useState } from "react";

const TermsOfUse = () => {
  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Layout responsivo: flex para telas grandes, centralizado para telas menores */}
          <div className="min-[1480px]:flex min-[1480px]:gap-16">
            {/* Conteúdo principal */}
            <div className="min-[1480px]:flex-1 min-[1480px]:max-w-4xl max-[1479px]:max-w-4xl max-[1479px]:mx-auto">
              {/* Collapsible ToC for smaller screens */}
              <div className="block min-[1480px]:hidden mb-8">
                <button
                  onClick={() => setIsTocOpen(!isTocOpen)}
                  className="w-full hover:bg-gray-50 transition-colors rounded-lg p-4 text-left border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-blue-950">
                      Nesta Página
                    </h2>
                    <svg
                      className={`w-5 h-5 text-blue-950 transform transition-transform ${
                        isTocOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {isTocOpen && (
                  <div className="mt-4 bg-white border border-gray-200 rounded-lg p-6">
                    <div>
                      <h3 className="text-sm font-medium text-blue-950 mb-3">
                        Termos de Uso
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                          <a
                            href="#objeto"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            1. Objeto e âmbito de aplicação
                          </a>
                        </li>
                        <li>
                          <a
                            href="#cadastro"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            2. Cadastro e conta do usuário
                          </a>
                        </li>
                        <li>
                          <a
                            href="#licenca"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            3. Licença de uso das soluções
                          </a>
                        </li>
                        <li>
                          <a
                            href="#conteudo-usuarios"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            4. Conteúdo gerado por usuários
                          </a>
                        </li>
                        <li>
                          <a
                            href="#pagamento"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            5. Pagamento e planos
                          </a>
                        </li>
                        <li>
                          <a
                            href="#propriedade"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            6. Propriedade intelectual
                          </a>
                        </li>
                        <li>
                          <a
                            href="#limitacao"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            7. Limitação de responsabilidade
                          </a>
                        </li>
                        <li>
                          <a
                            href="#protecao-dados"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            8. Privacidade e proteção de dados
                          </a>
                        </li>
                        <li>
                          <a
                            href="#cancelamento"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            9. Cancelamento e encerramento
                          </a>
                        </li>
                        <li>
                          <a
                            href="#alteracoes-termos"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            10. Alterações dos Termos
                          </a>
                        </li>
                        <li>
                          <a
                            href="#suporte"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            11. Suporte e contato
                          </a>
                        </li>
                        <li>
                          <a
                            href="#disposicoes"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            12. Disposições gerais
                          </a>
                        </li>
                        <li>
                          <a
                            href="#lei-aplicavel"
                            className="hover:text-blue-600 transition-colors"
                            onClick={() => setIsTocOpen(false)}
                          >
                            13. Lei aplicável e foro
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                  Termos de Uso
                </h1>

                <div className="bg-gray-100 p-8 rounded-lg">
                  <div className="text-lg text-gray-700 space-y-2 text-left">
                    <h2 className="text-xl font-semibold text-blue-950 mb-4">
                      TERMOS DE USO – MULTI BPO DO BRASIL LTDA
                    </h2>
                    <p>
                      Estes Termos de Uso regulam o acesso e a utilização das
                      soluções tecnológicas e dos serviços disponibilizados pela
                      MULTI BPO DO BRASIL, inscrita no CNPJ sob o nº
                      46.505.712/0001-63, com sede na Alameda Araguaia, n° 2044,
                      Conjunto 910, Bloco 1, bairro Alphaville, cidade de
                      Barueri, estado de São Paulo, CEP 06455-000 e devidamente
                      registrada no CRC/SP sob o n° 2SP045316, doravante
                      denominada apenas "MULTI BPO".
                    </p>
                    <p className="mt-4">
                      Ao acessar ou utilizar qualquer serviço da MULTI BPO, o
                      usuário concorda integralmente com estes Termos. Caso não
                      concorde, não utilize os serviços.
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <section className="mb-8" id="objeto">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    1. OBJETO E ÂMBITO DE APLICAÇÃO
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    A MULTI BPO disponibiliza soluções tecnológicas baseadas em
                    inteligência artificial, automação de processos, assistentes
                    virtuais, sistemas de atendimento e ferramentas de gestão.
                    Os serviços podem incluir: plataformas online, APIs,
                    sistemas integrados, totens de atendimento, cursos,
                    consultorias e outras ferramentas digitais.
                  </p>
                </section>

                <section className="mb-8" id="cadastro">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    2. CADASTRO E CONTA DO USUÁRIO
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Para utilizar determinadas funcionalidades, o usuário deverá
                    realizar cadastro, fornecendo dados verídicos e atualizados.
                    O usuário é responsável pela guarda das credenciais de
                    acesso e por todas as atividades realizadas sob sua conta.
                  </p>
                </section>

                <section className="mb-8" id="licenca">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    3. LICENÇA DE USO DAS SOLUÇÕES
                  </h2>
                  <p className="text-gray-700 mb-4">
                    A MULTI BPO concede ao usuário uma licença de uso pessoal,
                    exclusiva, intransferível e revogável, para utilizar suas
                    soluções conforme previsto nestes Termos.
                  </p>
                  <p className="text-gray-700 mb-4 font-medium">É vedado:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>
                      Copiar, modificar, distribuir ou realizar engenharia
                      reversa dos sistemas
                    </li>
                    <li>
                      Utilizar as soluções para fins ilícitos, fraudulentos ou
                      abusivos
                    </li>
                    <li>
                      Ceder ou sublicenciar os serviços a terceiros sem
                      autorização expressa
                    </li>
                  </ul>
                </section>

                <section className="mb-8" id="conteudo-usuarios">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    4. CONTEÚDO GERADO POR USUÁRIOS
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    O usuário é integralmente responsável pelo conteúdo
                    inserido, transmitido ou gerado por meio das soluções da
                    MULTI BPO. A empresa não se responsabiliza por opiniões,
                    dados ou arquivos inseridos por terceiros.
                  </p>
                </section>

                <section className="mb-8" id="pagamento">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    5. PAGAMENTO E PLANOS
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Algumas funcionalidades são oferecidas mediante pagamento.
                    Os valores, formas de pagamento, periodicidade e condições
                    de cancelamento estarão descritos em contrato específico ou
                    na própria plataforma.
                  </p>
                  <p className="text-gray-700">
                    A inadimplência poderá ensejar a suspensão ou o cancelamento
                    dos serviços.
                  </p>
                </section>

                <section className="mb-8" id="propriedade">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    6. PROPRIEDADE INTELECTUAL
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Todos os direitos sobre as soluções, marcas, sistemas,
                    softwares, bases de dados, design e demais elementos da
                    MULTI BPO são protegidos por lei e pertencem exclusivamente
                    à empresa, salvo quando expressamente informado em sentido
                    contrário.
                  </p>
                </section>

                <section className="mb-8" id="limitacao">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    7. LIMITAÇÃO DE RESPONSABILIDADE
                  </h2>
                  <p className="text-gray-700 mb-4">
                    As soluções da MULTI BPO são disponibilizadas "tal como
                    estão", podendo passar por melhorias, ajustes e interrupções
                    temporárias. A empresa não garante disponibilidade
                    ininterrupta, tampouco se responsabiliza por:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Problemas decorrentes de conexão com a internet</li>
                    <li>
                      Decisões tomadas com base em informações geradas por
                      inteligência artificial
                    </li>
                    <li>
                      Falhas de terceiros integrados à solução (como APIs ou
                      sistemas externos)
                    </li>
                    <li>
                      Eventuais erros, imprecisões, alucinações ou respostas
                      incoerentes geradas por sistemas baseados em IA
                    </li>
                    <li>
                      Uso inadequado ou interpretação equivocada das informações
                      fornecidas pelos assistentes virtuais
                    </li>
                  </ul>
                  <p className="text-gray-700 mt-4">
                    O usuário reconhece que as tecnologias utilizadas pela MULTI
                    BPO podem estar em aprimoramento contínuo, e compreende a
                    natureza experimental de soluções baseadas em inteligência
                    artificial.
                  </p>
                </section>

                <section className="mb-8" id="protecao-dados">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    8. PRIVACIDADE E PROTEÇÃO DE DADOS
                  </h2>
                  <p className="text-gray-700 mb-4">
                    O tratamento de dados pessoais é realizado conforme a{" "}
                    <a
                      href="/privacy-policy"
                      className="text-blue-600 hover:underline"
                    >
                      Política de Privacidade
                    </a>{" "}
                    da MULTI BPO. O uso dos serviços implica concordância com as
                    disposições ali previstas.
                  </p>
                  <p className="text-gray-700">
                    As interações com assistentes virtuais e serviços baseados
                    em IA poderão ser armazenadas para fins de suporte, melhoria
                    contínua e auditoria de funcionamento.
                  </p>
                </section>

                <section className="mb-8" id="cancelamento">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    9. CANCELAMENTO E ENCERRAMENTO DE CONTA
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    O usuário pode solicitar o cancelamento da conta a qualquer
                    momento. A MULTI BPO também poderá encerrar ou suspender o
                    acesso em casos de violação dos Termos, conduta abusiva ou
                    uso indevido das soluções.
                  </p>
                </section>

                <section className="mb-8" id="alteracoes-termos">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    10. ALTERAÇÕES DOS TERMOS
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    A MULTI BPO reserva-se o direito de alterar estes Termos a
                    qualquer tempo. Alterações significativas serão comunicadas
                    aos usuários por e-mail ou através de notificações nas
                    plataformas. O uso continuado dos serviços após tais
                    alterações será interpretado como aceite tácito das novas
                    condições.
                  </p>
                </section>

                <section className="mb-8" id="suporte">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    11. SUPORTE E CONTATO
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Em caso de dúvidas ou solicitações relativas aos serviços ou
                    aos presentes Termos, o usuário poderá entrar em contato
                    pelo e-mail:{" "}
                    <a
                      href="mailto:contato@multibpo.com.br"
                      className="text-blue-600 hover:underline"
                    >
                      contato@multibpo.com.br
                    </a>{" "}
                    ou por outros canais oficiais divulgados pela empresa.
                  </p>
                </section>

                <section className="mb-8" id="disposicoes">
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    12. DISPOSIÇÕES GERAIS
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>
                      A tolerância a eventuais infrações não constitui renúncia
                      de direito
                    </li>
                    <li>
                      Estes Termos podem ser atualizados a qualquer tempo, sendo
                      recomendada revisão periódica
                    </li>
                    <li>
                      O uso continuado dos serviços após alterações implica
                      aceitação
                    </li>
                  </ul>
                </section>

                <section
                  className="bg-gray-100 p-8 rounded-lg"
                  id="lei-aplicavel"
                >
                  <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                    13. LEI APLICÁVEL E FORO
                  </h2>
                  <p className="text-gray-700">
                    Este documento é regido pelas leis da República Federativa
                    do Brasil. Fica eleito o foro da Comarca de Barueri/SP, com
                    renúncia expressa a qualquer outro, por mais privilegiado
                    que seja.
                  </p>
                </section>
              </div>
            </div>

            {/* Table of Contents - Sidebar for large screens */}
            <div className="hidden min-[1480px]:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-blue-950 mb-4">
                    Nesta Página
                  </h2>
                  <div>
                    <h3 className="text-sm font-medium text-blue-950 mb-3">
                      Termos de Uso
                    </h3>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li>
                        <a
                          href="#objeto"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          1. Objeto e âmbito de aplicação
                        </a>
                      </li>
                      <li>
                        <a
                          href="#cadastro"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          2. Cadastro e conta do usuário
                        </a>
                      </li>
                      <li>
                        <a
                          href="#licenca"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          3. Licença de uso das soluções
                        </a>
                      </li>
                      <li>
                        <a
                          href="#conteudo-usuarios"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          4. Conteúdo gerado por usuários
                        </a>
                      </li>
                      <li>
                        <a
                          href="#pagamento"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          5. Pagamento e planos
                        </a>
                      </li>
                      <li>
                        <a
                          href="#propriedade"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          6. Propriedade intelectual
                        </a>
                      </li>
                      <li>
                        <a
                          href="#limitacao"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          7. Limitação de responsabilidade
                        </a>
                      </li>
                      <li>
                        <a
                          href="#protecao-dados"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          8. Privacidade e proteção de dados
                        </a>
                      </li>
                      <li>
                        <a
                          href="#cancelamento"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          9. Cancelamento e encerramento
                        </a>
                      </li>
                      <li>
                        <a
                          href="#alteracoes-termos"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          10. Alterações dos Termos
                        </a>
                      </li>
                      <li>
                        <a
                          href="#suporte"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          11. Suporte e contato
                        </a>
                      </li>
                      <li>
                        <a
                          href="#disposicoes"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          12. Disposições gerais
                        </a>
                      </li>
                      <li>
                        <a
                          href="#lei-aplicavel"
                          className="hover:text-blue-600 transition-colors block py-1"
                        >
                          13. Lei aplicável e foro
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LightFooter />
    </div>
  );
};

export default TermsOfUse;
