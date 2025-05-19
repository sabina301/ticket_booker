from django.contrib import admin
from .models import Flight, Ticket, Booking

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('flight_number', 'departure_city', 'arrival_city', 
                   'departure_time', 'arrival_time', 'available_seats', 'price')
    list_filter = ('departure_city', 'arrival_city', 'departure_time')
    search_fields = ('flight_number', 'departure_city', 'arrival_city')

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('flight', 'seat_number', 'status', 'price')
    list_filter = ('status', 'flight')
    search_fields = ('seat_number', 'flight__flight_number')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'ticket', 'status', 'booking_date', 'total_price')
    list_filter = ('status', 'booking_date')
    search_fields = ('user__username', 'ticket__flight__flight_number')
