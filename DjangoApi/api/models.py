from typing import Iterable
from django.db import models

from usuarios.models import User
from django.core.exceptions import ValidationError


# clase Modulo
class Modulo(models.Model):
    nombre = models.CharField(max_length=100)
    seccion = models.CharField(max_length=100)
    horas_asignadas = models.IntegerField(default=0)
    profesor_asignado = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    semestre = models.IntegerField(null=True, blank=True)
    anio = models.IntegerField(default=2024)
    carrera = models.CharField(max_length=100, default="ICC")
    solicitud_horas = models.CharField(max_length=250, blank=True)
    historial = models.TextField(blank=True)

    def __str__(self):
        return f"{self.nombre} {self.seccion} {self.anio}-{self.semestre}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["nombre", "seccion", "anio", "semestre"], name="unique_modulo"
            )
        ]
    
    def clean(self):
        # Validar que las horas asignadas sean mayores a 0
        if self.horas_asignadas <= 0:
            raise ValidationError("Las horas asignadas deben ser mayores a 0")
        # Validar que el semestre sea 1 o 2
        if self.semestre not in [1, 2]:
            raise ValidationError("El semestre debe ser 1 o 2")
        # Validar que el año sea un valor de 4 numeros
        if len(str(self.anio)) != 4:
            raise ValidationError("El año debe ser un valor de 4 numeros")
        # Validar que el nombre del módulo no sea vacío
        if self.nombre == "":
            raise ValidationError("El nombre del módulo no puede ser vacío")
        # Validar que la sección no sea vacía
        if self.seccion == "":
            raise ValidationError("La sección no puede ser vacía")
        
        

    def save (self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


# clase oferta
class Oferta(models.Model):
    disponibilidad = models.CharField(
        max_length=100
    )  # horas en las que el estudiante debe estar disponible
    nota_mini = models.FloatField()  # nota minima para postular
    tareas = models.CharField(max_length=255)  # tareas a realizar
    otros = models.CharField(max_length=255, blank=True)  # otros requerimientos
    modulo = models.ForeignKey(Modulo, on_delete=models.CASCADE)
    estado = models.BooleanField(
        default=False
    )  # estado de la oferta, si esta disponible o no
    ayudante = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )  # ayudante asignado a la oferta
    resolucion = models.ForeignKey(
        "Resolucion", on_delete=models.PROTECT, null=True, blank=True
    )  # resolucion asociada a la oferta
    horas_ayudantia = (
        models.IntegerField()
    )  # horas de ayudantia asignadas al estudiante
    observaciones = models.CharField(max_length=500, blank=True)
    fecha_creacion = models.DateField(auto_now_add=True) 

    def __str__(self):
        return f"oferta {self.id} al {self.modulo}"


# clase postulaciones
class Postulacion(models.Model):
    comentario = models.CharField(max_length=255)  # comentario del estudiante
    estado = models.BooleanField(
        default=False
    )  # estado de la postulacion, si fue aceptada o no
    postulante = models.ForeignKey(
        User, on_delete=models.CASCADE
    )  # usuario que postula
    oferta = models.ForeignKey(
        Oferta, on_delete=models.CASCADE
    )  # oferta a la que se postula
    nota_aprobacion = models.FloatField()  # nota con la que se postula
    promedio = models.FloatField(default=0.0)  # promedio del estudiante
    fecha_postulacion = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"postulacion de {self.postulante.nombre_completo} a la oferta {self.oferta}"


# clase Resolucion
class Resolucion(models.Model):  # ya no es una resolucion, es un "Proceso"
    id = models.CharField(primary_key=True, max_length=25)
    precio = models.IntegerField(default=7000)  # precio de la hora
    f_inicio = models.DateField()
    f_termino = models.DateField()
    n_meses = models.IntegerField(default=4)

    def __str__(self):
        return f"Resolucion {self.id}"

    def clean(self):
        # Validar que la fecha de inicio es anterior a la fecha de término
        if self.f_inicio and self.f_termino and self.f_inicio >= self.f_termino:
            raise ValidationError(
                "La fecha de inicio debe ser anterior a la fecha de término"
            )

    def save(self, *args, **kwargs):
        # Llamar al método clean antes de guardar
        self.clean()
        super().save(*args, **kwargs)
