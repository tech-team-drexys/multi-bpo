
import Header from '@/components/Header';
import LightFooter from '@/components/LightFooter';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Política de Privacidade
            </h1>
            
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="text-lg text-gray-700 space-y-2 text-left">
                <p><strong>Última atualização:</strong> 02 de junho de 2025</p>
                <p><strong>Responsável pelo tratamento dos dados:</strong> MULTI BPO DO BRASIL | CNPJ 46.505.712/0001-63</p>
                <p><strong>Endereço eletrônico:</strong> <a href="https://www.multibpo.com.br" className="text-blue-600 hover:underline">https://www.multibpo.com.br</a></p>
                <p><strong>E-mail para contato:</strong> <a href="mailto:privacidade@multibpo.com.br" className="text-blue-600 hover:underline">privacidade@multibpo.com.br</a></p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                1. Compromisso com a sua Privacidade
              </h2>
              <p className="text-gray-700 leading-relaxed">
                A MULTI BPO DO BRASIL LTDA se compromete com a transparência, privacidade e segurança dos dados pessoais de seus usuários, clientes, parceiros, colaboradores, prestadores de serviços e visitantes. Esta Política explica como coletamos, usamos, compartilhamos e protegemos seus dados pessoais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                2. Quais dados coletamos
              </h2>
              <p className="text-gray-700 mb-4">
                Coletamos os seguintes tipos de dados, conforme o uso dos nossos sites, sistemas e serviços:
              </p>
              <div className="ml-4 space-y-4">
                <div>
                  <p className="text-gray-700 font-medium mb-2">a) Dados fornecidos diretamente pelo usuário:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Nome completo</li>
                    <li>E-mail</li>
                    <li>Número de telefone (incluindo WhatsApp)</li>
                    <li>Dados de voz, documentos e arquivos enviados em anexo e para atendimento</li>
                    <li>Informações fornecidas em formulários de contato, contratação ou cadastro</li>
                  </ul>
                </div>
                <div>
                  <p className="text-gray-700 font-medium mb-2">b) Dados coletados automaticamente:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Sistema operacional</li>
                    <li>Páginas acessadas, tempo de navegação e cliques</li>
                    <li>Cookies e identificadores de sessão</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                3. Finalidades do tratamento dos dados
              </h2>
              <p className="text-gray-700 mb-4">
                Utilizamos os dados pessoais coletados para as seguintes finalidades:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Prestar atendimento via WhatsApp e canais digitais</li>
                <li>Operar assistentes virtuais com inteligência artificial (IA)</li>
                <li>Enviar comunicações sobre produtos, serviços, atualizações e promoções</li>
                <li>Analisar comportamento de navegação e melhorar a experiência do usuário</li>
                <li>Cumprir obrigações legais, contratuais e regulatórias</li>
                <li>Prevenir fraudes e garantir a segurança das operações</li>
                <li>Execução dos serviços contratados, incluindo automações, integrações com IA e atendimento virtual</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                4. Base legal para tratamento
              </h2>
              <p className="text-gray-700 mb-4">
                O tratamento dos dados pessoais é fundamentado nas seguintes bases legais:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Execução de contrato ou de procedimentos preliminares</li>
                <li>Consentimento do titular</li>
                <li>Cumprimento de obrigação legal ou regulatória</li>
                <li>Interesse legítimo da MULTI BPO DO BRASIL LTDA, desde que não infrinja direitos e liberdades fundamentais do titular</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                5. Compartilhamento de dados com terceiros
              </h2>
              <p className="text-gray-700 mb-4">
                Poderemos compartilhar seus dados com terceiros nas seguintes hipóteses:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Prestadores de serviço e parceiros tecnológicos, como Meta (WhatsApp), OpenAI, provedores de hospedagem e bancos de dados</li>
                <li>Plataformas de pagamento e automação, como Stripe, Mercado Pago, VINDI, Pag Bank, entre outros</li>
                <li>Autoridades governamentais, quando necessário para cumprimento de obrigações legais</li>
                <li>Empresas do mesmo grupo econômico, para fins administrativos ou operacionais</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Todos os terceiros estão contratualmente obrigados a garantir a confidencialidade e segurança dos dados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                6. Transferência internacional de dados
              </h2>
              <p className="text-gray-700">
                Alguns dados poderão ser transferidos e armazenados fora do Brasil, em países que possuem legislação de proteção de dados equivalente à LGPD, como os Estados Unidos. Garantimos que essas transferências seguem cláusulas contratuais padrão e mecanismos de segurança adequados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                7. Uso de cookies e tecnologias similares
              </h2>
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
                Você pode gerenciar os cookies nas configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                8. Retenção e descarte de dados
              </h2>
              <p className="text-gray-700">
                Seus dados são armazenados pelo tempo necessário para cumprir as finalidades para as quais foram coletados ou conforme exigido por lei. Após esse período, os dados são eliminados com segurança ou anonimizados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                9. Segurança das informações
              </h2>
              <p className="text-gray-700">
                Adotamos medidas técnicas e administrativas apropriadas para proteger seus dados contra acessos não autorizados, destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                10. Seus direitos como titular dos dados
              </h2>
              <p className="text-gray-700 mb-4">
                Você pode, a qualquer momento, solicitar:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Confirmação da existência de tratamento</li>
                <li>Acesso aos dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Portabilidade dos dados</li>
                <li>Eliminação dos dados tratados com base no consentimento</li>
                <li>Informação sobre o compartilhamento de dados</li>
                <li>Revogação do consentimento</li>
              </ul>
              <p className="text-gray-700 mt-4">
                As solicitações devem ser feitas por e-mail para <a href="mailto:privacidade@multibpo.com.br" className="text-blue-600 hover:underline">privacidade@multibpo.com.br</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                11. Atualizações desta Política
              </h2>
              <p className="text-gray-700">
                Esta Política poderá ser atualizada a qualquer momento. Recomendamos consulta regular. Alterações significativas serão comunicadas via e-mail ou em destaque no site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                12. Canal de Atendimento
              </h2>
              <p className="text-gray-700 mb-4">
                Se você tiver dúvidas, reclamações ou quiser exercer algum direito, entre em contato conosco:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  <strong>E-mail:</strong> <a href="mailto:privacidade@multibpo.com.br" className="text-blue-600 hover:underline">privacidade@multibpo.com.br</a><br />
                  <strong>Website:</strong> <a href="https://www.multibpo.com.br" className="text-blue-600 hover:underline">https://www.multibpo.com.br</a>
                </p>
              </div>
            </section>

            <section className="bg-gray-100 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                Conformidade
              </h2>
              <p className="text-gray-700">
                Esta Política está em conformidade com a Lei Geral de Proteção de Dados Pessoais – LGPD (Lei nº 13.709/2018), podendo ser adaptada também às diretrizes do GDPR, quando aplicável a usuários fora do Brasil.
              </p>
            </section>
          </div>
        </div>
      </main>

      <LightFooter />
    </div>
  );
};

export default PrivacyPolicy;
