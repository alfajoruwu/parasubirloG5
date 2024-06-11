# from rest_framework import viewsets
# from .models import (
#     Modulo,
#     Oferta,
#     Postulacion,
#     Resolucion,
# )
# from usuarios.models import User
# from .serializer import (
#     ofertasSerializer,
#     EstudianteSerializer,
#     ProfesorSerializer,
#     ModuloSerializer,
#     PostulacionSerializer,
#     UsuarioSerializer,
#     ResolucionSerializer,
# )
# from .serializadores.profesor_serializers import ProfesorSerializer2
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.decorators import action
# from rest_framework import filters
# import json


# class tipoUsuarioListView(viewsets.GenericViewSet):
#     serializer_class = None

#     def get_queryset(self):
#         if self.request.user.is_authenticated:
#             if self.request.user.groups.all().exists():
#                 return self.request.user.groups.all().first().name
#             else:
#                 return "Estudiante"
#         else:
#             # Devuelve un QuerySet vacío si el usuario no está autenticado
#             return Oferta.objects.none()

#     def list(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         return Response(queryset)


# # view para el modelo ofertas
# class ofertasListView(viewsets.ModelViewSet):
#     queryset = Oferta.objects.all()
#     serializer_class = ofertasSerializer

#     # accion para listar todas las ofertas pero solo mostrar el id - nombre del modulo - seccion - horas asignadas - nombre del profesor
#     @action(detail=False, methods=["get"])
#     def listar_ofertas(self, request):
#         queryset = Oferta.objects.select_related("modulo", "modulo__profesor_asignado")
#         ofertas = [
#             {
#                 "id": oferta.id,
#                 "modulo": oferta.modulo.nombre,
#                 "seccion": oferta.modulo.seccion,
#                 "horas_asignadas": oferta.modulo.horas_asignadas,
#                 "profesor": oferta.modulo.profesor_asignado.rut.nombre,
#             }
#             for oferta in queryset
#         ]
#         return Response(ofertas, status=status.HTTP_200_OK)

#     # accion para listar todas las ofertas de un modulo y seccion en especifico, mostrando el id - nombre del modulo - seccion - horas asignadas - nombre del profesor - disponibilidad - nota minima - tareas - otros
#     @action(detail=False, methods=["get"])
#     def listar_ofertas_modulo(self, request):
#         nombre_modulo = request.query_params.get("nombre_modulo", None)
#         seccion = request.query_params.get("seccion", None)
#         año = request.query_params.get("año", None)
#         semestre = request.query_params.get("semestre", None)

#         queryset = Oferta.objects.select_related("modulo", "modulo__profesor_asignado")
#         if nombre_modulo:
#             queryset = queryset.filter(modulo__nombre=nombre_modulo)
#         if seccion:
#             queryset = queryset.filter(modulo__seccion=seccion)
#         if año:
#             queryset = queryset.filter(modulo__anio=año)
#         if semestre:
#             queryset = queryset.filter(modulo__semestre=semestre)

#         ofertas = [
#             {
#                 "id": oferta.id,
#                 "modulo": oferta.modulo.nombre,
#                 "seccion": oferta.modulo.seccion,
#                 "año": oferta.modulo.anio,
#                 "semestre": oferta.modulo.semestre,
#                 "horas_asignadas": oferta.modulo.horas_asignadas,
#                 "profesor": oferta.modulo.profesor_asignado.rut.nombre,
#                 "disponibilidad": oferta.disponibilidad,
#                 "nota_minima": oferta.nota_mini,
#                 "tareas": oferta.tareas,
#                 "otros": oferta.otros,
#             }
#             for oferta in queryset
#         ]
#         return Response(ofertas, status=status.HTTP_200_OK)


# # view para el modelo  usuario
# class UsuarioListView(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UsuarioSerializer


# # view para el modelo  postulacion
# class PostulacionListView(viewsets.ModelViewSet):
#     queryset = Postulacion.objects.all()
#     serializer_class = PostulacionSerializer


# class ModuloListView(viewsets.ModelViewSet):
#     queryset = Modulo.objects.all()
#     serializer_class = ModuloSerializer

#     # accion para listar los modulos de un profesor con el nombre del profesor en vez de su id
#     @action(detail=False, methods=["get"])
#     def listar_modulos_profesor(self, request):
#         # Obtener los parámetros de consulta de la URL
#         nombre_profesor = request.query_params.get("nombre_profesor", None)
#         nombre = request.query_params.get("nombre", None)
#         año = request.query_params.get("año", None)
#         semestre = request.query_params.get("semestre", None)

#         # Construir el queryset base
#         queryset = Modulo.objects.select_related("profesor_asignado")

