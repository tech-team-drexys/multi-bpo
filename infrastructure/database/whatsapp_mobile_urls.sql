-- ========================================================================
-- ATUALIZAÇÃO: WhatsApp URLs para Páginas Mobile
-- Projeto: MultiBPO WhatsApp MVP - Fase 3
-- Data: 01/07/2025
-- Objetivo: /cadastro → /m/cadastro (otimização mobile)
-- CORREÇÃO: Nome correto da tabela = whatsapp_configuracoes
-- ========================================================================

-- ========================================================================
-- ATUALIZAR URLs PARA VERSÕES MOBILE
-- ========================================================================

-- URL Cadastro: /cadastro → /m/cadastro
INSERT INTO whatsapp_configuracoes (chave, valor, descricao, ativo)
VALUES (
    'url_cadastro', 
    'https://multibpo.com.br/m/cadastro',
    'URL mobile otimizada para cadastro via WhatsApp',
    true
)
ON CONFLICT (chave) 
DO UPDATE SET 
    valor = 'https://multibpo.com.br/m/cadastro',
    descricao = 'URL mobile otimizada para cadastro via WhatsApp',
    ativo = true;

-- URL Premium: /premium → /m/premium  
INSERT INTO whatsapp_configuracoes (chave, valor, descricao, ativo)
VALUES (
    'url_premium', 
    'https://multibpo.com.br/m/premium',
    'URL mobile otimizada para assinatura premium via WhatsApp',
    true
)
ON CONFLICT (chave) 
DO UPDATE SET 
    valor = 'https://multibpo.com.br/m/premium',
    descricao = 'URL mobile otimizada para assinatura premium via WhatsApp',
    ativo = true;

-- URL Política: Adicionar versão mobile
INSERT INTO whatsapp_configuracoes (chave, valor, descricao, ativo)
VALUES (
    'url_politica', 
    'https://multibpo.com.br/m/politica',
    'URL mobile para política de privacidade',
    true
)
ON CONFLICT (chave) 
DO UPDATE SET 
    valor = 'https://multibpo.com.br/m/politica',
    descricao = 'URL mobile para política de privacidade',
    ativo = true;

-- ========================================================================
-- VERIFICAÇÃO
-- ========================================================================
SELECT 
    'URLs Mobile Atualizadas' as status,
    chave,
    valor
FROM whatsapp_configuracoes 
WHERE chave LIKE 'url_%' AND ativo = true
ORDER BY chave;