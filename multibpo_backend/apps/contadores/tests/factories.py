"""
Factories para testes automatizados
MultiBPO Sub-Fase 2.2.1 - Artefato Corrigido Completo

IMPORTANTE: Este arquivo pode ser usado mesmo sem factory-boy instalado
Para usar factories completas, instale: pip install factory-boy
"""

from django.contrib.auth.models import User
from apps.contadores.models import Contador, Escritorio, Especialidade
import random
from datetime import date, timedelta


# Versão simples sem factory-boy (funciona sempre)
class SimpleUserFactory:
    """Factory simples para User Django"""
    
    @staticmethod
    def create(**kwargs):
        username = kwargs.get('username', f"user_{random.randint(1000, 9999)}")
        first_name = kwargs.get('first_name', f"João{random.randint(1, 99)}")
        last_name = kwargs.get('last_name', f"Silva{random.randint(1, 99)}")
        email = kwargs.get('email', f"{username}@multibpo.com.br")
        
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'is_active': True,
                'is_staff': False
            }
        )
        return user


class SimpleEspecialidadeFactory:
    """Factory simples para Especialidade"""
    
    ESPECIALIDADES = [
        ('Contabilidade Geral', 'CONT_GERAL', 'contabil'),
        ('Contabilidade Tributária', 'CONT_TRIB', 'fiscal'),
        ('Auditoria Interna', 'AUDITORIA', 'auditoria'),
        ('Perícia Contábil', 'PERICIA', 'pericial'),
        ('Departamento Pessoal', 'DEPTO_PESS', 'trabalhista'),
        ('Consultoria Empresarial', 'CONSULTORIA', 'consultoria'),
        ('Controladoria', 'CONTROL', 'contabil'),
        ('Contabilidade Pública', 'CONT_PUB', 'contabil'),
    ]
    
    @staticmethod
    def create(**kwargs):
        if 'nome' in kwargs:
            nome = kwargs['nome']
            # Buscar dados correspondentes
            dados = next((d for d in SimpleEspecialidadeFactory.ESPECIALIDADES if d[0] == nome), None)
            if dados:
                codigo = dados[1]
                area_principal = dados[2]
            else:
                codigo = nome.upper().replace(' ', '_')[:10]
                area_principal = 'contabil'
        else:
            # Escolher especialidade aleatória
            dados = random.choice(SimpleEspecialidadeFactory.ESPECIALIDADES)
            nome, codigo, area_principal = dados
        
        especialidade, created = Especialidade.objects.get_or_create(
            nome=nome,
            defaults={
                'codigo': codigo,
                'descricao': f"Especialização profissional em {nome.lower()}",
                'area_principal': area_principal,
                'requer_certificacao': nome in ['Auditoria Interna', 'Perícia Contábil'],
                'ativa': True
            }
        )
        return especialidade


class SimpleEscritorioFactory:
    """Factory simples para Escritório"""
    
    NOMES_ESCRITORIOS = [
        'Contábil Silva & Associados',
        'Escritório Santos Contabilidade',
        'BPO Oliveira Consultoria',
        'Contadores Reunidos Ltda',
        'Excellence Contábil',
        'Prime Assessoria Contábil',
        'Expertise Consultoria',
        'Soluções Contábeis Modernas'
    ]
    
    @staticmethod
    def create(**kwargs):
        nome_fantasia = kwargs.get('nome_fantasia', random.choice(SimpleEscritorioFactory.NOMES_ESCRITORIOS))
        cnpj = kwargs.get('cnpj', SimpleEscritorioFactory._gerar_cnpj_valido())
        
        escritorio, created = Escritorio.objects.get_or_create(
            cnpj=cnpj,
            defaults={
                'razao_social': f"{nome_fantasia} LTDA",
                'nome_fantasia': nome_fantasia,
                'regime_tributario': random.choice(['simples', 'presumido', 'real']),
                'cep': f"{random.randint(10000, 99999)}-{random.randint(100, 999)}",
                'logradouro': f"Rua das Empresas, {random.randint(100, 9999)}",
                'numero': str(random.randint(1, 500)),
                'bairro': 'Centro',
                'cidade': random.choice(['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba']),
                'estado': random.choice(['SP', 'RJ', 'MG', 'PR']),
                'telefone': f"+55119{random.randint(1000, 9999)}{random.randint(1000, 9999)}",
                'email': f"contato@{nome_fantasia.lower().replace(' ', '').replace('&', 'e')[:10]}.com.br",
                'responsavel_tecnico': f"CRC Responsável {random.randint(1, 100)}",
                'crc_responsavel': f"CRC-SP {random.randint(100000, 999999)}/O-{random.randint(1, 9)}",
                'ativo': True
            }
        )
        return escritorio
    
    @staticmethod
    def _gerar_cnpj_valido():
        """Gera CNPJ válido para testes"""
        def calcular_digito(digs, pesos):
            s = sum(int(digs[i]) * pesos[i] for i in range(len(digs)))
            resto = s % 11
            return 0 if resto < 2 else 11 - resto
        
        cnpj = [random.randint(0, 9) for _ in range(12)]
        
        # Primeiro dígito verificador
        pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        cnpj.append(calcular_digito(cnpj, pesos1))
        
        # Segundo dígito verificador
        pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        cnpj.append(calcular_digito(cnpj, pesos2))
        
        cnpj_str = ''.join(map(str, cnpj))
        return f"{cnpj_str[:2]}.{cnpj_str[2:5]}.{cnpj_str[5:8]}/{cnpj_str[8:12]}-{cnpj_str[12:]}"


