# Generated by Django 5.0.4 on 2024-06-27 03:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0003_user_promedio'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='horas_aceptadas',
        ),
    ]
