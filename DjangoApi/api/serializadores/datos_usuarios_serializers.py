from rest_framework import serializers

from usuarios.models import User


class DatosEstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "nombre_completo",
            "email",
            "otro_contacto",
            "matricula",
            "tipo_cuenta",
            "n_cuenta",
            "banco",
            "n_contacto",
            "riesgo_academico",
            "charla",
        ]


class HorasEstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "horas_aceptadas",
        ]


class DatosProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "nombre_completo",
            "email",
            "otro_contacto",
        ]


class NombresProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "run",
            "nombre_completo",
        ]