#         # Aplicar filtros si se proporcionan los parámetros de consulta
#         if nombre_profesor:
#             queryset = queryset.filter(
#                 profesor_asignado__rut__nombre__icontains=nombre_profesor
#             )
#         if nombre:
#             queryset = queryset.filter(nombre__icontains=nombre)
#         if año:
#             queryset = queryset.filter(anio=año)
#         if semestre:
#             queryset = queryset.filter(semestre=semestre)

#         # Serializar los resultados
#         modulos = [
#             {
#                 "id": modulo.id,
#                 "nombre": modulo.nombre,
#                 "seccion": modulo.seccion,
#                 "año": modulo.anio,
#                 "semestre": modulo.semestre,
#                 "horas_asignadas": modulo.horas_asignadas,
#                 "profesor_asignado": modulo.profesor_asignado.rut.nombre,
#             }
#             for modulo in queryset
#         ]
#         return Response(modulos, status=status.HTTP_200_OK)

#     # cambiar las horas asignadas de un modulo
#     @action(detail=True, methods=["patch"])
#     def cambiar_horas_asignadas(self, request, pk=None):
#         modulo = self.get_object()
#         nuevas_horas = request.data.get("horas_asignadas")

#         if nuevas_horas == None:
#             return Response(
#                 {"mensaje": "Las horas no pueden ser nulas"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         modulo.horas_asignadas = nuevas_horas
#         modulo.save()
#         serializer = self.serializer_class(modulo)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     # funcion para listar todas las postulaciones de un modulo
#     @action(detail=False, methods=["get"])
#     def listar_postulaciones_modulo(self, request):
#         nombre_modulo = request.query_params.get("nombre_modulo", None)
#         seccion = request.query_params.get("seccion", None)
#         año = request.query_params.get("año", None)
#         semestre = request.query_params.get("semestre", None)

#         queryset = Postulacion.objects.select_related("oferta__modulo")
#         if nombre_modulo:
#             queryset = queryset.filter(oferta__modulo__nombre=nombre_modulo)
#         if seccion:
#             queryset = queryset.filter(oferta__modulo__seccion=seccion)
#         if año:
#             queryset = queryset.filter(oferta__modulo__anio=año)
#         if semestre:
#             queryset = queryset.filter(oferta__modulo__semestre=semestre)

#         postulaciones = [
#             {
#                 "id": postulacion.id,
#                 "modulo": postulacion.oferta.modulo.nombre,
#                 "seccion": postulacion.oferta.modulo.seccion,
#                 "año": postulacion.oferta.modulo.anio,
#                 "semestre": postulacion.oferta.modulo.semestre,
#                 "estado": postulacion.estado,
#                 "postulante": postulacion.postulante.rut.nombre,
#                 "comentario": postulacion.comentario,
#             }
#             for postulacion in queryset
#         ]
#         return Response(postulaciones, status=status.HTTP_200_OK)

#     # funcion para listar los modulos y sus datos
#     @action(detail=False, methods=["get"])
#     def listar_modulos(self, request):
#         nombre_modulo = request.query_params.get("nombre_modulo", None)
#         seccion = request.query_params.get("seccion", None)
#         año = request.query_params.get("año", None)
#         semestre = request.query_params.get("semestre", None)
#         profesor_asignado = request.query_params.get("profesor_asignado", None)

#         queryset = Modulo.objects.select_related("profesor_asignado")
#         if nombre_modulo:
#             queryset = queryset.filter(nombre=nombre_modulo)
#         if seccion:
#             queryset = queryset.filter(seccion=seccion)
#         if año:
#             queryset = queryset.filter(anio=año)
#         if semestre:
#             queryset = queryset.filter(semestre=semestre)
#         if profesor_asignado:
#             queryset = queryset.filter(profesor_asignado__rut__nombre=profesor_asignado)

#         modulos = [
#             {
#                 "id": modulo.id,
#                 "nombre": modulo.nombre,
#                 "seccion": modulo.seccion,
#                 "año": modulo.anio,
#                 "semestre": modulo.semestre,
#                 "horas_asignadas": modulo.horas_asignadas,
#                 "profesor_asignado": modulo.profesor_asignado.rut.nombre,
#             }
#             for modulo in queryset
#         ]
#         return Response(modulos, status=status.HTTP_200_OK)

#     @action(detail=False, methods=['post'])
#     def upload_modulos(self, request):
#         if request.method == 'POST':
#             data = json.loads(request.body)
#             for item in data:
#                 nombre = item.get('Curso')
#                 seccion = item.get('Seccion')
#                 horas_asignadas = item.get('Horas')
#                 semestre = 1 #modificar para que sea automatico
#                 anio = 2024 #modificar para que sea automatico
#                 print(horas_asignadas)

