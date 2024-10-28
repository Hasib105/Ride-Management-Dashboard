import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DriverLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        status = data.get("status", None)

        # Import models here to avoid AppRegistryNotReady
        from core.models import Driver
        from core.serializers import DriverSerializer

        # Fetch drivers based on the status filter
        if status and status != 'ALL':
            drivers = Driver.objects.filter(status=status)
        else:
            drivers = Driver.objects.all()
        
        # Serialize the driver data
        serializer = DriverSerializer(drivers, many=True)
        
        # Send driver locations back to the client
        await self.send(text_data=json.dumps(serializer.data))
        
        # Send the updated driver status to the client
        await self.send(text_data=json.dumps({"status": status}))

class TripStatisticsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # Import models here to avoid AppRegistryNotReady
        from core.models import Trip

        trip_counts = {
            "total_trips": await Trip.objects.count(),
            "in_process_trips": await Trip.objects.filter(status="IN_PROCESS").count(),
            "canceled_trips": await Trip.objects.filter(status="CANCELED").count(),
            "completed_trips": await Trip.objects.filter(status="COMPLETED").count()
        }
        
        await self.send(text_data=json.dumps(trip_counts))