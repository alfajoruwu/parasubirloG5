# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
import json
from api.utils import enviar_correo
from .forms import UserCreationForm
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import verificar
import random


@csrf_exempt
def create_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Solicitud JSON no válida."}, status=400)

        form = UserCreationForm(data)
        if form.is_valid():
            form.save()
            return JsonResponse(
                {"message": "Usuario creado exitosamente."},
                status=status.HTTP_201_CREATED,
            )
        else:
            return JsonResponse(
                {"errors": form.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    return JsonResponse(
        {"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )


@csrf_exempt
def correo(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            destinatario = data.get("destinatario")
            if destinatario is None:
                return JsonResponse({"error": "Faltan campos requeridos."}, status=400)

            codigo = verificar.objects.create()
            codigo.correo = destinatario
            codigo.codigo = random.randint(100000, 999999)
            codigo.save()
            enviar_correo(
                destinatario,
                "verificar cuenta utal",
                "tu codigo es: " + str(codigo.codigo),
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Solicitud JSON no válida."}, status=400)
        return JsonResponse({"message": "Correo enviado exitosamente."})
    return JsonResponse(
        {"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )
