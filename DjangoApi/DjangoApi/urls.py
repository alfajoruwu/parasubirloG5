from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("api.urls")),
    path("", include("usuarios.urls")),
    path("docs/", include_docs_urls(title="api ayudantias")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
