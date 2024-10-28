from django.contrib import admin
from .models import Driver, Trip, Earning

class DriverAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'status',
        'latitude',
        'longitude',
        'updated_at',
    )

admin.site.register(Driver, DriverAdmin)
admin.site.register(Trip)
admin.site.register(Earning)