class SimpleContadorFactory:
    """Factory simples para Contador"""
    
    @staticmethod
    def create(**kwargs):
        # Criar ou usar User fornecido
        user = kwargs.get('user')
        if not user:
            user = SimpleUserFactory.create()
        
        # Criar ou usar Escritório fornecido
        escritorio = kwargs.get('escritorio')
        if not escritorio:
            escritorio = SimpleEscritorioFactory.create()
        
        # Dados do contador
        nome_completo = kwargs.get('nome_completo', f"{user.first_name} {user.last_name}")
        cpf = kwargs.get('cpf', SimpleContadorFactory._gerar_cpf_valido())
        crc = kwargs.get('crc', f"CRC-SP {random.randint(100000, 999999)}/O-{random.randint(1, 9)}")
        
        # Datas aleatórias realistas
        hoje = date.today()
        data_nascimento = hoje - timedelta(days=random.randint(22*365, 65*365))
        data_registro_crc = hoje - timedelta(days=random.randint(365, 20*365))
        data_admissao = hoje - timedelta(days=random.randint(30, 5*365))
        
        contador, created = Contador.objects.get_or_create(
            user=user,
            defaults={
                'nome_completo': nome_completo,
                'cpf': cpf,
                'data_nascimento': data_nascimento,
                'crc': crc,
                'crc_estado': 'SP',
                'data_registro_crc': data_registro_crc,
                'categoria_crc': random.choice(['contador', 'tecnico']),
                'telefone_pessoal': f"+55119{random.randint(1000, 9999)}{random.randint(1000, 9999)}",
                'email_pessoal': user.email,
                'cargo': random.choice(['contador_junior', 'contador_pleno', 'contador_senior', 'gerente']),
                'eh_responsavel_tecnico': random.choice([True, False]),
                'pode_assinar_documentos': random.choice([True, False]),
                'formacao': 'Bacharelado em Ciências Contábeis',
                'ativo': True,
                'data_admissao': data_admissao,
                'escritorio': escritorio
            }
        )
        
        # Adicionar especialidades se foi criado agora
        if created:
            especialidades = kwargs.get('especialidades')
            if especialidades:
                contador.especialidades.set(especialidades)
            else:
                # Adicionar 1-3 especialidades aleatórias
                esp1 = SimpleEspecialidadeFactory.create(nome='Contabilidade Geral')
                esp2 = SimpleEspecialidadeFactory.create(nome='Contabilidade Tributária')
                qtd = random.randint(1, 2)
                contador.especialidades.add(esp1)
                if qtd > 1:
                    contador.especialidades.add(esp2)
        
        return contador
    
    @staticmethod
    def _gerar_cpf_valido():
        """Gera CPF válido para testes"""
        def calcular_digito(digs):
            s = 0
            qtd = len(digs) + 1
            for i in range(len(digs)):
                s += int(digs[i]) * (qtd - i)
            resto = s % 11
            return 0 if resto < 2 else 11 - resto
        
        cpf = [random.randint(0, 9) for _ in range(9)]
        cpf.append(calcular_digito(cpf))
        cpf.append(calcular_digito(cpf))
        
        cpf_str = ''.join(map(str, cpf))
        return f"{cpf_str[:3]}.{cpf_str[3:6]}.{cpf_str[6:9]}-{cpf_str[9:]}"


# Aliases para compatibilidade
UserFactory = SimpleUserFactory
EspecialidadeFactory = SimpleEspecialidadeFactory
EscritorioFactory = SimpleEscritorioFactory
ContadorFactory = SimpleContadorFactory