"""
Base factories para testes do MultiBPO
Sub-Fase 2.2.1 - Preparação para Serializers
"""

import factory
from django.contrib.auth.models import User
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
import random


class UserFactory(DjangoModelFactory):
    """Factory para criar usuários de teste"""
    
    class Meta:
        model = User
        django_get_or_create = ('username',)
    
    username = factory.Sequence(lambda n: f"contador_{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@multibpo.com.br")
    first_name = Faker('first_name', locale='pt_BR')
    last_name = Faker('last_name', locale='pt_BR') 
    is_active = True
    is_staff = False
    is_superuser = False


class BaseContabilFactory(DjangoModelFactory):
    """Factory base para models contábeis"""
    
    class Meta:
        abstract = True
    
    @factory.lazy_attribute
    def cpf_valido(self):
        """Gera CPF válido para testes"""
        # CPFs válidos para teste (não usar em produção)
        cpfs_teste = [
            "11144477735", "33355577735", "55566677735",
            "77788899935", "99900011135", "12345678909"
        ]
        return random.choice(cpfs_teste)
    
    @factory.lazy_attribute 
    def cnpj_valido(self):
        """Gera CNPJ válido para testes"""
        # CNPJs válidos para teste (não usar em produção)
        cnpjs_teste = [
            "11222333000181", "44555666000172", "77888999000163",
            "12345678000195", "98765432000187", "11111111000191"
        ]
        return random.choice(cnpjs_teste)


# Configurações globais do Factory Boy
factory.Faker._DEFAULT_LOCALE = 'pt_BR'