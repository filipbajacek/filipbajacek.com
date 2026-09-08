from django.contrib import admin
from .models import Photo, LatestPhoto, SliderHome, Calendar
from import_export import resources
from import_export.admin import ImportExportActionModelAdmin


# ---------- Photo ----------

class PhotoResource(resources.ModelResource):
    class Meta:
        model = Photo
        import_id_fields = ('number',)
        fields = ('number', 'title_EN', 'title_SK', 'title_LT', 'src')


@admin.register(Photo)
class PhotoAdmin(ImportExportActionModelAdmin):
    resource_class = PhotoResource
    list_display = ('number', 'title_EN', 'title_SK', 'title_LT', 'src')


# ---------- LatestPhoto ----------

class LatestPhotoResource(resources.ModelResource):
    class Meta:
        model = LatestPhoto
        fields = ('number', 'src')


@admin.register(LatestPhoto)
class LatestPhotoAdmin(ImportExportActionModelAdmin):
    resource_class = LatestPhotoResource
    list_display = ('number', 'src')


# ---------- SliderHome ----------

class SliderHomeResource(resources.ModelResource):
    class Meta:
        model = SliderHome
        fields = ('number', 'src')


@admin.register(SliderHome)
class SliderHomeAdmin(ImportExportActionModelAdmin):
    resource_class = SliderHomeResource
    list_display = ('number', 'src')


# ---------- Calendar ----------

class CalendarResource(resources.ModelResource):
    class Meta:
        model = Calendar
        fields = ('title_EN', 'subtitle_EN', 'src')


@admin.register(Calendar)
class CalendarAdmin(ImportExportActionModelAdmin):
    resource_class = CalendarResource
    list_display = ('title_EN', 'subtitle_EN', 'src')
