from django.urls import path
from . import views

urlpatterns = [
    path("", views.en_gallery, name="gallery"),
    path('EN/gallery.html', views.en_gallery, name="en_gallery"),
    path('EN/home.html', views.en_home, name='en_home'),
    path('SK/home.html', views.sk_home, name='sk_home'),
    path('index.html', views.home, name='home'),
]