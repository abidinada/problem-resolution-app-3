"""
URL configuration for problem_resolution project.
"""
from django.contrib import admin
from django.urls import path, include
from api.views_home import home

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

