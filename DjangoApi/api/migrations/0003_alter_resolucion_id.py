# Generated by Django 5.0.4 on 2024-06-23 06:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_modulo_carrera_modulo_historial_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resolucion',
            name='id',
            field=models.CharField(max_length=25, primary_key=True, serialize=False),
        ),
    ]
