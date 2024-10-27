

import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Driver, Trip, Earning

class Command(BaseCommand):
    help = "Create sample admin, drivers, trips, and earnings data for testing."

    def handle(self, *args, **kwargs):
        # Create an admin user
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(username="admin", password="admin", email="admin@example.com")
            self.stdout.write(self.style.SUCCESS("Admin user created with username: 'admin' and password: 'admin'"))
        else:
            self.stdout.write(self.style.WARNING("Admin user already exists"))

        # Define possible statuses and locations
        driver_statuses = ['AVAILABLE', 'NOT_AVAILABLE', 'WAY_TO_PICKUP', 'REACHED_PICKUP', 'WAY_TO_DROPOFF']
        trip_statuses = ['IN_PROCESS', 'COMPLETED', 'CANCELED']
        base_lat, base_long = 40.730610, -73.935242  # Base coordinates for NYC area

        # Generate 20 drivers
        drivers = []
        for i in range(1, 21):
            driver_name = f"Driver {i}"
            latitude = base_lat + random.uniform(-0.05, 0.05)
            longitude = base_long + random.uniform(-0.05, 0.05)
            status = random.choice(driver_statuses)

            driver = Driver.objects.create(
                name=driver_name,
                status=status,
                latitude=latitude,
                longitude=longitude
            )
            drivers.append(driver)
            self.stdout.write(self.style.SUCCESS(f"Created {driver_name} with status '{status}'"))

        # Generate trips and earnings for each driver
        for driver in drivers:
            num_trips = random.randint(1, 5)  # Each driver has 1-5 trips

            for _ in range(num_trips):
                start_time = datetime.now() - timedelta(days=random.randint(1, 30), hours=random.randint(1, 12))
                end_time = start_time + timedelta(hours=random.randint(1, 2))
                trip_status = random.choice(trip_statuses)
                pickup_location = f"{random.randint(1, 100)} Main St"
                dropoff_location = f"{random.randint(1, 100)} Elm St"

                # Create the trip
                trip = Trip.objects.create(
                    driver=driver,
                    status=trip_status,
                    pickup_location=pickup_location,
                    dropoff_location=dropoff_location,
                    start_time=start_time,
                    end_time=end_time if trip_status == 'COMPLETED' else None
                )
                self.stdout.write(self.style.SUCCESS(f"Created trip for {driver.name} with status '{trip_status}'"))

                # If the trip is completed, add an earning
                if trip_status == 'COMPLETED':
                    Earning.objects.create(
                        trip=trip,
                        amount=10.00  # Flat rate for admin earnings per completed trip
                    )
                    self.stdout.write(self.style.SUCCESS(f"Earning created for completed trip ID {trip.id}"))

        self.stdout.write(self.style.SUCCESS("Sample data creation completed successfully."))
