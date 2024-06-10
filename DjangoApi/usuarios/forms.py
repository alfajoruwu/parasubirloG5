# forms.py
from django import forms
from .models import User


class UserCreationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    codigo = forms.CharField(max_length=6)

    class Meta:
        model = User
        fields = [
            "run",
            "nombre_completo",
            "email",
            "codigo",
        ]

    def save(self, commit=True):
        User.objects.create_user(
            password=self.cleaned_data["password"],
            run=self.cleaned_data["run"],
            nombre_completo=self.cleaned_data["nombre_completo"],
            email=self.cleaned_data["email"],
            codigo=self.cleaned_data["codigo"],
        )


class CustomUserChangeForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = [
            "run",
            "nombre_completo",
            "email",
            "otro_contacto",
            "matricula",
            "tipo_cuenta",
            "n_cuenta",
            "banco",
            "n_contacto",
            "horas_aceptadas",
            "riesgo_academico",
            "charla",
        ]

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user
