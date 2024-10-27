from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/driver-location/", consumers.DriverLocationConsumer.as_asgi()),
    path("ws/trip-statistics/", consumers.TripStatisticsConsumer.as_asgi()),
]