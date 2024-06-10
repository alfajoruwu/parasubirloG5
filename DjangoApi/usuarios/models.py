from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
    Group,
)


# Create your CustomUserManager here.
class CustomUserManager(BaseUserManager):
    def _create_user(self, password, run, **extra_fields):
        if not password:
            raise ValueError("Contraseña no puede ser vacía.")

        user = self.model(
            run=run,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)

        # Obtener el grupo del usuario, por defecto "Estudiante"
        group_name = extra_fields.get("group", "Estudiante")
        group, _ = Group.objects.get_or_create(name=group_name)
        user.groups.add(group)

        return user

    def create_user(self, password, run, **extra_fields):
        # busca codigo de verificacion
        codigo = verificar.objects.filter(codigo=extra_fields.pop("codigo"))
        print(codigo)
        if not codigo.exists() and codigo.correo != extra_fields.get("email"):
            raise ValueError("Codigo de verificacion no valido")
        codigo = codigo.first()

        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", False)

        return self._create_user(password, run, **extra_fields)

    def create_superuser(self, password, run, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(password, run, **extra_fields)


# Create your User Model here.
class User(AbstractBaseUser, PermissionsMixin):
    # Abstractbaseuser has password, last_login, is_active by default

    run = models.CharField(max_length=13, unique=True)
    nombre_completo = models.CharField(max_length=100)
    email = models.EmailField(db_index=True, unique=True, max_length=254)
    otro_contacto = models.CharField(max_length=100, blank=True)
    matricula = models.CharField(max_length=12, blank=True)
    tipo_cuenta = models.CharField(max_length=20, blank=True)
    n_cuenta = models.CharField(max_length=20, blank=True)
    banco = models.CharField(max_length=50, blank=True)
    n_contacto = models.CharField(max_length=12, blank=True)
    horas_aceptadas = models.IntegerField(default=0)
    riesgo_academico = models.BooleanField(default=False)
    charla = models.BooleanField(default=False)

    is_staff = models.BooleanField(
        default=True
    )  # must needed, otherwise you won't be able to loginto django-admin.
    is_active = models.BooleanField(
        default=True
    )  # must needed, otherwise you won't be able to loginto django-admin.
    is_superuser = models.BooleanField(
        default=False
    )  # this field we inherit from PermissionsMixin.

    objects = CustomUserManager()

    USERNAME_FIELD = "run"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"


# modelo para verificar
class verificar(models.Model):
    correo = models.EmailField(max_length=100)
    codigo = models.CharField(max_length=100)
    fecha = models.DateTimeField(auto_now_add=True)
