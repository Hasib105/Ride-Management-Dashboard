# core/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from core.models import Driver
from core.serializers import DriverSerializer

class DriverLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "driver_location_group"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        status = data.get("status", None)

        drivers = await self.get_drivers(status)
        serializer = DriverSerializer(drivers, many=True)

        await self.send(text_data=json.dumps(serializer.data))

    async def driver_location_update(self, event):
        """Receive updates for driver locations."""
        message = event['message']
        await self.send(text_data=message)

    @database_sync_to_async
    def get_drivers(self, status):
        if status and status != 'ALL':
            return list(Driver.objects.filter(status=status))
        else:
            return list(Driver.objects.all())