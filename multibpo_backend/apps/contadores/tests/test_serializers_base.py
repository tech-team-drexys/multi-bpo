"""
Testes para Serializers Base
MultiBPO Sub-Fase 2.2.1 - Artefato 2A - CORRIGIDO
"""

from django.test import TestCase
from ..models import Especialidade, Escritorio
from ..serializers import (
    EspecialidadeSerializer,
    EspecialidadeResumoSerializer,
    EscritorioSerializer,
    EscritorioResumoSerializer,
)


class TestEspecialidadeSerializer(TestCase):
    """Testes para EspecialidadeSerializer"""
    
    def setUp(self):
        """Setup dos testes"""
        self.especialidade = Especialidade.objects.create(
            nome="Contabilidade Geral",
            codigo="CONT001",
            area_principal="contabil",  # ← CORRIGIDO: usar area_principal
            descricao="Área de contabilidade geral e básica",
            requer_certificacao=True,
            ativa=True
        )
    
    def test_especialidade_serializer_fields(self):
        """Testa se todos os campos estão presentes"""
        serializer = EspecialidadeSerializer(self.especialidade)
        data = serializer.data
        
        expected_fields = [
            'id', 'nome', 'codigo', 'area_principal', 'area_display',  # ← CORRIGIDO
            'descricao', 'requer_certificacao', 'ativa', 'total_contadores', 'created_at'
        ]
        
        for field in expected_fields:
            self.assertIn(field, data)
    
    def test_especialidade_area_display(self):
        """Testa se area_display funciona"""
        serializer = EspecialidadeSerializer(self.especialidade)
        data = serializer.data
        
        self.assertEqual(data['area_principal'], 'contabil')
        # area_display pode não estar implementado ainda
        if 'area_display' in data:
            self.assertIsNotNone(data['area_display'])
    
    def test_especialidade_total_contadores(self):
        """Testa campo calculado total_contadores"""
        serializer = EspecialidadeSerializer(self.especialidade)
        data = serializer.data
        
        # Inicialmente deve ser 0 (nenhum contador criado)
        self.assertEqual(data['total_contadores'], 0)
    
    def test_especialidade_nome_validation(self):
        """Testa validação do nome"""
        # Nome muito curto
        data = {
            'nome': 'AB', 
            'codigo': 'AB001',
            'area_principal': 'contabil'
        }
        serializer = EspecialidadeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nome', serializer.errors)
    
    def test_especialidade_nome_duplicado(self):
        """Testa validação de nome duplicado"""
        data = {
            'nome': 'Contabilidade Geral',  # Mesmo nome do setUp
            'codigo': 'CONT002',
            'area_principal': 'fiscal'
        }
        serializer = EspecialidadeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nome', serializer.errors)


class TestEspecialidadeResumoSerializer(TestCase):
    """Testes para EspecialidadeResumoSerializer"""
    
    def setUp(self):
        """Setup dos testes"""
        self.especialidade = Especialidade.objects.create(
            nome="Auditoria",
            codigo="AUD001",
            area_principal="contabil",  # ← CORRIGIDO
            descricao="Área de auditoria contábil",
            ativa=True
        )
    
    def test_resumo_serializer_fields(self):
        """Testa se apenas campos resumidos estão presentes"""
        serializer = EspecialidadeResumoSerializer(self.especialidade)
        data = serializer.data
        
        expected_fields = ['id', 'nome', 'codigo', 'area_principal']  # ← CORRIGIDO
        
        self.assertEqual(len(data), len(expected_fields))
        for field in expected_fields:
            self.assertIn(field, data)


