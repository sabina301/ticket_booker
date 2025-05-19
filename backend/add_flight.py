import os
import django
from datetime import datetime, timedelta
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from flights.models import Flight

# Create a flight from Kirov to Moscow
departure_time = datetime.now() + timedelta(days=3)  # 3 days from now
arrival_time = departure_time + timedelta(hours=2)   # 2 hour flight

new_flight = Flight(
    flight_number='KIR123',
    departure_city='Киров',
    arrival_city='Москва',
    departure_time=departure_time,
    arrival_time=arrival_time,
    total_seats=120,
    available_seats=120,
    price=Decimal('5000.00')  # 5000 rubles
)

new_flight.save()

print(f"Added new flight: {new_flight.flight_number} - {new_flight.departure_city} to {new_flight.arrival_city}")
print(f"  Departure: {new_flight.departure_time}")
print(f"  Arrival: {new_flight.arrival_time}")
print(f"  Price: {new_flight.price}")
print(f"  Available seats: {new_flight.available_seats}/{new_flight.total_seats}") 