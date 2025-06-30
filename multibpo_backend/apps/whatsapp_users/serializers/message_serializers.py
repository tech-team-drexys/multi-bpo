# apps/whatsapp_users/serializers/message_serializers.py
from rest_framework import serializers
from ..models import WhatsAppUser, WhatsAppMessage


class RegisterMessageRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    pergunta = serializers.CharField()
    resposta = serializers.CharField()
    tokens_utilizados = serializers.IntegerField(default=0, min_value=0)
    tempo_processamento = serializers.FloatField(default=0.0, min_value=0)

    def validate_pergunta(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Pergunta muito curta")
        return value.strip()

    def validate_resposta(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Resposta muito curta")
        return value.strip()


class RegisterMessageResponseSerializer(serializers.Serializer):
    message_id = serializers.IntegerField()
    perguntas_restantes = serializers.IntegerField()
    limite_atingido = serializers.BooleanField()
    proxima_acao = serializers.CharField()
    novo_plano = serializers.CharField(allow_null=True)