class TestEscritorioSerializer(TestCase):
    """Testes para EscritorioSerializer"""
    
    def setUp(self):
        """Setup dos testes"""
        self.escritorio = Escritorio.objects.create(
            razao_social="Escritório Teste Ltda",
            nome_fantasia="Teste Contábil",
            cnpj="00000000000191",  # ← CORRIGIDO: CNPJ válido
            email="contato@teste.com.br",
            cep="01234567",
            logradouro="Rua Teste, 123",  # ← CORRIGIDO: usar logradouro
            numero="123",
            bairro="Centro",
            cidade="São Paulo",
            estado="SP",
            telefone="11999887766",
            responsavel_tecnico="João Silva",
            crc_responsavel="SP123456"
        )
    
    def test_escritorio_serializer_fields(self):
        """Testa se todos os campos estão presentes"""
        serializer = EscritorioSerializer(self.escritorio)
        data = serializer.data
        
        expected_fields = [
            'id', 'razao_social', 'nome_fantasia', 'cnpj_formatado',
            'email', 'telefone_formatado', 'endereco_completo',
            'logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep',  # ← CORRIGIDO
            'responsavel_tecnico', 'crc_responsavel',  # ← CORRIGIDO
            'ativo', 'total_contadores', 'created_at', 'updated_at'
        ]
        
        for field in expected_fields:
            self.assertIn(field, data)
    
    def test_cnpj_formatado(self):
        """Testa formatação do CNPJ"""
        serializer = EscritorioSerializer(self.escritorio)
        data = serializer.data
        
        # Deve formatar: 00000000000191 -> 00.000.000/0001-91
        self.assertEqual(data['cnpj_formatado'], '00.000.000/0001-91')
    
    def test_endereco_completo(self):
        """Testa concatenação do endereço"""
        serializer = EscritorioSerializer(self.escritorio)
        data = serializer.data
        
        # Deve conter os componentes do endereço
        endereco = data['endereco_completo']
        self.assertIn("Rua Teste", endereco)
        self.assertIn("São Paulo", endereco)
        self.assertIn("SP", endereco)
    
    def test_cnpj_validation_invalido(self):
        """Testa validação de CNPJ inválido"""
        data = {
            'razao_social': 'Teste Ltda',
            'cnpj': '11111111111111',  # CNPJ inválido
            'email': 'teste@teste.com',
            'cep': '12345678',
            'logradouro': 'Rua Teste',
            'numero': '100',
            'bairro': 'Centro',
            'cidade': 'São Paulo',
            'estado': 'SP',
            'telefone': '11999887766',
            'responsavel_tecnico': 'Maria Silva',
            'crc_responsavel': 'SP654321'
        }
        serializer = EscritorioSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('cnpj', serializer.errors)
    
    def test_email_duplicado(self):
        """Testa validação de email duplicado"""
        data = {
            'razao_social': 'Outro Escritório',
            'email': 'contato@teste.com.br',  # Mesmo email do setUp
            'cnpj': '12345678000195',
            'cep': '87654321',
            'logradouro': 'Av Teste',
            'numero': '200',
            'bairro': 'Vila',
            'cidade': 'Rio de Janeiro',
            'estado': 'RJ',
            'telefone': '21999887766',
            'responsavel_tecnico': 'Ana Silva',
            'crc_responsavel': 'RJ654321'
        }
        serializer = EscritorioSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
    
    def test_cep_validation(self):
        """Testa validação de CEP"""
        # CEP inválido (muito curto)
        data = {
            'razao_social': 'Teste CEP',
            'cep': '123456',  # 6 dígitos (inválido)
            'email': 'cep@teste.com',
            'logradouro': 'Rua CEP',
            'numero': '300',
            'bairro': 'Centro',
            'cidade': 'São Paulo',
            'estado': 'SP',
            'telefone': '11888777666',
            'responsavel_tecnico': 'Pedro Silva',
            'crc_responsavel': 'SP987654'
        }
        serializer = EscritorioSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('cep', serializer.errors)


class TestEscritorioResumoSerializer(TestCase):
    """Testes para EscritorioResumoSerializer"""
    
    def setUp(self):
        """Setup dos testes"""
        self.escritorio = Escritorio.objects.create(
            razao_social="Escritório Resumo Ltda",
            nome_fantasia="Resumo Contábil",
            cnpj="12345678000195",  # ← CORRIGIDO: CNPJ válido
            email="resumo@teste.com.br",
            cep="12345678",
            logradouro="Av Resumo",
            numero="400",
            bairro="Centro",
            cidade="Rio de Janeiro",
            estado="RJ",
            telefone="+5521999887766",
            responsavel_tecnico="Maria Resumo",
            crc_responsavel="RJ123456"
        )
    
    def test_resumo_serializer_fields(self):
        """Testa se apenas campos resumidos estão presentes"""
        serializer = EscritorioResumoSerializer(self.escritorio)
        data = serializer.data
        
        expected_fields = [
            'id', 'nome_fantasia', 'razao_social', 'cidade',
            'estado', 'total_contadores', 'ativo'
        ]
        
        self.assertEqual(len(data), len(expected_fields))
        for field in expected_fields:
            self.assertIn(field, data)
    
    def test_total_contadores_resumo(self):
        """Testa campo calculado no serializer resumo"""
        serializer = EscritorioResumoSerializer(self.escritorio)
        data = serializer.data
        
        # Inicialmente deve ser 0
        self.assertEqual(data['total_contadores'], 0)


class TestSerializersIntegration(TestCase):
    """Testes de integração dos serializers"""
    
    def test_all_serializers_import(self):
        """Testa que todos os serializers podem ser importados"""
        self.assertTrue(EspecialidadeSerializer)
        self.assertTrue(EspecialidadeResumoSerializer)
        self.assertTrue(EscritorioSerializer)
        self.assertTrue(EscritorioResumoSerializer)
    
    def test_serializers_with_empty_data(self):
        """Testa serializers com dados mínimos"""
        # Especialidade mínima
        esp = Especialidade.objects.create(
            nome="Mínima",
            codigo="MIN001",
            area_principal="contabil",
            ativa=True
        )
        
        serializer = EspecialidadeSerializer(esp)
        data = serializer.data
        self.assertIn('nome', data)
        self.assertEqual(data['nome'], 'Mínima')
    
    def test_many_serializers(self):
        """Testa serialização de múltiplos objetos"""
        # Criar múltiplas especialidades
        especialidades = []
        for i in range(3):
            esp = Especialidade.objects.create(
                nome=f"Especialidade {i}",
                codigo=f"ESP{i:03d}",
                area_principal="contabil",
                ativa=True
            )
            especialidades.append(esp)
        
        serializer = EspecialidadeSerializer(especialidades, many=True)
        data = serializer.data
        
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]['nome'], 'Especialidade 0')
        self.assertEqual(data[1]['nome'], 'Especialidade 1')
        self.assertEqual(data[2]['nome'], 'Especialidade 2')