"""
AsaasService - Serviço para integração com API do Asaas
Implementação simplificada usando checkout pronto do Asaas
"""

import requests
import json
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from ..models import AssinaturaAsaas


class AsaasService:
    """Serviço para comunicação com API do Asaas"""
    
    def __init__(self):
        self.api_key = getattr(settings, 'ASAAS_API_KEY', '').replace("'", "")  # Remove aspas
        self.base_url = getattr(settings, 'ASAAS_BASE_URL', 'https://www.asaas.com/api/v3')
        self.site_url = getattr(settings, 'SITE_URL', 'https://multibpo.com.br')
        
        self.headers = {
            'access_token': self.api_key,
            'Content-Type': 'application/json',
            'User-Agent': 'MultiBPO/1.0'
        }
    
    def _make_request(self, method, endpoint, data=None):
        """Fazer requisição para API do Asaas"""
        url = f"{self.base_url}{endpoint}"
        
        # 🆕 LOGGING DETALHADO PARA DEBUG
        print(f"🔗 URL: {url}")
        print(f"📤 Headers: {json.dumps(self.headers, indent=2)}")
        print(f"📤 Data: {json.dumps(data, indent=2) if data else 'None'}")
        
        try:
            if method == 'POST':
                response = requests.post(url, json=data, headers=self.headers, timeout=30)
            elif method == 'GET':
                response = requests.get(url, headers=self.headers, timeout=30)
            else:
                raise ValueError(f"Método HTTP não suportado: {method}")
            
            # 🆕 LOGGING DA RESPOSTA
            print(f"📨 Status: {response.status_code}")
            print(f"📨 Response: {response.text}")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Erro na requisição Asaas: {e}")
            print(f"❌ Response text: {getattr(e.response, 'text', 'N/A') if hasattr(e, 'response') else 'N/A'}")
            raise Exception(f"Erro ao comunicar com Asaas: {str(e)}")
    
    def create_customer(self, whatsapp_user):
        """Criar customer no Asaas"""
        customer_data = {
            'name': whatsapp_user.nome or f'Usuário {whatsapp_user.phone_number}',
            'email': whatsapp_user.email or f'{whatsapp_user.phone_number.replace("+", "")}@temp.multibpo.com.br',
            'phone': whatsapp_user.phone_number,
            'mobilePhone': whatsapp_user.phone_number,
            'cpfCnpj': getattr(whatsapp_user, 'cpf_cnpj', '') or '',
            'externalReference': f'whatsapp_{whatsapp_user.id}',
            'notificationDisabled': False,
            'additionalEmails': ''
        }
        
        print(f"🔄 Criando customer no Asaas para {whatsapp_user.phone_number}")
        customer = self._make_request('POST', '/customers', customer_data)
        print(f"✅ Customer criado: {customer['id']}")
        
        return customer
    
    def create_subscription(self, whatsapp_user, plan_value=29.90):
        """Criar subscription e retornar URL do checkout"""
        
        # 1. Criar customer primeiro
        customer = self.create_customer(whatsapp_user)
        
        # 2. Calcular próxima data de cobrança (30 dias)
        next_due_date = (timezone.now() + timedelta(days=30)).date()
        
        # 3. Criar subscription
        subscription_data = {
            'customer': customer['id'],
            'billingType': 'UNDEFINED',  # Deixa usuário escolher (cartão, PIX, boleto)
            'value': float(plan_value),
            'nextDueDate': next_due_date.strftime('%Y-%m-%d'),
            'cycle': 'MONTHLY',
            'description': 'MultiBPO Premium - Acesso Ilimitado à IA Contábil',
            'externalReference': f'multibpo_premium_{whatsapp_user.id}',
            
            # URLs de retorno após pagamento
            'callback': {
                'successUrl': f'{self.site_url}/m/premium/sucesso?user={whatsapp_user.id}',
                'autoRedirect': True
            },
            
            # Configurações da subscription
            'endDate': None,  # Sem data de fim (recorrente)
            'maxPayments': None,  # Ilimitado
            'fine': {
                'value': 2.0,  # 2% de multa
                'type': 'PERCENTAGE'
            },
            'interest': {
                'value': 1.0,  # 1% ao mês
                'type': 'PERCENTAGE'
            }
        }
        
        print(f"🔄 Criando subscription no Asaas...")
        subscription = self._make_request('POST', '/subscriptions', subscription_data)
        print(f"✅ Subscription criada: {subscription['id']}")
        
        # 4. Salvar no banco local
        assinatura = AssinaturaAsaas.objects.create(
            whatsapp_user=whatsapp_user,
            customer_id=customer['id'],
            subscription_id=subscription['id'],
            valor=plan_value,
            status='PENDING',
            origem='whatsapp',
            external_reference=subscription_data['externalReference'],
            next_due_date=next_due_date,
            checkout_url=subscription.get('invoiceUrl', '')  # URL do checkout
        )
        
        print(f"✅ Assinatura salva no banco: {assinatura.id}")
        
        # 5. Retornar URL do checkout
        checkout_url = subscription.get('invoiceUrl', '')
        if not checkout_url:
            # Fallback: gerar URL baseada no ID
            checkout_url = f"https://checkout.asaas.com/subscription/{subscription['id']}"
        
        return checkout_url
    
    def get_subscription_status(self, subscription_id):
        """Verificar status de uma subscription"""
        try:
            subscription = self._make_request('GET', f'/subscriptions/{subscription_id}')
            return subscription.get('status', 'UNKNOWN')
        except Exception as e:
            print(f"❌ Erro ao verificar status da subscription {subscription_id}: {e}")
            return 'ERROR'
    
    def process_webhook_payment(self, webhook_data):
        """
        Processar eventos do webhook Asaas
        Suporta múltiplos eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE, PAYMENT_REFUNDED
        """
        try:
            event = webhook_data.get('event')
            payment_data = webhook_data.get('payment', {})
            subscription_data = webhook_data.get('subscription', {})
            
            print(f"🔔 Webhook recebido: {event}")
            print(f"📊 Payment data: {json.dumps(payment_data, indent=2)}")
            print(f"📊 Subscription data: {json.dumps(subscription_data, indent=2)}")
            
            # Buscar subscription_id nos dados do webhook
            subscription_id = payment_data.get('subscription') or subscription_data.get('id')
            if not subscription_id:
                print("❌ Subscription ID não encontrado no webhook")
                return False
            
            print(f"🔍 Buscando assinatura: {subscription_id}")
            
            # Buscar assinatura no banco local
            try:
                assinatura = AssinaturaAsaas.objects.get(subscription_id=subscription_id)
                print(f"✅ Assinatura encontrada: {assinatura.id} - Usuário: {assinatura.whatsapp_user.phone_number}")
            except AssinaturaAsaas.DoesNotExist:
                print(f"❌ Assinatura não encontrada no banco: {subscription_id}")
                return False
            
            # ========== PROCESSAR CADA TIPO DE EVENTO ==========
            
            if event == 'PAYMENT_CONFIRMED':
                # ✅ Pagamento confirmado - Ativar premium imediatamente
                print(f"✅ Processando PAYMENT_CONFIRMED para {assinatura.whatsapp_user.phone_number}")
                
                # Atualizar status da assinatura
                assinatura.status = 'ACTIVE'
                assinatura.data_ativacao = timezone.now()
                assinatura.save()
                
                # Ativar premium no usuário WhatsApp
                whatsapp_user = assinatura.whatsapp_user
                whatsapp_user.plano_atual = 'premium'
                whatsapp_user.limite_perguntas = 999999  # ✅ Valor alto = ilimitado
                whatsapp_user.save()

                print(f"✅ Usuário {whatsapp_user.phone_number} upgradado: plano={whatsapp_user.plano_atual}, limite={whatsapp_user.limite_perguntas}")
                
                print(f"🚀 PREMIUM ATIVADO para {whatsapp_user.phone_number}")
                return True
                
            elif event == 'PAYMENT_RECEIVED':
                # ✅ Pagamento recebido - Confirmar que está tudo certo
                print(f"💰 Processando PAYMENT_RECEIVED para {assinatura.whatsapp_user.phone_number}")
    
                # Confirmar que assinatura está ativa
                assinatura.status = 'ACTIVE'
                assinatura.data_ativacao = timezone.now()
                assinatura.save()
    
                # Garantir que premium está ativo
                whatsapp_user = assinatura.whatsapp_user
                if whatsapp_user.plano_atual != 'premium':
                    whatsapp_user.plano_atual = 'premium'
                    whatsapp_user.limite_perguntas = 999999  # ✅ CORRIGIDO: Valor alto = ilimitado
                    whatsapp_user.save()
                    print(f"🔄 Premium confirmado para {whatsapp_user.phone_number}")
    
                return True
                
            elif event == 'PAYMENT_OVERDUE':
                # ⚠️ Pagamento em atraso - Suspender premium
                print(f"⚠️ Processando PAYMENT_OVERDUE para {assinatura.whatsapp_user.phone_number}")
                
                # Atualizar status da assinatura
                assinatura.status = 'OVERDUE'
                assinatura.save()
                
                # Suspender premium (downgrade para básico)
                whatsapp_user = assinatura.whatsapp_user
                whatsapp_user.plano_atual = 'basico'
                whatsapp_user.limite_perguntas = 10  # Volta para 10 perguntas
                whatsapp_user.save()
                
                print(f"⚠️ PREMIUM SUSPENSO por atraso: {whatsapp_user.phone_number}")
                return True
                
            elif event == 'PAYMENT_REFUNDED':
                # 🔄 Pagamento estornado - Cancelar premium
                print(f"🔄 Processando PAYMENT_REFUNDED para {assinatura.whatsapp_user.phone_number}")
                
                # Atualizar status da assinatura
                assinatura.status = 'REFUNDED'
                assinatura.data_cancelamento = timezone.now()
                assinatura.save()
                
                # Cancelar premium (downgrade para básico)
                whatsapp_user = assinatura.whatsapp_user
                whatsapp_user.plano_atual = 'basico'
                whatsapp_user.limite_perguntas = 10  # Volta para 10 perguntas
                whatsapp_user.save()
                
                print(f"🔄 PREMIUM CANCELADO por estorno: {whatsapp_user.phone_number}")
                return True
            
            else:
                # ⚠️ Evento não tratado (mas não é erro)
                print(f"ℹ️ Evento não tratado (ignorado): {event}")
                return True  # Retorna True para confirmar recebimento
            
        except Exception as e:
            print(f"❌ Erro ao processar webhook: {e}")
            print(f"❌ Webhook data: {json.dumps(webhook_data, indent=2)}")
            # Log do erro mas não falha completamente
            return False
    
    def validate_webhook_token(self, request_token):
        """Validar token do webhook"""
        expected_token = getattr(settings, 'ASAAS_WEBHOOK_TOKEN', '')
        return request_token == expected_token if expected_token else True
    
    def test_connection(self):
        """Testar conexão com API do Asaas"""
        try:
            # Fazer uma requisição simples para testar
            response = self._make_request('GET', '/customers?limit=1')
            print("✅ Conexão com Asaas funcionando!")
            return True
        except Exception as e:
            print(f"❌ Erro na conexão com Asaas: {e}")
            return False