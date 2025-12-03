from django.db import models

class Photo(models.Model):
    title_EN = models.CharField(max_length=100, default="title")
    title_SK = models.CharField(max_length=100, default="title")
    title_LT = models.CharField(max_length=100, default="title")
    number = models.IntegerField(default=0)
    src = models.CharField(max_length=2083)

    class Meta:
        ordering = ['-number']
        verbose_name = "Photo"
        verbose_name_plural = "Gallery - PHOTOS"

    def __str__(self):
        return f"{self.number} - {self.title_EN} - {self.title_SK}"

class LatestPhoto(models.Model):
    number = models.IntegerField(default="0")
    src = models.CharField(max_length=2083)

    class Meta:
        verbose_name = "Photo"
        verbose_name_plural = "Home - Latest photos"

class Calendar(models.Model):
    title_EN = models.CharField(max_length=100)
    subtitle_EN = models.CharField(max_length=200)
    title_SK = models.CharField(max_length=100)
    subtitle_SK = models.CharField(max_length=200)
    src = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Calendar"
        verbose_name_plural = "Home - Calendar"

class SliderHome(models.Model):
    number = models.IntegerField(default="0")
    src = models.CharField(max_length=2083)

    class Meta:
        verbose_name = "Photo"
        verbose_name_plural = "Home - Slider at the bottom"
