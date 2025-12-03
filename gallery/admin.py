from django.contrib import admin
from .models import Photo, LatestPhoto, SliderHome, Calendar
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin


class PhotoResource(resources.ModelResource):
    class Meta:
        model = Photo
        import_id_fields = ('number',)
        fields = ('number', 'title_EN', 'title_SK', 'title_LT', 'src')


@admin.register(Photo)
class PhotoAdmin(ImportExportActionModelAdmin):
    resource_class = PhotoResource
    list_display = ('number', 'title_EN', 'title_SK', 'title_LT', 'src')


class LatestPhotoAdmin(admin.ModelAdmin):
    list_display = ("number", "src")


class SliderHomeAdmin(admin.ModelAdmin):
    list_display = ("number", "src")


class CalendarAdmin(admin.ModelAdmin):
    list_display = ("title_EN", "subtitle_EN", "src")

admin.site.register(LatestPhoto, LatestPhotoAdmin)
admin.site.register(SliderHome, SliderHomeAdmin)
admin.site.register(Calendar, CalendarAdmin)
