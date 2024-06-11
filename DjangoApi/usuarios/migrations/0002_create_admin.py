import os
from django.db import migrations


def create_superuser(apps, schema_editor):
    User = apps.get_model("auth", "User")
    username = os.getenv("SUPERUSER_USERNAME", "admin")
    email = os.getenv("SUPERUSER_EMAIL", "admin@example.com")
    password = os.getenv("SUPERUSER_PASSWORD", "admin_password")
    User.objects.create_superuser(username=username, email=email, password=password)


class Migration(migrations.Migration):
    dependencies = [
        ("usuarios", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
