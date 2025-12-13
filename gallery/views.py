from django.http import HttpResponse
from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render
from .models import Photo, LatestPhoto, Calendar, SliderHome


def home(request):
    photos = LatestPhoto.objects.all()
    photos2 = SliderHome.objects.all()
    calendar = Calendar.objects.all()  # all calendar entries
    context = {
        'photos': photos,
        'photos2': photos2,
        'calendar': calendar,
    }
    return render(request, 'index.html', context)


# Gallery
def en_gallery(request):
    photos = Photo.objects.all()
    return render(request, "EN/gallery.html", {"photos": photos})


def sk_gallery(request):
    photos = Photo.objects.all()
    return render(request, "SK/gallery.html", {"photos": photos})


# EN pages
def en_author(request):
    return render(request, 'EN/author.html')


def en_calendar25(request):
    return render(request, 'EN/calendar25.html')

def en_calendar26(request):
    return render(request, 'EN/calendar26.html')


def en_footer(request):
    return render(request, 'EN/footer.html')


def en_home(request):
    photos = LatestPhoto.objects.all()
    photos2 = SliderHome.objects.all()
    calendar = Calendar.objects.all()  # all calendar entries
    context = {
        'photos': photos,
        'photos2': photos2,
        'calendar': calendar,
    }
    return render(request, 'EN/home.html', context)


def en_info_about_licence(request):
    return render(request, 'EN/info_about_licence.html')


def en_terms_and_conditions(request):
    return render(request, 'EN/terms-and-conditions.html')


def en_thankyousite(request):
    return render(request, 'EN/thankyousite.html')


def en_write_us(request):
    return render(request, 'EN/write us.html')


def en_footer(request):
    return render(request, 'EN/footer.html')


# SK pages
def sk_author(request):
    return render(request, 'SK/author.html')


def sk_calendar25(request):
    return render(request, 'SK/calendar25.html')

def sk_calendar26(request):
    return render(request, 'SK/calendar26.html')


def sk_footer(request):
    return render(request, 'SK/footer.html')


def sk_home(request):
    photos = LatestPhoto.objects.all()
    photos2 = SliderHome.objects.all()
    calendar = Calendar.objects.all()  # all calendar entries
    context = {
        'photos': photos,
        'photos2': photos2,
        'calendar': calendar,
    }
    return render(request, 'SK/home.html', context)


def sk_info_about_licence(request):
    return render(request, 'SK/info_about_licence.html')


def sk_terms_and_conditions(request):
    return render(request, 'SK/terms-and-conditions.html')


def sk_thankyousite(request):
    return render(request, 'SK/thankyousite.html')


def sk_write_us(request):
    return render(request, 'SK/write us.html')


def sk_footer(request):
    return render(request, 'SK/footer.html')

@csrf_exempt  
def send_email(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            sender_email = data.get("email")
            message_body = data.get("message")

            send_mail(
                subject="Správa z fbwildlife.com",
                message=f"Od: {sender_email}\n\n{message_body}",
                from_email=sender_email,
                recipient_list=["xxx@gmail.com"],  # tu ide kam to má prísť
                fail_silently=False,
            )

            return JsonResponse({"status": "success"})
        except Exception as e:
            print("Chyba pri odosielaní:", e)
            return JsonResponse({"status": "error"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)

def sitemap_view(request):
    pages = [
        '',  # homepage
        'EN/home.html',
        'SK/home.html',
        'EN/gallery.html',
        'SK/gallery.html',
        'EN/author.html',
        'SK/author.html',
        'EN/calendar25.html',
        'EN/calendar26.html',
        'SK/calendar25.html',
        'SK/calendar26.html',
    ]

    urls = []
    for page in pages:
        urls.append(f"""
   <url>
      <loc>https://filipbajacek.com/{page}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
   </url>
""")

    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{''.join(urls)}
</urlset>
"""

    return HttpResponse(sitemap_xml, content_type="application/xml")

