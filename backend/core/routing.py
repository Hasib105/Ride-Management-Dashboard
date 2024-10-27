from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/drivers/", consumers.DriverConsumer.as_asgi()),  # WebSocket URL for driver updates
]