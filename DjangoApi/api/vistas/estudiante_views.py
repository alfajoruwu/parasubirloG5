# from rest_framework import viewsets
# from rest_framework.response import Response

# from api.serializadores.estudiante_serializers import (
#     PostulacionesEstuadianteSerializer,
#     DatosEstudianteSerializer,
# )
# from api.models import Postulacion
# from usuarios.models import User

# from django.db.models import Sum


# class PostulacionesEstudianteView(viewsets.GenericViewSet):
#     serializer_class = PostulacionesEstuadianteSerializer

#     def get_queryset(self):
#         if self.request.user.is_authenticated and not self.request.user.is_superuser:
#             return Postulacion.objects.filter(postulante__rut=self.request.user)
#         else:
#             # Devuelve un QuerySet vacío si el usuario no está autenticado
#             return Postulacion.objects.filter(
#                 postulante__rut=Postulacion.objects.all().first().postulante.rut
#             )

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)


# class SumaHorasAceptadasView(viewsets.GenericViewSet):
#     def get_queryset(self):
#         if self.request.user.is_authenticated and not self.request.user.is_superuser:
#             return Postulacion.objects.filter(
#                 postulante__rut=self.request.user, estado=True
#             )
#         else:
#             return Postulacion.objects.filter(
#                 postulante__rut=Postulacion.objects.all().first().postulante.rut,
#                 estado=False,
#             )  # de momento solo esta trayendo los que tienen estado falso porque no hay datos cuando estan aceptados

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         suma_horas_aceptadas = queryset.aggregate(
#             total_horas=Sum("oferta__horas_ayudantia")
#         )["total_horas"]
#         return Response({"suma_horas_aceptadas": suma_horas_aceptadas})


# class DatosEstudiantesView(viewsets.GenericViewSet):
#     serializer_class = DatosEstudianteSerializer

#     def get_queryset(self):
#         if self.request.user.is_authenticated and not self.request.user.is_superuser:
#             return User.objects.filter(rut=self.request.user)
#         else:
#             return User.objects.filter(
#                 rut=User.objects.all().first().rut
#             )  # de momento solo esta trayendo los que tienen estado falso porque no hay datos cuando estan aceptados

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)

#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = DatosEstudianteSerializer(instance)
#         return Response(serializer.data)

#     def partial_update(self, request, *args, **kwargs):
#         instance = self.get_object()

#         # Obtener los datos de usuario del cuerpo de la solicitud
#         usuario_data = request.data.pop('usuario', {})

#         # Actualizar los campos de usuario si se proporcionan en la solicitud
#         for attr, value in usuario_data.items():
#             setattr(instance.rut, attr, value)
#             print(instance.rut, attr, value)

#         # Guardar los cambios en el usuario
#         instance.rut.save()

#         serializer = self.get_serializer(instance, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)
