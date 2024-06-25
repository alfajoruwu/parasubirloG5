# from rest_framework import serializers

# from api.models import Oferta, Usuario, Profesor


# class ProfesorSerializer2(serializers.ModelSerializer):
#     nombre = serializers.CharField(source="rut.nombre")
#     rut = serializers.IntegerField(source="rut.rut")

#     class Meta:
#         model = Profesor
#         fields = ["nombre", "rut"]


# class PostulacionesProfesorSerializer(
#     serializers.ModelSerializer
# ):  # Serializer para obtener las postulaciones a las ofertas de un profesor
#     class Meta:
#         model = Oferta
#         fields = "__all__"

#     def to_representation(self, instance):
#         return {
#             "id": instance.id,
#             "modulo": instance.modulo.__str__(),
#             "horas": instance.horas_ayudantia,
#             "postulantes": instance.postulacion_set.count(),
#             "estado": instance.estado,
#         }


# class PostulantesProfesorSerializer(
#     serializers.ModelSerializer
# ):  # Serializer para obtener los postulantes a una oferta
#     class Meta:
#         model = Oferta
#         fields = ["id", "estado"]

#     def to_representation(self, instance):
#         postulaciones = instance.postulacion_set.values(
#             "id",
#             "comentario",
#             "estado",
#             "postulante__nombre_completo",
#             "nota_aprobacion",
#             "postulante__email",
#             "postulante__n_contacto",
#             "postulante__otro_contacto",
#         )

#         # Crear una nueva lista con los nombres de las claves cambiados
#         postulaciones_renamed = [
#             {
#                 "id": postulacion["id"],
#                 "comentario": postulacion["comentario"],
#                 "estado": postulacion["estado"],
#                 "nombre": postulacion["postulante__nombre_completo"],
#                 "nota": postulacion["nota_aprobacion"],
#                 "contacto": {
#                     "correo": postulacion["postulante__email"],
#                     "telefono": postulacion["postulante__n_contacto"],
#                     "otro": postulacion["postulante__otro_contacto"],
#                 },
#             }
#             for postulacion in postulaciones
#         ]

#         return {"postulantes": postulaciones_renamed}


# class DatosProfesorSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Usuario
#         fields = ["rut", "nombre", "correo", "otro_contacto"]
