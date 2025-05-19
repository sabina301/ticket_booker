from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Flight, Ticket, Booking
from .serializers import FlightSerializer, TicketSerializer, BookingSerializer

# Create your views here.

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Flight.objects.all()
        departure_city = self.request.query_params.get('departure_city', None)
        arrival_city = self.request.query_params.get('arrival_city', None)
        departure_date = self.request.query_params.get('departure_date', None)

        if departure_city:
            queryset = queryset.filter(departure_city__icontains=departure_city)
        if arrival_city:
            queryset = queryset.filter(arrival_city__icontains=arrival_city)
        if departure_date:
            queryset = queryset.filter(departure_time__date=departure_date)

        return queryset

    @action(detail=True, methods=['get'])
    def available_tickets(self, request, pk=None):
        flight = self.get_object()
        tickets = Ticket.objects.filter(flight=flight, status='available')
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Ticket.objects.all()
        flight_id = self.request.query_params.get('flight_id', None)
        if flight_id is not None:
            queryset = queryset.filter(flight_id=flight_id)
        return queryset

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        ticket = get_object_or_404(Ticket, id=self.request.data.get('ticket'))
        if ticket.status != 'available':
            raise serializers.ValidationError("This ticket is not available")
        
        ticket.status = 'reserved'
        ticket.save()
        
        serializer.save(
            user=self.request.user,
            total_price=ticket.price
        )
