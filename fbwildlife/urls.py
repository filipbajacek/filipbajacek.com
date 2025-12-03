"""
URL configuration for fbwildlife project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from gallery import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("gallery/", include("gallery.urls")),
    path('', views.home, name='home'),

    # Gallery

    path("EN/gallery.html", views.en_gallery, name="en_gallery"),
    path("SK/gallery.html", views.sk_gallery, name="sk_gallery"),

    # EN pages
    path("EN/gallery.html", views.en_gallery, name="en_gallery"),
    path("EN/author.html", views.en_author, name="en_author"),
    path("EN/calendar25.html", views.en_calendar25, name="en_calendar25"),
    path("EN/calendar26.html", views.en_calendar26, name="en_calendar26"),
    path("EN/footer.html", views.en_footer, name="en_footer"),
    path("EN/home.html", views.en_home, name="en_home"),
    path("EN/info_about_licence.html", views.en_info_about_licence, name="en_info_about_licence"),
    path("EN/terms-and-conditions.html", views.en_terms_and_conditions, name="en_terms_and_conditions"),
    path("EN/thankyousite.html", views.en_thankyousite, name="en_thankyousite"),
    path("EN/write us.html", views.en_write_us, name="en_write_us"),
    path("EN/footer.html", views.en_footer, name="en_footer"),

    # SK pages
    path("SK/gallery.html", views.sk_gallery, name="sk_gallery"),
    path("SK/author.html", views.sk_author, name="sk_author"),
    path("SK/calendar25.html", views.sk_calendar25, name="sk_calendar25"),
    path("SK/calendar26.html", views.sk_calendar26, name="sk_calendar26"),
    path("SK/footer.html", views.sk_footer, name="sk_footer"),
    path("SK/home.html", views.sk_home, name="sk_home"),
    path("SK/info_about_licence.html", views.sk_info_about_licence, name="sk_info_about_licence"),
    path("SK/terms-and-conditions.html", views.sk_terms_and_conditions, name="sk_terms_and_conditions"),
    path("SK/thankyousite.html", views.sk_thankyousite, name="sk_thankyousite"),
    path("SK/write us.html", views.sk_write_us, name="sk_write_us"),
    path("SK/footer.html", views.en_footer, name="sk_footer"),

    #messages
    path("send-email/", views.send_email, name="send_email"),
]
