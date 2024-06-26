# Generated by Django 5.0.4 on 2024-06-25 04:02

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_resolucion_id'),
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
        migrations.AlterField(
            model_name='resolucion',
            name='id',
            field=models.CharField(max_length=25, primary_key=True, serialize=False),
        ),
    ]
