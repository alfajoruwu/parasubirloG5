from rest_framework import serializers

from api.models import Postulacion


class PostulacionesProfesorSerializer(
    serializers.ModelSerializer
):  # Serializer para obtener los postulantes a una oferta
    class Meta:
        model = Postulacion
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["nombre_postulante"] = instance.postulante.nombre_completo
        ret["run_postulante"] = instance.postulante.run
        ret["modulo"] = instance.oferta.modulo.__str__()
        ret["riesgo_academico"] = instance.postulante.riesgo_academico
        ret.pop("oferta")
        ret.pop("estado")
        ret["horas"] = instance.oferta.horas_ayudantia
        ret["contacto"] = {
            "correo": instance.postulante.email,
            "telefono": instance.postulante.n_contacto,
            "otro": instance.postulante.otro_contacto,
        }
        return ret


class PostulacionesCoordinadorSerializer(
    serializers.ModelSerializer
):  # Serializer para obtener las postulaciones de todos los estudiantes
    class Meta:
        model = Postulacion
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["nombre_postulante"] = instance.postulante.nombre_completo
        ret["run_postulante"] = instance.postulante.run
        ret["riesgo_academico"] = instance.postulante.riesgo_academico
        ret["modulo"] = instance.oferta.modulo.__str__()
        ret.pop("oferta")
        ret["horas"] = instance.oferta.horas_ayudantia
        ret["contacto"] = {
            "correo": instance.postulante.email,
            "telefono": instance.postulante.n_contacto,
            "otro": instance.postulante.otro_contacto,
        }
        return ret


class PostulacionesEstudianteSerializer(
    serializers.ModelSerializer
):  # Serializer para obtener las postulaciones de un estudiante
    class Meta:
        model = Postulacion
        exclude = ["postulante"]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["modulo"] = instance.oferta.modulo.__str__()
        ret.pop("oferta")
        ret["profesor"] = instance.oferta.modulo.profesor_asignado.nombre_completo
        ret["horas"] = instance.oferta.horas_ayudantia
        ret["correo_profesor"] = instance.oferta.modulo.profesor_asignado.email
        return ret
