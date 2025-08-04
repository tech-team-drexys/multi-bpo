import Header from "@/components/Header";
import LightFooter from "@/components/Footer";
import { useState } from "react";

const Politica = () => {
  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Layout responsivo: flex para telas grandes, centralizado para telas menores */}
          <div className="min-[1480px]:flex min-[1480px]:gap-8">
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
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-blue-950 mb-3">
                          Política de Privacidade
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>
                            <a
                              href="#compromisso"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              1. Compromisso com a sua Privacidade
                            </a>
                          </li>
                          <li>
                            <a
                              href="#dados-coletamos"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              2. Quais dados coletamos
                            </a>
                          </li>
                          <li>
                            <a
                              href="#finalidades"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              3. Finalidades do tratamento
                            </a>
                          </li>
                          <li>
                            <a
                              href="#base-legal"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              4. Base legal para tratamento
                            </a>
                          </li>
                          <li>
                            <a
                              href="#compartilhamento"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              5. Compartilhamento com terceiros
                            </a>
                          </li>
                          <li>
                            <a
                              href="#transferencia"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              6. Transferência internacional
                            </a>
                          </li>
                          <li>
                            <a
                              href="#cookies"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              7. Uso de cookies
                            </a>
                          </li>
                          <li>
                            <a
                              href="#retencao"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              8. Retenção e descarte
                            </a>
                          </li>
                          <li>
                            <a
                              href="#seguranca"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              9. Segurança das informações
                            </a>
                          </li>
                          <li>
                            <a
                              href="#direitos"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              10. Seus direitos
                            </a>
                          </li>
                          <li>
                            <a
                              href="#atualizacoes"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              11. Atualizações desta Política
                            </a>
                          </li>
                          <li>
                            <a
                              href="#canal-atendimento"
                              className="hover:text-blue-600 transition-colors"
                              onClick={() => setIsTocOpen(false)}
                            >
                              12. Canal de Atendimento
                            </a>
                          </li>
                        </ul>
                      </div>
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
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                Política de Privacidade e Termos de Uso
              </h1>

              <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                Este documento estabelece as diretrizes para proteção de dados
                pessoais e os termos de uso dos serviços oferecidos pela MULTI
                BPO DO BRASIL.
              </p>

              {/* Política de Privacidade */}
              <div className="mt-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Política de Privacidade
                  </h2>

                  <div className="bg-gray-100 p-8 rounded-lg">
                    <div className="text-lg text-gray-700 space-y-2 text-left">
                      <p>
                        <strong>Última atualização:</strong> 02 de junho de 2025
                      </p>
                      <p>
                        <strong>Responsável pelo tratamento dos dados:</strong>{" "}
                        MULTI BPO DO BRASIL | CNPJ 46.505.712/0001-63
                      </p>
                      <p>
                        <strong>Endereço eletrônico:</strong>{" "}
                        <a
                          href="https://www.multibpo.com.br"
                          className="text-blue-600 hover:underline"
                        >
                          https://www.multibpo.com.br
                        </a>
                      </p>
                      <p>
                        <strong>E-mail para contato:</strong>{" "}
                        <a
                          href="mailto:privacidade@multibpo.com.br"
                          className="text-blue-600 hover:underline"
                        >
                          privacidade@multibpo.com.br
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <section className="mb-8" id="compromisso">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      1. Compromisso com a sua Privacidade
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      A MULTI BPO DO BRASIL LTDA se compromete com a
                      transparência, privacidade e segurança dos dados pessoais
                      de seus usuários, clientes, parceiros, colaboradores,
                      prestadores de serviços e visitantes. Esta Política
                      explica como coletamos, usamos, compartilhamos e
                      protegemos seus dados pessoais.
                    </p>
                  </section>

                  <section className="mb-8" id="dados-coletamos">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      2. Quais dados coletamos
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Coletamos os seguintes tipos de dados, conforme o uso dos
                      nossos sites, sistemas e serviços:
                    </p>
                    <div className="ml-4 space-y-4">
                      <div>
                        <p className="text-gray-700 font-medium mb-2">
                          a) Dados fornecidos diretamente pelo usuário:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          <li>Nome completo</li>
                          <li>E-mail</li>
                          <li>Número de telefone (incluindo WhatsApp)</li>
                          <li>
                            Dados de voz, documentos e arquivos enviados em
                            anexo e para atendimento
                          </li>
                          <li>
                            Informações fornecidas em formulários de contato,
                            contratação ou cadastro
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium mb-2">
                          b) Dados coletados automaticamente:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          <li>Endereço IP</li>
                          <li>Tipo de navegador e dispositivo</li>
                          <li>Sistema operacional</li>
                          <li>
                            Páginas acessadas, tempo de navegação e cliques
                          </li>
                          <li>Cookies e identificadores de sessão</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section className="mb-8" id="finalidades">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      3. Finalidades do tratamento dos dados
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Utilizamos os dados pessoais coletados para as seguintes
                      finalidades:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>
                        Prestar atendimento via WhatsApp e canais digitais
                      </li>
                      <li>
                        Operar assistentes virtuais com inteligência artificial
                        (IA)
                      </li>
                      <li>
                        Enviar comunicações sobre produtos, serviços,
                        atualizações e promoções
                      </li>
                      <li>
                        Analisar comportamento de navegação e melhorar a
                        experiência do usuário
                      </li>
                      <li>
                        Cumprir obrigações legais, contratuais e regulatórias
                      </li>
                      <li>
                        Prevenir fraudes e garantir a segurança das operações
                      </li>
                      <li>
                        Execução dos serviços contratados, incluindo automações,
                        integrações com IA e atendimento virtual
                      </li>
                    </ul>
                  </section>

                  <section className="mb-8" id="base-legal">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      4. Base legal para tratamento
                    </h3>
                    <p className="text-gray-700 mb-4">
                      O tratamento dos dados pessoais é fundamentado nas
                      seguintes bases legais:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>
                        Execução de contrato ou de procedimentos preliminares
                      </li>
                      <li>Consentimento do titular</li>
                      <li>Cumprimento de obrigação legal ou regulatória</li>
                      <li>
                        Interesse legítimo da MULTI BPO DO BRASIL LTDA, desde
                        que não infrinja direitos e liberdades fundamentais do
                        titular
                      </li>
                    </ul>
                  </section>

                  <section className="mb-8" id="compartilhamento">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      5. Compartilhamento de dados com terceiros
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Poderemos compartilhar seus dados com terceiros nas
                      seguintes hipóteses:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>
                        Prestadores de serviço e parceiros tecnológicos, como
                        Meta (WhatsApp), OpenAI, provedores de hospedagem e
                        bancos de dados
                      </li>
                      <li>
                        Plataformas de pagamento e automação, como Stripe,
                        Mercado Pago, VINDI, Pag Bank, entre outros
                      </li>
                      <li>
                        Autoridades governamentais, quando necessário para
                        cumprimento de obrigações legais
                      </li>
                      <li>
                        Empresas do mesmo grupo econômico, para fins
                        administrativos ou operacionais
                      </li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                      Todos os terceiros estão contratualmente obrigados a
                      garantir a confidencialidade e segurança dos dados.
                    </p>
                  </section>

                  <section className="mb-8" id="transferencia">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      6. Transferência internacional de dados
                    </h3>
                    <p className="text-gray-700">
                      Alguns dados poderão ser transferidos e armazenados fora
                      do Brasil, em países que possuem legislação de proteção de
                      dados equivalente à LGPD, como os Estados Unidos.
                      Garantimos que essas transferências seguem cláusulas
                      contratuais padrão e mecanismos de segurança adequados.
                    </p>
                  </section>

                  <section className="mb-8" id="cookies">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      7. Uso de cookies e tecnologias similares
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Utilizamos cookies para:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Garantir o funcionamento adequado do site</li>
                      <li>Lembrar preferências do usuário</li>
                      <li>Coletar estatísticas de uso e desempenho</li>
                      <li>Personalizar conteúdo e anúncios</li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                      Você pode gerenciar os cookies nas configurações do seu
                      navegador.
                    </p>
                  </section>

                  <section className="mb-8" id="retencao">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      8. Retenção e descarte de dados
                    </h3>
                    <p className="text-gray-700">
                      Seus dados são armazenados pelo tempo necessário para
                      cumprir as finalidades para as quais foram coletados ou
                      conforme exigido por lei. Após esse período, os dados são
                      eliminados com segurança ou anonimizados.
                    </p>
                  </section>

                  <section className="mb-8" id="seguranca">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      9. Segurança das informações
                    </h3>
                    <p className="text-gray-700">
                      Adotamos medidas técnicas e administrativas apropriadas
                      para proteger seus dados contra acessos não autorizados,
                      destruição, perda, alteração, comunicação ou qualquer
                      forma de tratamento inadequado.
                    </p>
                  </section>

                  <section className="mb-8" id="direitos">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      10. Seus direitos como titular dos dados
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Você pode, a qualquer momento, solicitar:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Confirmação da existência de tratamento</li>
                      <li>Acesso aos dados pessoais</li>
                      <li>
                        Correção de dados incompletos, inexatos ou
                        desatualizados
                      </li>
                      <li>
                        Anonimização, bloqueio ou eliminação de dados
                        desnecessários
                      </li>
                      <li>Portabilidade dos dados</li>
                      <li>
                        Eliminação dos dados tratados com base no consentimento
                      </li>
                      <li>Informação sobre o compartilhamento de dados</li>
                      <li>Revogação do consentimento</li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                      As solicitações devem ser feitas por e-mail para{" "}
                      <a
                        href="mailto:privacidade@multibpo.com.br"
                        className="text-blue-600 hover:underline"
                      >
                        privacidade@multibpo.com.br
                      </a>
                      .
                    </p>
                  </section>

                  <section className="mb-8" id="atualizacoes">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      11. Atualizações desta Política
                    </h3>
                    <p className="text-gray-700">
                      Esta Política poderá ser atualizada a qualquer momento.
                      Recomendamos consulta regular. Alterações significativas
                      serão comunicadas via e-mail ou em destaque no site.
                    </p>
                  </section>

                  <section className="mb-8" id="canal-atendimento">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      12. Canal de Atendimento
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Se você tiver dúvidas, reclamações ou quiser exercer algum
                      direito, entre em contato conosco:
                    </p>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <p className="text-gray-700">
                        <strong>E-mail:</strong>{" "}
                        <a
                          href="mailto:privacidade@multibpo.com.br"
                          className="text-blue-600 hover:underline"
                        >
                          privacidade@multibpo.com.br
                        </a>
                        <br />
                        <strong>Website:</strong>{" "}
                        <a
                          href="https://www.multibpo.com.br"
                          className="text-blue-600 hover:underline"
                        >
                          https://www.multibpo.com.br
                        </a>
                      </p>
                    </div>
                  </section>

                  <section className="bg-gray-100 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      Conformidade
                    </h3>
                    <p className="text-gray-700">
                      Esta Política está em conformidade com a Lei Geral de
                      Proteção de Dados Pessoais – LGPD (Lei nº 13.709/2018),
                      podendo ser adaptada também às diretrizes do GDPR, quando
                      aplicável a usuários fora do Brasil.
                    </p>
                  </section>
                </div>
              </div>

              {/* Termos de uso */}
              <div className="mt-24">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Termos de Uso
                  </h2>

                  <div className="bg-gray-100 p-8 rounded-lg">
                    <div className="text-lg text-gray-700 space-y-2 text-left">
                      <h3 className="text-xl font-semibold text-blue-950 mb-4">
                        TERMOS DE USO – MULTI BPO DO BRASIL LTDA
                      </h3>
                      <p>
                        Estes Termos de Uso regulam o acesso e a utilização das
                        soluções tecnológicas e dos serviços disponibilizados
                        pela MULTI BPO DO BRASIL, inscrita no CNPJ sob o nº
                        46.505.712/0001-63, com sede na Alameda Araguaia, n°
                        2044, Conjunto 910, Bloco 1, bairro Alphaville, cidade
                        de Barueri, estado de São Paulo, CEP 06455-000 e
                        devidamente registrada no CRC/SP sob o n° 2SP045316,
                        doravante denominada apenas "MULTI BPO".
                      </p>
                      <p className="mt-4">
                        Ao acessar ou utilizar qualquer serviço da MULTI BPO, o
                        usuário concorda integralmente com estes Termos. Caso
                        não concorde, não utilize os serviços.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <section className="mb-8" id="objeto">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      1. OBJETO E ÂMBITO DE APLICAÇÃO
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      A MULTI BPO disponibiliza soluções tecnológicas baseadas
                      em inteligência artificial, automação de processos,
                      assistentes virtuais, sistemas de atendimento e
                      ferramentas de gestão. Os serviços podem incluir:
                      plataformas online, APIs, sistemas integrados, totens de
                      atendimento, cursos, consultorias e outras ferramentas
                      digitais.
                    </p>
                  </section>

                  <section className="mb-8" id="cadastro">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      2. CADASTRO E CONTA DO USUÁRIO
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Para utilizar determinadas funcionalidades, o usuário
                      deverá realizar cadastro, fornecendo dados verídicos e
                      atualizados. O usuário é responsável pela guarda das
                      credenciais de acesso e por todas as atividades realizadas
                      sob sua conta.
                    </p>
                  </section>

                  <section className="mb-8" id="licenca">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      3. LICENÇA DE USO DAS SOLUÇÕES
                    </h3>
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
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      4. CONTEÚDO GERADO POR USUÁRIOS
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      O usuário é integralmente responsável pelo conteúdo
                      inserido, transmitido ou gerado por meio das soluções da
                      MULTI BPO. A empresa não se responsabiliza por opiniões,
                      dados ou arquivos inseridos por terceiros.
                    </p>
                  </section>

                  <section className="mb-8" id="pagamento">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      5. PAGAMENTO E PLANOS
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Algumas funcionalidades são oferecidas mediante pagamento.
                      Os valores, formas de pagamento, periodicidade e condições
                      de cancelamento estarão descritos em contrato específico
                      ou na própria plataforma.
                    </p>
                    <p className="text-gray-700">
                      A inadimplência poderá ensejar a suspensão ou o
                      cancelamento dos serviços.
                    </p>
                  </section>

                  <section className="mb-8" id="propriedade">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      6. PROPRIEDADE INTELECTUAL
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Todos os direitos sobre as soluções, marcas, sistemas,
                      softwares, bases de dados, design e demais elementos da
                      MULTI BPO são protegidos por lei e pertencem
                      exclusivamente à empresa, salvo quando expressamente
                      informado em sentido contrário.
                    </p>
                  </section>

                  <section className="mb-8" id="limitacao">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      7. LIMITAÇÃO DE RESPONSABILIDADE
                    </h3>
                    <p className="text-gray-700 mb-4">
                      As soluções da MULTI BPO são disponibilizadas "tal como
                      estão", podendo passar por melhorias, ajustes e
                      interrupções temporárias. A empresa não garante
                      disponibilidade ininterrupta, tampouco se responsabiliza
                      por:
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
                        Uso inadequado ou interpretação equivocada das
                        informações fornecidas pelos assistentes virtuais
                      </li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                      O usuário reconhece que as tecnologias utilizadas pela
                      MULTI BPO podem estar em aprimoramento contínuo, e
                      compreende a natureza experimental de soluções baseadas em
                      inteligência artificial.
                    </p>
                  </section>

                  <section className="mb-8" id="protecao-dados">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      8. PRIVACIDADE E PROTEÇÃO DE DADOS
                    </h3>
                    <p className="text-gray-700 mb-4">
                      O tratamento de dados pessoais é realizado conforme a{" "}
                      <a
                        href="/privacy-policy"
                        className="text-blue-600 hover:underline"
                      >
                        Política de Privacidade
                      </a>{" "}
                      da MULTI BPO. O uso dos serviços implica concordância com
                      as disposições ali previstas.
                    </p>
                    <p className="text-gray-700">
                      As interações com assistentes virtuais e serviços baseados
                      em IA poderão ser armazenadas para fins de suporte,
                      melhoria contínua e auditoria de funcionamento.
                    </p>
                  </section>

                  <section className="mb-8" id="cancelamento">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      9. CANCELAMENTO E ENCERRAMENTO DE CONTA
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      O usuário pode solicitar o cancelamento da conta a
                      qualquer momento. A MULTI BPO também poderá encerrar ou
                      suspender o acesso em casos de violação dos Termos,
                      conduta abusiva ou uso indevido das soluções.
                    </p>
                  </section>

                  <section className="mb-8" id="alteracoes-termos">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      10. ALTERAÇÕES DOS TERMOS
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      A MULTI BPO reserva-se o direito de alterar estes Termos a
                      qualquer tempo. Alterações significativas serão
                      comunicadas aos usuários por e-mail ou através de
                      notificações nas plataformas. O uso continuado dos
                      serviços após tais alterações será interpretado como
                      aceite tácito das novas condições.
                    </p>
                  </section>

                  <section className="mb-8" id="suporte">
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      11. SUPORTE E CONTATO
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Em caso de dúvidas ou solicitações relativas aos serviços
                      ou aos presentes Termos, o usuário poderá entrar em
                      contato pelo e-mail:{" "}
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
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      12. DISPOSIÇÕES GERAIS
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>
                        A tolerância a eventuais infrações não constitui
                        renúncia de direito
                      </li>
                      <li>
                        Estes Termos podem ser atualizados a qualquer tempo,
                        sendo recomendada revisão periódica
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
                    <h3 className="text-xl font-semibold text-blue-950 mb-4">
                      13. LEI APLICÁVEL E FORO
                    </h3>
                    <p className="text-gray-700">
                      Este documento é regido pelas leis da República Federativa
                      do Brasil. Fica eleito o foro da Comarca de Barueri/SP,
                      com renúncia expressa a qualquer outro, por mais
                      privilegiado que seja.
                    </p>
                  </section>
                </div>
              </div>
            </div>

            {/* Table of Contents - Sidebar for large screens */}
            <div className="relative min-[1480px]:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-blue-950 mb-4">
                    Nesta Página
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-blue-950 mb-3">
                        Política de Privacidade
                      </h3>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li>
                          <a
                            href="#compromisso"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            1. Compromisso com a sua Privacidade
                          </a>
                        </li>
                        <li>
                          <a
                            href="#dados-coletamos"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            2. Quais dados coletamos
                          </a>
                        </li>
                        <li>
                          <a
                            href="#finalidades"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            3. Finalidades do tratamento
                          </a>
                        </li>
                        <li>
                          <a
                            href="#base-legal"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            4. Base legal para tratamento
                          </a>
                        </li>
                        <li>
                          <a
                            href="#compartilhamento"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            5. Compartilhamento com terceiros
                          </a>
                        </li>
                        <li>
                          <a
                            href="#transferencia"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            6. Transferência internacional
                          </a>
                        </li>
                        <li>
                          <a
                            href="#cookies"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            7. Uso de cookies
                          </a>
                        </li>
                        <li>
                          <a
                            href="#retencao"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            8. Retenção e descarte
                          </a>
                        </li>
                        <li>
                          <a
                            href="#seguranca"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            9. Segurança das informações
                          </a>
                        </li>
                        <li>
                          <a
                            href="#direitos"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            10. Seus direitos
                          </a>
                        </li>
                        <li>
                          <a
                            href="#atualizacoes"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            11. Atualizações desta Política
                          </a>
                        </li>
                        <li>
                          <a
                            href="#canal-atendimento"
                            className="hover:text-blue-600 transition-colors block py-1"
                          >
                            12. Canal de Atendimento
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="border-t pt-4">
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
        </div>
      </main>

      <LightFooter />
    </div>
  );
};

export default Politica;
