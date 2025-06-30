# apps/whatsapp_users/serializers/user_serializers.py
from rest_framework import serializers
from ..models import WhatsAppUser


class UpdateUserRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    action = serializers.ChoiceField(choices=[
        'aceitar_termos', 
        'definir_nome', 
        'verificar_email', 
        'upgrade_plano',
        'first_contact'
    ])
    data = serializers.DictField(required=False, default=dict)

    def validate_data(self, value):
        """Validar dados baseado na ação"""
        action = self.initial_data.get('action')
        
        if action == 'definir_nome':
            if not value.get('nome'):
                raise serializers.ValidationError("Nome é obrigatório")
            if len(value['nome'].strip()) < 2:
                raise serializers.ValidationError("Nome muito curto")
        
        elif action == 'verificar_email':
            if not value.get('email'):
                raise serializers.ValidationError("Email é obrigatório")
        
        return value


class UpdateUserResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    user_updated = serializers.BooleanField()
    new_status = serializers.CharField()
    message = serializers.CharField(allow_null=True)
    perguntas_restantes = serializers.IntegerField(allow_null=True)