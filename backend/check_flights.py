import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from flights.models import Flight

flights = Flight.objects.all()
print(f"Total flights: {flights.count()}")

if flights.count() > 0:
    for flight in flights:
        print(f"Flight: {flight.flight_number} - {flight.departure_city} to {flight.arrival_city}")
        print(f"  Departure: {flight.departure_time}")
        print(f"  Arrival: {flight.arrival_time}")
        print(f"  Price: {flight.price}")
        print(f"  Available seats: {flight.available_seats}/{flight.total_seats}")
        print()
else:
    print("No flights in the database.") 