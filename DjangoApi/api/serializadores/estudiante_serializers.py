# from rest_framework import serializers

# from api.models import Postulacion
# from usuarios.models import User


# class PostulacionesEstuadianteSerializer(
#     serializers.ModelSerializer
# ):  # serializer para obtener el estado de las postulaciones de un alumno
#     class Meta:
#         model = Postulacion
#         fields = ["id", "estado", "postulante", "oferta"]

#     def to_representation(self, instance):
#         return {
#             "id_postulacion": instance.id,
#             "estado": instance.estado,
#             "postulante": instance.postulante.rut.rut,
#             "id_oferta": instance.oferta.id,
#             "modulo": instance.oferta.modulo.nombre,  # Acceder al nombre del módulo
#             "seccion": instance.oferta.modulo.seccion,
#             "profesor": instance.oferta.modulo.profesor_asignado.rut.nombre,
#             "horas": instance.oferta.horas_ayudantia,
#         }


# class DatosEstudianteSerializer(serializers.ModelSerializer):
#     usuario = UsuarioSerializer(source='rut', read_only=True)
#     class Meta:
#         model = User
#         fields = "__all__"
