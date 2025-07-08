/**
 * AsaasApi Service - Integração com APIs de pagamento Asaas
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

interface CreateSubscriptionRequest {
  phone_number: string;
}

interface CreateSubscriptionResponse {
  success: boolean;
  checkout_url?: string;
  message?: string;
  error?: string;
}

class AsaasApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1/whatsapp`;
  }

  /**
   * Criar subscription no Asaas e obter URL de checkout
   */
  async createSubscription(phoneNumber: string): Promise<CreateSubscriptionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/asaas/create-subscription/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar assinatura');
      }

      return data;
    } catch (error) {
      console.error('Erro na API createSubscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Testar conexão com Asaas
   */
  async testConnection(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/asaas/test/`);
      return await response.json();
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }

  /**
   * Formatar número de telefone para padrão brasileiro
   */
  formatPhoneNumber(phone: string): string {
    // Remove caracteres especiais
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Adiciona código do país se não tiver
    if (!cleanPhone.startsWith('55')) {
      return '+55' + cleanPhone;
    }
    
    return '+' + cleanPhone;
  }

  /**
   * Validar número de telefone brasileiro
   */
  validatePhoneNumber(phone: string): boolean {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Deve ter 10-11 dígitos após código do país
    if (cleanPhone.length < 10) {
      return false;
    }
    
    // Com código do país: 13 dígitos (55 + 11 + 9 + 8)
    const withCountryCode = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone;
    return withCountryCode.length >= 12 && withCountryCode.length <= 13;
  }
}

// Export singleton instance
export const asaasApi = new AsaasApiService();
export default asaasApi;