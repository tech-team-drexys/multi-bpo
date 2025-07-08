import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { asaasApi } from '../../services/asaasApi';
import './PremiumMobile.css';

const PremiumMobile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Parâmetros da URL
  const phone = searchParams.get('phone');
  const ref = searchParams.get('ref');
  
  useEffect(() => {
    // Log para debug
    console.log('PremiumMobile loaded:', { phone, ref });
  }, [phone, ref]);

  const handleSubscribe = async () => {
    if (!phone) {
      setError('Número de telefone não encontrado. Acesse via WhatsApp.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validar número de telefone
      if (!asaasApi.validatePhoneNumber(phone)) {
        throw new Error('Número de telefone inválido');
      }

      // Formatar número
      const formattedPhone = asaasApi.formatPhoneNumber(phone);
      
      // Criar subscription no Asaas
      const response = await asaasApi.createSubscription(formattedPhone);
      
      if (response.success && response.checkout_url) {
        // Redirecionar para checkout do Asaas
        window.location.href = response.checkout_url;
      } else {
        throw new Error(response.error || 'Erro ao processar assinatura');
      }
      
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-mobile">
      {/* Header */}
      <div className="premium-header">
        <div className="premium-logo">
          <img src="/logo-multibpo.png" alt="MultiBPO" className="logo" />
        </div>
        <h1 className="premium-title">
          🚀 Desbloqueie o Poder Completo!
        </h1>
        <p className="premium-subtitle">
          Acesso ilimitado à IA contábil mais avançada do Brasil
        </p>
      </div>

      {/* Benefícios */}
      <div className="premium-benefits">
        <div className="benefit-item">
          <div className="benefit-icon">✅</div>
          <div className="benefit-text">
            <strong>Perguntas ILIMITADAS</strong><br />
            <span>Sem limites no WhatsApp e no site</span>
          </div>
        </div>
        
        <div className="benefit-item">
          <div className="benefit-icon">⚡</div>
          <div className="benefit-text">
            <strong>IA mais avançada</strong><br />
            <span>Respostas mais precisas e detalhadas</span>
          </div>
        </div>
        
        <div className="benefit-item">
          <div className="benefit-icon">💻</div>
          <div className="benefit-text">
            <strong>Acesso pelo computador</strong><br />
            <span>Use também no site multibpo.com.br</span>
          </div>
        </div>
        
        <div className="benefit-item">
          <div className="benefit-icon">🎯</div>
          <div className="benefit-text">
            <strong>Suporte prioritário</strong><br />
            <span>Atendimento rápido e especializado</span>
          </div>
        </div>
        
        <div className="benefit-item">
          <div className="benefit-icon">📊</div>
          <div className="benefit-text">
            <strong>Relatórios personalizados</strong><br />
            <span>Análises detalhadas do seu negócio</span>
          </div>
        </div>
      </div>

      {/* Preço */}
      <div className="premium-pricing">
        <div className="price-highlight">
          <span className="currency">R$</span>
          <span className="amount">29,90</span>
          <span className="period">/mês</span>
        </div>
        <p className="price-description">
          Menos que um café por dia! ☕<br />
          <strong>Economia de milhares em honorários contábeis</strong>
        </p>
      </div>

      {/* Botão de Assinatura */}
      <div className="premium-cta">
        <button 
          onClick={handleSubscribe}
          disabled={loading || !phone}
          className={`subscribe-btn ${loading ? 'loading' : ''}`}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Processando...
            </>
          ) : (
            <>
              💎 Assinar Agora
            </>
          )}
        </button>
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
        
        {!phone && (
          <div className="warning-message">
            ⚠️ Acesse esta página através do WhatsApp
          </div>
        )}
      </div>

      {/* Garantia */}
      <div className="premium-guarantee">
        <div className="guarantee-badge">
          🛡️ <strong>Garantia de 7 dias</strong>
        </div>
        <p>Não gostou? Devolvemos seu dinheiro sem perguntas!</p>
      </div>

      {/* Testimonial */}
      <div className="premium-testimonial">
        <div className="testimonial-content">
          <p>"Economizei mais de R$ 500 em honorários contábeis no primeiro mês! A IA é incrível."</p>
          <span className="testimonial-author">- Maria Silva, Empresária</span>
        </div>
      </div>

      {/* FAQ Rápido */}
      <div className="premium-faq">
        <h3>Perguntas Frequentes</h3>
        <div className="faq-item">
          <strong>Posso cancelar a qualquer momento?</strong>
          <p>Sim! Sem fidelidade, cancele quando quiser.</p>
        </div>
        <div className="faq-item">
          <strong>Como funciona o pagamento?</strong>
          <p>Débito automático mensal seguro via Asaas.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="premium-footer">
        <p>
          <Link to="/m/politica">Política de Privacidade</Link> • 
          <a href="https://multibpo.com.br" target="_blank" rel="noopener noreferrer">
            Site MultiBPO
          </a>
        </p>
        <p className="footer-note">
          {ref === 'whatsapp' && '📱 Você veio do WhatsApp'}
        </p>
      </div>
    </div>
  );
};

export default PremiumMobile;