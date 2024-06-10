from rest_framework import serializers

from api.models import Modulo


class ModuloSerializers(serializers.ModelSerializer):
    class Meta:
        model = Modulo
        fields = "__all__"

    def to_representation(self, instance):
        if instance.profesor_asignado is None:
            return {
                "id": instance.id,
                "nombre": instance.nombre,
                "seccion": instance.seccion,
                "horas_asignadas": instance.horas_asignadas,
                "semestre": instance.semestre,
                "anio": instance.anio,
                "profesor_asignado": "No asignado",
            }
        return {
            "id": instance.id,
            "nombre": instance.__str__(),
            "horas_asignadas": instance.horas_asignadas,
            "semestre": instance.semestre,
            "anio": instance.anio,
            "profesor_asignado": instance.profesor_asignado.nombre_completo,
        }
