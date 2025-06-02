-- Database multibpo_db já é criado automaticamente via POSTGRES_DB
-- Criar apenas os schemas necessários:
CREATE SCHEMA IF NOT EXISTS contadores;
CREATE SCHEMA IF NOT EXISTS ia_data;
CREATE SCHEMA IF NOT EXISTS servicos;

-- Opcional: Confirmar que schemas foram criados
SELECT 'Schemas contábeis criados com sucesso!' as status;