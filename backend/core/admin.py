from django.contrib import admin
from .models import Driver, Trip, Earning
# Register your models here.
admin.site.register(Driver)
admin.site.register(Trip)
admin.site.register(Earning)