#                 # Verificar si el módulo ya existe
#                 existing_modulo = Modulo.objects.filter(nombre=nombre, seccion=seccion, semestre=semestre, anio=anio).exists()


# # view para el modelo  profesor
# class ProfesorListView(viewsets.ModelViewSet):
#     queryset = User.objects.all().filter(groups__name="Profesor")
#     serializer_class = ProfesorSerializer

#     # accion para listar la cantidad de postulantes por modulo
#     @action(detail=False, methods=["get"])
#     def listar_postulantes_por_profesor(self, request):
#         rut_profesor = request.query_params.get("rut_profesor", None)

#         queryset = Modulo.objects.select_related("profesor_asignado")
#         if rut_profesor:
#             queryset = queryset.filter(profesor_asignado__rut=rut_profesor)

#         ofertas = [
#             {
#                 "modulo": modulo.nombre,
#                 "horas_asignadas": modulo.horas_asignadas,
#                 "cantidad_postulantes": Postulacion.objects.filter(
#                     oferta__modulo=modulo
#                 ).count(),
#             }
#             for modulo in queryset
#         ]
#         return Response(ofertas, status=status.HTTP_200_OK)

#     # accion para listar todos los postulantes de un modulo en especifico para un profesor en especifico
#     @action(detail=False, methods=["get"])
#     def listar_postulantes_por_modulo(self, request):
#         rut_profesor = request.query_params.get("rut_profesor", None)
#         nombre_modulo = request.query_params.get("nombre_modulo", None)

#         queryset = Modulo.objects.select_related("profesor_asignado")
#         if nombre_modulo:
#             queryset = queryset.filter(nombre=nombre_modulo)

#         if rut_profesor:
#             queryset = queryset.filter(profesor_asignado__rut=rut_profesor)

#         postulantes = [
#             {
#                 "nombre": postulacion.postulante.rut.nombre,
#                 "nota": postulacion.nota_aprobacion,
#                 "estado": postulacion.estado,
#                 "comentario": postulacion.comentario,
#                 "contacto": postulacion.postulante.rut.correo,
#                 "modulo": postulacion.oferta.modulo.nombre,
#                 "seccion": postulacion.oferta.modulo.seccion,
#             }
#             for postulacion in Postulacion.objects.filter(oferta__modulo__in=queryset)
#         ]
#         return Response(postulantes, status=status.HTTP_200_OK)


# # view para el modelo  estudiante
# class EstudianteListView(viewsets.ModelViewSet):
#     # usuarios sin grupo son estudiantes
#     queryset = User.objects.filter(groups__isnull=True)
#     serializer_class = EstudianteSerializer

#     # funcion para listar todas las postulaciones de un estudiante
#     @action(detail=True, methods=["get"])
#     def listar_postulaciones(self, request):
#         rut_estudiante = request.query_params.get("rut_estudiante", None)
#         año = request.query_params.get("año", None)
#         semestre = request.query_params.get("semestre", None)

#         queryset = Postulacion.objects.select_related("postulante")
#         if rut_estudiante:
#             queryset = queryset.filter(postulante__rut=rut_estudiante)
#         if año:
#             queryset = queryset.filter(oferta__modulo__anio=año)
#         if semestre:
#             queryset = queryset.filter(oferta__modulo__semestre=semestre)

#         postulaciones = [
#             {
#                 "id": postulacion.id,
#                 "modulo": postulacion.oferta.modulo.nombre,
#                 "año": postulacion.oferta.modulo.anio,
#                 "semestre": postulacion.oferta.modulo.semestre,
#                 "estado": postulacion.estado,
#                 "postulante": postulacion.postulante.rut.nombre,
#             }
#             for postulacion in queryset
#         ]
#         return Response(postulaciones, status=status.HTTP_200_OK)


# # view para el modelo  resolucion
# class ResolucionListView(viewsets.ModelViewSet):
#     queryset = Resolucion.objects.all()
#     serializer_class = ResolucionSerializer
#     filter_backends = [filters.SearchFilter]
#     search_fields = ["id"]

#     # accion para actualizar el precio de una resolucion
#     @action(detail=True, methods=["patch"])
#     def actualizar_precio(self, request, pk=None):
#         resolucion = self.get_object()
#         nuevo_precio = request.data.get("precio")

#         if nuevo_precio == None:
#             return Response(
#                 {"mensaje": "El precio no puede ser nulo"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         resolucion.precio = nuevo_precio
#         resolucion.save()
#         serializer = self.serializer_class(resolucion)
#         return Response(serializer.data, status=status.HTTP_200_OK)
