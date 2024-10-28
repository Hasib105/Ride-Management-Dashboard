import json
from channels.generic.websocket import AsyncWebsocketConsumer
from core.models import Driver,Trip
from core.serializers import DriverSerializer

class DriverLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        status = data.get("status", None)

        # Fetch drivers based on the status filter
        if status and status != 'ALL':
            drivers = Driver.objects.filter(status=status)
        else:
            drivers = Driver.objects.all()
        
        # Serialize the driver data
        serializer = DriverSerializer(drivers, many=True)
        
        # Send driver locations back to the client
        await self.send(text_data=json.dumps(serializer.data))

class TripStatisticsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        trip_counts = {
            "total_trips": Trip.objects.count(),
            "in_process_trips": Trip.objects.filter(status="IN_PROCESS").count(),
            "canceled_trips": Trip.objects.filter(status="CANCELED").count(),
            "completed_trips": Trip.objects.filter(status="COMPLETED").count()
        }
        
        await self.send(text_data=json.dumps(trip_counts))