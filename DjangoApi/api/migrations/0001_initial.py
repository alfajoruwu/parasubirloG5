# Generated by Django 5.0.4 on 2024-05-26 20:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Resolucion',
            fields=[
                ('id', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('precio', models.IntegerField(default=7000)),
                ('f_inicio', models.DateField()),
                ('f_termino', models.DateField()),
                ('n_meses', models.IntegerField(default=4)),
            ],
        ),
        migrations.CreateModel(
            name='Modulo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('seccion', models.CharField(max_length=100)),
                ('horas_asignadas', models.IntegerField(default=0)),
                ('semestre', models.IntegerField(blank=True, null=True)),
                ('anio', models.IntegerField(default=2024)),
                ('profesor_asignado', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Oferta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('disponibilidad', models.CharField(max_length=100)),
                ('nota_mini', models.FloatField()),
                ('tareas', models.CharField(max_length=255)),
                ('otros', models.CharField(max_length=255)),
                ('seccion', models.CharField(max_length=100)),
                ('estado', models.BooleanField(default=False)),
                ('horas_ayudantia', models.IntegerField()),
                ('ayudante', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('modulo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.modulo')),
                ('resolucion', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='api.resolucion')),
            ],
        ),
        migrations.CreateModel(
            name='Postulacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comentario', models.CharField(max_length=255)),
                ('estado', models.BooleanField(default=False)),
                ('nota_aprobacion', models.FloatField()),
                ('oferta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.oferta')),
                ('postulante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
