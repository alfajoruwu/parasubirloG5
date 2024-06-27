# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
import json
from api.utils import enviar_correo
import random
from django.contrib.auth import logout
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.conf import settings

from .forms import UserCreationForm, UserCreationFormProfesor
from .models import verificar, User


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
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            print("User not found")
            return JsonResponse(
                {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
            )
    return JsonResponse(
        {"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )


@csrf_exempt
def logout_view(request):
    print("logout")
    logout(request)
    response = JsonResponse({"message": "Logout successful"}, status=200)
    response.delete_cookie("access_token")  # Eliminar la cookie de sesión
    response.delete_cookie("refresh_token")  # Eliminar la cookie de sesión
    response.delete_cookie("csrftoken")  # Eliminar la cookie de sesión
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


@csrf_exempt
def password_reset_confirm(request, uidb64=None, token=None):
    print(request.body)
    if uidb64 is not None and token is not None:
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            if request.method == "POST":
                try:
                    data = json.loads(request.body)
                except json.JSONDecodeError:
                    return JsonResponse({"error": "Invalid JSON."}, status=400)

                new_password = data.get("new_password")
                confirm_password = data.get("confirm_password")
                if new_password and confirm_password:
                    if new_password == confirm_password:
                        user.set_password(new_password)
                        user.save()
                        return JsonResponse(
                            {"message": "Password has been reset."}, status=200
                        )
                    else:
                        return JsonResponse(
                            {"error": "Passwords do not match."}, status=400
                        )
                else:
                    print("new", new_password)
                    print("confirm", confirm_password)
                    return JsonResponse(
                        {"error": "New password and confirm password are required."},
                        status=400,
                    )
            return JsonResponse(
                {"message": "Token is valid. You can now reset your password."},
                status=200,
            )
        else:
            return JsonResponse({"error": "Invalid or expired token."}, status=400)
    return JsonResponse({"error": "Invalid request."}, status=400)


@csrf_exempt
def password_reset_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        email = data.get("email")
        if email:
            associated_users = User.objects.filter(email=email)
            if associated_users.exists():
                for user in associated_users:
                    token = default_token_generator.make_token(user)
                    uid = urlsafe_base64_encode(force_bytes(user.pk))
                    url = f"{settings.FRONTEND_URL}/reset/{uid}/{token}/"
                    message = f"Hi {user.run},\nClick the link below to reset your password:\n{url}"
                    enviar_correo(user.email, "Password reset request", message)
            return JsonResponse(
                {"message": "Password reset email has been sent."}, status=200
            )
        else:
            return JsonResponse({"error": "Email is required."}, status=400)
    return JsonResponse({"error": "Invalid request method."}, status=405)
