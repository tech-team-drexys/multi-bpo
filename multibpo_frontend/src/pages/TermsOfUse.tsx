
import Header from '@/components/Header';
import LightFooter from '@/components/LightFooter';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Termos de Uso
            </h1>
            
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="text-lg text-gray-700 space-y-2 text-left">
                <h2 className="text-xl font-semibold text-blue-950 mb-4">TERMOS DE USO – MULTI BPO DO BRASIL LTDA</h2>
                <p>Estes Termos de Uso regulam o acesso e a utilização das soluções tecnológicas e dos serviços disponibilizados pela MULTI BPO DO BRASIL, inscrita no CNPJ sob o nº 46.505.712/0001-63, com sede na Alameda Araguaia, n° 2044, Conjunto 910, Bloco 1, bairro Alphaville, cidade de Barueri, estado de São Paulo, CEP 06455-000 e devidamente registrada no CRC/SP sob o n° 2SP045316, doravante denominada apenas "MULTI BPO".</p>
                <p className="mt-4">Ao acessar ou utilizar qualquer serviço da MULTI BPO, o usuário concorda integralmente com estes Termos. Caso não concorde, não utilize os serviços.</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                1. OBJETO E ÂMBITO DE APLICAÇÃO
              </h2>
              <p className="text-gray-700 leading-relaxed">
                A MULTI BPO disponibiliza soluções tecnológicas baseadas em inteligência artificial, automação de processos, assistentes virtuais, sistemas de atendimento e ferramentas de gestão. Os serviços podem incluir: plataformas online, APIs, sistemas integrados, totens de atendimento, cursos, consultorias e outras ferramentas digitais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                2. CADASTRO E CONTA DO USUÁRIO
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Para utilizar determinadas funcionalidades, o usuário deverá realizar cadastro, fornecendo dados verídicos e atualizados. O usuário é responsável pela guarda das credenciais de acesso e por todas as atividades realizadas sob sua conta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                3. LICENÇA DE USO DAS SOLUÇÕES
              </h2>
              <p className="text-gray-700 mb-4">
                A MULTI BPO concede ao usuário uma licença de uso pessoal, exclusiva, intransferível e revogável, para utilizar suas soluções conforme previsto nestes Termos.
              </p>
              <p className="text-gray-700 mb-4 font-medium">É vedado:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Copiar, modificar, distribuir ou realizar engenharia reversa dos sistemas</li>
                <li>Utilizar as soluções para fins ilícitos, fraudulentos ou abusivos</li>
                <li>Ceder ou sublicenciar os serviços a terceiros sem autorização expressa</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                4. CONTEÚDO GERADO POR USUÁRIOS
              </h2>
              <p className="text-gray-700 leading-relaxed">
                O usuário é integralmente responsável pelo conteúdo inserido, transmitido ou gerado por meio das soluções da MULTI BPO. A empresa não se responsabiliza por opiniões, dados ou arquivos inseridos por terceiros.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                5. PAGAMENTO E PLANOS
              </h2>
              <p className="text-gray-700 mb-4">
                Algumas funcionalidades são oferecidas mediante pagamento. Os valores, formas de pagamento, periodicidade e condições de cancelamento estarão descritos em contrato específico ou na própria plataforma.
              </p>
              <p className="text-gray-700">
                A inadimplência poderá ensejar a suspensão ou o cancelamento dos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                6. PROPRIEDADE INTELECTUAL
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Todos os direitos sobre as soluções, marcas, sistemas, softwares, bases de dados, design e demais elementos da MULTI BPO são protegidos por lei e pertencem exclusivamente à empresa, salvo quando expressamente informado em sentido contrário.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                7. LIMITAÇÃO DE RESPONSABILIDADE
              </h2>
              <p className="text-gray-700 mb-4">
                As soluções da MULTI BPO são disponibilizadas "tal como estão", podendo passar por melhorias, ajustes e interrupções temporárias. A empresa não garante disponibilidade ininterrupta, tampouco se responsabiliza por:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Problemas decorrentes de conexão com a internet</li>
                <li>Decisões tomadas com base em informações geradas por inteligência artificial</li>
                <li>Falhas de terceiros integrados à solução (como APIs ou sistemas externos)</li>
                <li>Eventuais erros, imprecisões, alucinações ou respostas incoerentes geradas por sistemas baseados em IA</li>
                <li>Uso inadequado ou interpretação equivocada das informações fornecidas pelos assistentes virtuais</li>
              </ul>
              <p className="text-gray-700 mt-4">
                O usuário reconhece que as tecnologias utilizadas pela MULTI BPO podem estar em aprimoramento contínuo, e compreende a natureza experimental de soluções baseadas em inteligência artificial.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                8. PRIVACIDADE E PROTEÇÃO DE DADOS
              </h2>
              <p className="text-gray-700 mb-4">
                O tratamento de dados pessoais é realizado conforme a <a href="/privacy-policy" className="text-blue-600 hover:underline">Política de Privacidade</a> da MULTI BPO. O uso dos serviços implica concordância com as disposições ali previstas.
              </p>
              <p className="text-gray-700">
                As interações com assistentes virtuais e serviços baseados em IA poderão ser armazenadas para fins de suporte, melhoria contínua e auditoria de funcionamento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                9. CANCELAMENTO E ENCERRAMENTO DE CONTA
              </h2>
              <p className="text-gray-700 leading-relaxed">
                O usuário pode solicitar o cancelamento da conta a qualquer momento. A MULTI BPO também poderá encerrar ou suspender o acesso em casos de violação dos Termos, conduta abusiva ou uso indevido das soluções.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                10. ALTERAÇÕES DOS TERMOS
              </h2>
              <p className="text-gray-700 leading-relaxed">
                A MULTI BPO reserva-se o direito de alterar estes Termos a qualquer tempo. Alterações significativas serão comunicadas aos usuários por e-mail ou através de notificações nas plataformas. O uso continuado dos serviços após tais alterações será interpretado como aceite tácito das novas condições.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                11. SUPORTE E CONTATO
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Em caso de dúvidas ou solicitações relativas aos serviços ou aos presentes Termos, o usuário poderá entrar em contato pelo e-mail: <a href="mailto:contato@multibpo.com.br" className="text-blue-600 hover:underline">contato@multibpo.com.br</a> ou por outros canais oficiais divulgados pela empresa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                12. DISPOSIÇÕES GERAIS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>A tolerância a eventuais infrações não constitui renúncia de direito</li>
                <li>Estes Termos podem ser atualizados a qualquer tempo, sendo recomendada revisão periódica</li>
                <li>O uso continuado dos serviços após alterações implica aceitação</li>
              </ul>
            </section>

            <section className="bg-gray-100 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold text-blue-950 mb-4">
                13. LEI APLICÁVEL E FORO
              </h2>
              <p className="text-gray-700">
                Este documento é regido pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de Barueri/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
              </p>
            </section>
          </div>
        </div>
      </main>

      <LightFooter />
    </div>
  );
};

export default TermsOfUse;
