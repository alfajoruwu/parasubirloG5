# Generated by Django 5.0.4 on 2024-06-27 03:02

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_resolucion_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='oferta',
            name='fecha_creacion',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='postulacion',
            name='fecha_postulacion',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
