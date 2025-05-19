from rest_framework import serializers
from .models import Flight, Ticket, Booking

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    flight_details = FlightSerializer(source='flight', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'flight', 'flight_details', 'seat_number', 'status', 'price', 'created_at', 'updated_at']

class BookingSerializer(serializers.ModelSerializer):
    ticket_details = TicketSerializer(source='ticket', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'user', 'user_email', 'ticket', 'ticket_details', 'status', 
                 'booking_date', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['user', 'total_price'] 