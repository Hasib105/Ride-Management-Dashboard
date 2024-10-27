import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DriverConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join a group where all driver updates will be broadcasted
        await self.channel_layer.group_add("driver_updates", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard("driver_updates", self.channel_name)

    # Receive a message from the WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)

    async def driver_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))
