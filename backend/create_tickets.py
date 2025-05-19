import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from flights.models import Flight, Ticket

# Get the flight
try:
    flight = Flight.objects.get(flight_number='KIR123')
    print(f"Found flight: {flight.flight_number} - {flight.departure_city} to {flight.arrival_city}")
    
    # Define seat arrangement (6 seats per row, 20 rows)
    rows = 20
    seats_per_row = 6
    seat_letters = ['A', 'B', 'C', 'D', 'E', 'F']
    
    # Check if tickets already exist
    existing_tickets = Ticket.objects.filter(flight=flight).count()
    if existing_tickets > 0:
        print(f"This flight already has {existing_tickets} tickets. Skipping ticket creation.")
    else:
        # Create tickets
        tickets_created = 0
        for row in range(1, rows + 1):
            for seat_idx, letter in enumerate(seat_letters):
                seat_number = f"{row}{letter}"
                ticket = Ticket(
                    flight=flight,
                    seat_number=seat_number,
                    status='available',
                    price=flight.price  # Use the flight's price
                )
                ticket.save()
                tickets_created += 1
                
        print(f"Created {tickets_created} tickets for flight {flight.flight_number}")
        
except Flight.DoesNotExist:
    print("Flight with number KIR123 not found. Please create the flight first.") 