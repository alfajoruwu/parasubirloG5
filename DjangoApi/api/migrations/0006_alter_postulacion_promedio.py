# Generated by Django 5.0.4 on 2024-06-11 01:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_postulacion_promedio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='postulacion',
            name='promedio',
            field=models.FloatField(),
        ),
    ]
