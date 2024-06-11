from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from api.serializadores.ofertas_serializers import (
    OfertasEstudianteSerializer,
    OfertasProfesorSerializer,
)
from api.models import Oferta, Modulo


class OfertasView(viewsets.GenericViewSet):
    def get_serializer_class(self):
        if self.request is None:
            return OfertasEstudianteSerializer
        if self.request.user.groups.filter(name="Profesor").exists():
            return OfertasProfesorSerializer
        if self.request.user.groups.filter(name="Coordinador").exists():
            return OfertasProfesorSerializer

        return OfertasEstudianteSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def get_queryset(self):
        if self.request is None:
            return Oferta.objects.all()
        if self.request.user.groups.filter(name="Profesor").exists():
            return Oferta.objects.filter(
                modulo__profesor_asignado__run=self.request.user
            )
        if self.request.user.groups.filter(name="Coordinador").exists():
            return Oferta.objects.all()
        else:
            return Oferta.objects.filter(estado=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        if self.request.user.groups.filter(name="Profesor").exists() or self.request.user.groups.filter(name="Coordinador").exists():
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        

        return Response(status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        if self.request.user.groups.filter(name="Profesor").exists():
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def create(self, request, *args, **kwargs):
        if self.request.user.groups.filter(name="Profesor").exists():
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        if self.request.user.groups.filter(name="Profesor").exists():
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def perform_destroy(self, instance):
        instance.delete()
