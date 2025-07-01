import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const PoliticaMobile = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Mobile Simples */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img
                src="/lovable-uploads/logo.png"
                alt="MULTI BPO"
                className="h-6 w-auto"
              />
            </Link>
            <Link 
              to="/m/cadastro"
              className="text-blue-600 text-sm font-medium"
            >
              Voltar
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-20">
        {/* Título Principal */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Política de Privacidade e Termos de Uso
          </h1>
          <p className="text-sm text-gray-600">
            Diretrizes para proteção de dados pessoais e termos de uso dos serviços da MULTI BPO DO BRASIL.
          </p>
        </div>

        {/* Informações da Empresa */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Última atualização:</strong> 02 de junho de 2025</p>
            <p><strong>Responsável:</strong> MULTI BPO DO BRASIL | CNPJ 46.505.712/0001-63</p>
            <p><strong>Site:</strong> <a href="https://www.multibpo.com.br" className="text-blue-600">multibpo.com.br</a></p>
            <p><strong>Contato:</strong> <a href="mailto:privacidade@multibpo.com.br" className="text-blue-600">privacidade@multibpo.com.br</a></p>
          </div>
        </div>

        {/* Política de Privacidade - Accordions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Política de Privacidade
          </h2>

          <div className="space-y-3">
            {/* 1. Compromisso */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('compromisso')}
                className="w-full px-4 py-3 text-left flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">1. Compromisso com a sua Privacidade</span>
                {expandedSection === 'compromisso' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSection === 'compromisso' && (
                <div className="px-4 pb-4 text-sm text-gray-700">
                  <p>A MULTI BPO DO BRASIL LTDA se compromete com a transparência, privacidade e segurança dos dados pessoais de seus usuários, clientes, parceiros, colaboradores, prestadores de serviços e visitantes. Esta Política explica como coletamos, usamos, compartilhamos e protegemos seus dados pessoais.</p>
                </div>
              )}
            </div>

            {/* 2. Dados Coletados */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('dados')}
                className="w-full px-4 py-3 text-left flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">2. Quais dados coletamos</span>
                {expandedSection === 'dados' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSection === 'dados' && (
                <div className="px-4 pb-4 text-sm text-gray-700 space-y-3">
                  <p><strong>a) Dados fornecidos diretamente:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Nome completo</li>
                    <li>E-mail</li>
                    <li>Número de telefone (incluindo WhatsApp)</li>
                    <li>Dados de voz, documentos e arquivos enviados</li>
                    <li>Informações de formulários de contato e cadastro</li>
                  </ul>
                  <p><strong>b) Dados coletados automaticamente:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Sistema operacional</li>
                    <li>Páginas acessadas e tempo de navegação</li>
                    <li>Cookies e identificadores de sessão</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 3. Finalidades */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('finalidades')}
                className="w-full px-4 py-3 text-left flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">3. Finalidades do tratamento</span>
                {expandedSection === 'finalidades' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSection === 'finalidades' && (
                <div className="px-4 pb-4 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Prestar atendimento via WhatsApp e canais digitais</li>
                    <li>Operar assistentes virtuais com inteligência artificial (IA)</li>
                    <li>Enviar comunicações sobre produtos, serviços e promoções</li>
                    <li>Analisar comportamento de navegação e melhorar a experiência</li>
                    <li>Cumprir obrigações legais, contratuais e regulatórias</li>
                    <li>Prevenir fraudes e garantir a segurança das operações</li>
                    <li>Execução dos serviços contratados, incluindo automações e IA</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 4. Seus Direitos */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('direitos')}
                className="w-full px-4 py-3 text-left flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">4. Seus direitos</span>
                {expandedSection === 'direitos' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSection === 'direitos' && (
                <div className="px-4 pb-4 text-sm text-gray-700">
                  <p className="mb-2">Você pode, a qualquer momento, solicitar:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Confirmação da existência de tratamento</li>
                    <li>Acesso aos dados pessoais</li>
                    <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                    <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                    <li>Portabilidade dos dados</li>
                    <li>Eliminação dos dados tratados com base no consentimento</li>
                    <li>Informação sobre o compartilhamento de dados</li>
                    <li>Revogação do consentimento</li>
                  </ul>
                  <p className="mt-3">
                    Solicitações: <a href="mailto:privacidade@multibpo.com.br" className="text-blue-600">privacidade@multibpo.com.br</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Termos de Uso - Accordions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Termos de Uso
          </h2>

          <div className="space-y-3">
            {/* 1. Objeto */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('objeto')}
                className="w-full px-4 py-3 text-left flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">1. Objeto e âmbito de aplicação</span>
                {expandedSection === 'objeto' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSection === 'objeto' && (
                <div className="px-4 pb-4 text-sm text-gray-700">
                  <p>A MULTI BPO disponibiliza soluções tecnológicas baseadas em inteligência artificial, automação de processos, assistentes virtuais, sistemas de atendimento e ferramentas de gestão. Os serviços podem incluir: plataformas online, APIs, sistemas integrados, totens de atendimento, cursos, consultorias e outras ferramentas digitais.</p>
                </div>
              )}
            </div>

            {/* 2. Licença de Uso */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('licenca')}
                className="w-full px-4 py-3 text-left flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">2. Licença de uso das soluções</span>
                {expandedSection === 'licenca' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSection === 'licenca' && (
                <div className="px-4 pb-4 text-sm text-gray-700">
                  <p className="mb-2">A MULTI BPO concede uma licença de uso pessoal, exclusiva, intransferível e revogável.</p>
                  <p className="mb-2"><strong>É vedado:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Copiar, modificar, distribuir ou realizar engenharia reversa</li>
                    <li>Utilizar para fins ilícitos, fraudulentos ou abusivos</li>
                    <li>Ceder ou sublicenciar os serviços a terceiros sem autorização</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 3. Limitação de Responsabilidade */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('limitacao')}
                className="w-full px-4 py-3 text-left flex items-center justify-between"
              >
                <span className="font-medium text-gray-900">3. Limitação de responsabilidade</span>
                {expandedSection === 'limitacao' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSection === 'limitacao' && (
                <div className="px-4 pb-4 text-sm text-gray-700">
                  <p className="mb-2">As soluções são disponibilizadas "tal como estão". A empresa não se responsabiliza por:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Problemas decorrentes de conexão com a internet</li>
                    <li>Decisões tomadas com base em informações geradas por IA</li>
                    <li>Falhas de terceiros integrados à solução</li>
                    <li>Eventuais erros, imprecisões ou respostas incoerentes da IA</li>
                    <li>Uso inadequado ou interpretação equivocada das informações</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conformidade */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-gray-900 mb-2">Conformidade</h3>
          <p className="text-sm text-gray-700">
            Esta Política está em conformidade com a Lei Geral de Proteção de Dados Pessoais – LGPD (Lei nº 13.709/2018), podendo ser adaptada também às diretrizes do GDPR, quando aplicável a usuários fora do Brasil.
          </p>
        </div>

        {/* Lei aplicável */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">Lei aplicável e foro</h3>
          <p className="text-sm text-gray-700">
            Este documento é regido pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de Barueri/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
          </p>
        </div>
      </main>

      {/* Footer Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3">
          <Link
            to="/m/cadastro"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-center transition-colors"
          >
            Aceitar e Continuar
          </Link>
          <Link
            to="/"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium text-center transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PoliticaMobile;