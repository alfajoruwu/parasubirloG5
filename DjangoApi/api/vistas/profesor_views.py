# from rest_framework import viewsets
# from rest_framework.response import Response
# from rest_framework import status
# from api.serializadores.profesor_serializers import DatosProfesorSerializer
# from api.serializadores.profesor_serializers import (
#     PostulacionesProfesorSerializer,
#     PostulantesProfesorSerializer,
# )
# from api.models import Oferta


# class PostulacionesProfesorView(viewsets.GenericViewSet):
#     serializer_class = PostulacionesProfesorSerializer

#     def get_queryset(self):
#         if self.request.user.is_authenticated and not self.request.user.is_superuser:
#             return Oferta.objects.filter(
#                 modulo__profesor_asignado__run=self.request.user
#             )
#         else:
#             # Devuelve un QuerySet vacío si el usuario no está autenticado
#             return Oferta.objects.filter(
#                 modulo__profesor_asignado__run=Oferta.objects.all()
#                 .first()
#                 .modulo.profesor_asignado.run
#             )

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         serializer = PostulacionesProfesorSerializer(queryset, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def partial_update(
#         self, request, *args, **kwargs
#     ):  # Cambiar el estado de una oferta
#         instance = self.get_object()
#         instance.estado = request.data["estado"]
#         instance.save()
#         return Response({"estado": instance.estado}, status=status.HTTP_200_OK)


# class PostulantesProfesorView(viewsets.GenericViewSet):
#     serializer_class = PostulantesProfesorSerializer

#     def get_queryset(self):
#         if (
#             self.request.user.is_authenticated
#         ):  # TODO: no se si es realmente necesario validar en las visatas
#             return Oferta.objects.filter(
#                 modulo__profesor_asignado__run=self.request.user
#             )
#         else:
#             # Devuelve un QuerySet vacío si el usuario no está autenticado
#             return Response(
#                 {"error": "Usuario no autenticado"}, status=status.HTTP_401_UNAUTHORIZED
#             )

#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = PostulantesProfesorSerializer(instance)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def partial_update(
#         self, request, *args, **kwargs
#     ):  # Cambiar el estado de una postulación de una oferta
#         instance = self.get_object()  # Obtener la oferta
#         # postulacion = instance.postulacion_set.get(id=request.data['id'])
#         # postulacion.estado = request.data['estado']
#         # postulacion.save()
#         for postulacion in instance.postulacion_set.all():
#             if postulacion.id == request.data["id"]:
#                 if (
#                     postulacion.postulante.horas_aceptadas + instance.horas_ayudantia
#                     <= 24
#                 ):
#                     postulacion.postulante.horas_aceptadas += instance.horas_ayudantia
#                     postulacion.postulante.save()
#                     postulacion.estado = request.data["estado"]
#                     instance.estado = request.data["estado"]
#                     instance.save()
#                     postulacion.save()
#                 else:
#                     return Response(
#                         {
#                             "error": "Ayudante seleccionado sobrepasa las horas maximas (24)"
#                         },
#                         status=status.HTTP_409_CONFLICT,
#                     )
#             else:  # para asegurarse de que solo una postulación sea aceptada
#                 if postulacion.estado:
#                     postulacion.postulante.horas_aceptadas -= instance.horas_ayudantia
#                     postulacion.postulante.save()
#                     print(postulacion.postulante.nombre_completo)
#                     postulacion.estado = False
#                     postulacion.save()
#         return Response(
#             {"estado": "Nuevo ayudante asignado"}, status=status.HTTP_200_OK
#         )

# class DatosProfesorView(viewsets.GenericViewSet):
#     serializer_class = DatosProfesorSerializer
#     def get_queryset(self):
#         if self.request.user.is_authenticated and not self.request.user.is_superuser:
#             return Usuario.objects.filter(rut=self.request.user)
#         else:
#             # Devuelve un QuerySet vacío si el usuario no está autenticado
#             return Usuario.objects.filter(rut=Usuario.objects.all().first().rut)

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         serializer = DatosProfesorSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def partial_update(self, request, *args, **kwargs): # Cambiar el estado de una oferta
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)
