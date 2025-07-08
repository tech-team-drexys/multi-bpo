// src/pages/mobile/PremiumSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './PremiumSuccess.css';

interface SubscriptionInfo {
  subscription_id: string;
  customer_id: string;
  plan: string;
  status: string;
  next_billing_date: string;
  phone_number: string;
}

const PremiumSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Extrair parâmetros da URL
  const subscription_id = searchParams.get('subscription_id');
  const customer_id = searchParams.get('customer_id');
  const phone = searchParams.get('phone');
  const ref = searchParams.get('ref');

  useEffect(() => {
    // Simular carregamento das informações da assinatura
    const loadSubscriptionInfo = async () => {
      try {
        // Aqui faria uma chamada real para a API para confirmar status
        // Para o MVP, vamos simular os dados
        const mockInfo: SubscriptionInfo = {
          subscription_id: subscription_id || 'sub_mock',
          customer_id: customer_id || 'cus_mock',
          plan: 'MultiBPO Premium',
          status: 'Ativa',
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          phone_number: phone || ''
        };
        
        setSubscriptionInfo(mockInfo);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar informações:', error);
        setLoading(false);
      }
    };

    loadSubscriptionInfo();
  }, [subscription_id, customer_id, phone]);

  const handleContinueWhatsApp = () => {
    // Se veio do WhatsApp, mostrar instrução para voltar
    if (ref === 'whatsapp') {
      // Tentar abrir WhatsApp diretamente (pode não funcionar em todos os browsers)
      window.open('https://wa.me/', '_blank');
    } else {
      // Redirecionar para página principal
      navigate('/');
    }
  };

  const handleAccessWeb = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="premium-success">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Confirmando sua assinatura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-success">
      {/* Hero Section - Confirmação */}
      <div className="success-hero">
        <div className="success-icon">🎉</div>
        <h1>Parabéns!</h1>
        <h2>Sua assinatura está ativa!</h2>
        <p>Você agora tem acesso ilimitado à IA contábil mais avançada do Brasil</p>
      </div>

      {/* Informações da Assinatura */}
      <div className="subscription-info">
        <div className="info-card">
          <h3>Detalhes da Assinatura</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Plano:</span>
              <span className="value">{subscriptionInfo?.plan}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="value status-active">✅ {subscriptionInfo?.status}</span>
            </div>
            <div className="info-item">
              <span className="label">Valor:</span>
              <span className="value">R$ 29,90/mês</span>
            </div>
            <div className="info-item">
              <span className="label">Próximo vencimento:</span>
              <span className="value">{subscriptionInfo?.next_billing_date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefícios Desbloqueados */}
      <div className="unlocked-benefits">
        <h3>🔓 Benefícios Desbloqueados</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-icon">💬</span>
            <span>Perguntas ilimitadas no WhatsApp</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">💻</span>
            <span>Acesso completo pelo computador</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">⚡</span>
            <span>IA mais avançada e precisa</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🎯</span>
            <span>Suporte prioritário 24/7</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">📊</span>
            <span>Relatórios personalizados</span>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🚀</span>
            <span>Recursos exclusivos premium</span>
          </div>
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="next-steps">
        <h3>Próximos Passos</h3>
        
        {ref === 'whatsapp' ? (
          <div className="whatsapp-instructions">
            <div className="instruction-card">
              <div className="instruction-icon">📱</div>
              <h4>Volte ao WhatsApp</h4>
              <p>Sua assinatura já está ativa! Retorne ao WhatsApp e comece a fazer perguntas ilimitadas para a IA.</p>
            </div>
            
            <button 
              onClick={handleContinueWhatsApp}
              className="whatsapp-btn"
            >
              📱 Continuar no WhatsApp
            </button>
          </div>
        ) : (
          <div className="web-instructions">
            <div className="instruction-card">
              <div className="instruction-icon">💻</div>
              <h4>Acesse pelo Computador</h4>
              <p>Você pode usar a IA tanto pelo WhatsApp quanto pelo site. Faça login para acessar todos os recursos.</p>
            </div>
            
            <button 
              onClick={handleAccessWeb}
              className="web-btn"
            >
              💻 Acessar Site Principal
            </button>
          </div>
        )}

        {/* Botão Secundário */}
        <div className="secondary-actions">
          <button 
            onClick={handleAccessWeb}
            className="secondary-btn"
          >
            🌐 Explorar Recursos Web
          </button>
        </div>
      </div>

      {/* Informações de Suporte */}
      <div className="support-info">
        <h4>Precisa de ajuda?</h4>
        <div className="support-grid">
          <div className="support-item">
            <span>📧</span>
            <span>contato@multibpo.com.br</span>
          </div>
          <div className="support-item">
            <span>📱</span>
            <span>WhatsApp: (11) 9 9999-9999</span>
          </div>
          <div className="support-item">
            <span>🕒</span>
            <span>Suporte: 24h/7 dias</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="success-footer">
        <p>Obrigado por escolher a MultiBPO! 🚀</p>
        <p className="sub-id">ID da Assinatura: {subscriptionInfo?.subscription_id}</p>
      </div>
    </div>
  );
};

export default PremiumSuccess;