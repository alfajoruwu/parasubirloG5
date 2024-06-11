# admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from .forms import UserCreationForm, CustomUserChangeForm


class CustomUserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ["run", "nombre_completo", "email", "is_staff", "is_active"]
    list_filter = ["is_staff", "is_active"]
    fieldsets = (
        (None, {"fields": ("run", "password")}),
        (
            "Personal Info",
            {
                "fields": (
                    "nombre_completo",
                    "email",
                    "otro_contacto",
                    "matricula",
                    "tipo_cuenta",
                    "n_cuenta",
                    "banco",
                    "n_contacto",
                    "horas_aceptadas",
                    "riesgo_academico",
                    "charla",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_active",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "run",
                    "nombre_completo",
                    "email",
                    "password",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )
    search_fields = ("run", "email", "nombre_completo")
    ordering = ("run",)


admin.site.register(User, CustomUserAdmin)
