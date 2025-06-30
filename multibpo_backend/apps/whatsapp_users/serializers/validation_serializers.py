# apps/whatsapp_users/serializers/validation_serializers.py
from rest_framework import serializers
from ..models import WhatsAppUser, ConfiguracaoSistema


class ValidateUserRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    message_preview = serializers.CharField(max_length=200, required=False, allow_blank=True)

    def validate_phone_number(self, value):
        """Normalizar formato do telefone"""
        # Remove espaços e caracteres especiais, mantém apenas dígitos
        clean_phone = ''.join(filter(str.isdigit, value))
        
        # Deve ter pelo menos 10 dígitos
        if len(clean_phone) < 10:
            raise serializers.ValidationError("Número de telefone inválido")
        
        # Formato brasileiro: adicionar +55 se não tiver
        if not clean_phone.startswith('55'):
            clean_phone = '55' + clean_phone
        
        return '+' + clean_phone


class ValidateUserResponseSerializer(serializers.Serializer):
    pode_perguntar = serializers.BooleanField()
    plano_atual = serializers.CharField()
    perguntas_restantes = serializers.IntegerField()
    limite_info = serializers.DictField()
    mensagem_limite = serializers.CharField(allow_null=True)
    usuario_novo = serializers.BooleanField()
    precisa_termos = serializers.BooleanField()
    precisa_nome = serializers.BooleanField()
    user_id = serializers.IntegerField(allow_null=True)