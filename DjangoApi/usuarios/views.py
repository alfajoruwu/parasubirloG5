# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
import json
from api.utils import enviar_correo
from .forms import UserCreationForm, UserCreationFormProfesor
from .models import verificar, User
import random
from django.contrib.auth import logout


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

@csrf_exempt
def delete_user(request, user_id):
    if request.method == "DELETE":
        try:
            user = User.objects.get(id=user_id)
            user.delete()

            return JsonResponse(
                {"message": "Usuario eliminado exitosamente."},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            print("User not found")
            return JsonResponse(
                {"error": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
    return JsonResponse(
        {"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )
@csrf_exempt
def logout_view(request):
    print("logout")
    logout(request)
    response = JsonResponse({'message': 'Logout successful'}, status=200)
    response.delete_cookie('access_token')  # Eliminar la cookie de sesión
    response.delete_cookie('refresh_token')  # Eliminar la cookie de sesión
    response.delete_cookie('csrftoken')  # Eliminar la cookie de sesión
    return response

@csrf_exempt
def create_user_profesor_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Solicitud JSON no válida."}, status=400)

        form = UserCreationFormProfesor(data)
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