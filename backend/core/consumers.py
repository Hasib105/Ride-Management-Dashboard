import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from core.models import Driver
from core.serializers import DriverSerializer
from django.db.models import Count

class DriverLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "driver_location_group"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Send initial status counts on connect
        await self.send_status_counts()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        status = data.get("status", None)

        # Fetch driver locations based on status
        drivers = await self.get_drivers(status)
        serializer = DriverSerializer(drivers, many=True)

        # Send driver data to WebSocket
        await self.send(text_data=json.dumps({"type": "drivers", "data": serializer.data}))

        # Optionally, send status counts here as well if needed
        await self.send_status_counts()

    async def driver_location_update(self, event):
        """Receive updates for driver locations and broadcast status counts."""
        message = event['message']
        
        # Send driver location updates to the WebSocket
        await self.send(text_data=message)
        
        # Update status counts after sending driver updates
        await self.send_status_counts()
        

    async def send_status_counts(self):
        """Fetch and send status counts to the WebSocket."""
        counts = await self.get_status_counts()
        await self.send(text_data=json.dumps({"type": "status_counts", "data": counts}))

    @database_sync_to_async
    def get_drivers(self, status):
        if status and status != 'ALL':
            return list(Driver.objects.filter(status=status))
        else:
            return list(Driver.objects.all())

    @database_sync_to_async
    def get_status_counts(self):
        """Fetches the count of drivers by status."""
        counts = Driver.objects.values('status').annotate(count=Count('status'))
        return {item['status']: item['count'] for item in counts}
