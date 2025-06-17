// src/services/api.ts

// Detecta automaticamente se está em produção ou desenvolvimento
const getApiBaseUrl = () => {
  // Em produção (domínio real)
  if (typeof window !== 'undefined' && window.location.hostname.includes('multibpo.com.br')) {
    return 'https://multibpo.com.br';
  }
  
  // Em desenvolvimento ou build
  return import.meta.env.VITE_API_URL || 'http://localhost:8010';
};

const API_BASE_URL = getApiBaseUrl();

export class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('API Base URL:', this.baseURL); // Debug
  }

  private async fetchWithConfig(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}/api/v1${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Para CORS com cookies
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Serviços
  async getServices() {
    return this.fetchWithConfig('/servicos/');
  }

  async getService(id: string) {
    return this.fetchWithConfig(`/servicos/${id}/`);
  }

  async getServicesByCategory(categoryId: string) {
    return this.fetchWithConfig(`/servicos/?categoria=${categoryId}`);
  }

  async getCategories() {
    return this.fetchWithConfig('/servicos/categorias/');
  }

  // Solicitações de orçamento
  async requestQuote(data: any) {
    return this.fetchWithConfig('/servicos/solicitacoes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();