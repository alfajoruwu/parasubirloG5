# Generated by Django 5.0.4 on 2024-06-04 00:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_oferta_seccion_alter_oferta_otros'),
    ]

    operations = [
        migrations.AddField(
            model_name='oferta',
            name='observaciones',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]
