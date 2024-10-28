from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/driver-location/", consumers.DriverLocationConsumer.as_asgi()),
]