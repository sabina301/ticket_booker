from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import Flight, Ticket, Booking

User = get_user_model()

class FlightModelTest(TestCase):
    def setUp(self):
        """Создаем тестовый рейс"""
        self.departure_time = timezone.now() + timedelta(days=1)
        self.arrival_time = self.departure_time + timedelta(hours=2)
        self.flight = Flight.objects.create(
            flight_number='TEST123',
            departure_city='Moscow',
            arrival_city='St. Petersburg',
            departure_time=self.departure_time,
            arrival_time=self.arrival_time,
            total_seats=100,
            available_seats=100,
            price=5000.00
        )

    def test_flight_creation(self):
        """Тест создания рейса"""
        self.assertEqual(self.flight.flight_number, 'TEST123')
        self.assertEqual(self.flight.departure_city, 'Moscow')
        self.assertEqual(self.flight.arrival_city, 'St. Petersburg')
        self.assertEqual(self.flight.total_seats, 100)
        self.assertEqual(self.flight.available_seats, 100)
        self.assertEqual(self.flight.price, 5000.00)

    def test_flight_str_method(self):
        """Тест строкового представления рейса"""
        expected_str = 'TEST123 - Moscow to St. Petersburg'
        self.assertEqual(str(self.flight), expected_str)

class TicketModelTest(TestCase):
    def setUp(self):
        """Создаем тестовый рейс и билет"""
        self.departure_time = timezone.now() + timedelta(days=1)
        self.arrival_time = self.departure_time + timedelta(hours=2)
        self.flight = Flight.objects.create(
            flight_number='TEST123',
            departure_city='Moscow',
            arrival_city='St. Petersburg',
            departure_time=self.departure_time,
            arrival_time=self.arrival_time,
            total_seats=100,
            available_seats=100,
            price=5000.00
        )
        self.ticket = Ticket.objects.create(
            flight=self.flight,
            seat_number='A1',
            price=5000.00
        )

    def test_ticket_creation(self):
        """Тест создания билета"""
        self.assertEqual(self.ticket.flight, self.flight)
        self.assertEqual(self.ticket.seat_number, 'A1')
        self.assertEqual(self.ticket.status, 'available')
        self.assertEqual(self.ticket.price, 5000.00)

    def test_ticket_str_method(self):
        """Тест строкового представления билета"""
        expected_str = f'Ticket A1 for {self.flight}'
        self.assertEqual(str(self.ticket), expected_str)

    def test_ticket_status_choices(self):
        """Тест изменения статуса билета"""
        self.ticket.status = 'reserved'
        self.ticket.save()
        self.assertEqual(self.ticket.status, 'reserved')

class BookingModelTest(TestCase):
    def setUp(self):
        """Создаем тестового пользователя, рейс, билет и бронирование"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.departure_time = timezone.now() + timedelta(days=1)
        self.arrival_time = self.departure_time + timedelta(hours=2)
        self.flight = Flight.objects.create(
            flight_number='TEST123',
            departure_city='Moscow',
            arrival_city='St. Petersburg',
            departure_time=self.departure_time,
            arrival_time=self.arrival_time,
            total_seats=100,
            available_seats=100,
            price=5000.00
        )
        self.ticket = Ticket.objects.create(
            flight=self.flight,
            seat_number='A1',
            price=5000.00
        )
        self.booking = Booking.objects.create(
            user=self.user,
            ticket=self.ticket,
            total_price=5000.00
        )

    def test_booking_creation(self):
        """Тест создания бронирования"""
        self.assertEqual(self.booking.user, self.user)
        self.assertEqual(self.booking.ticket, self.ticket)
        self.assertEqual(self.booking.status, 'pending')
        self.assertEqual(self.booking.total_price, 5000.00)

    def test_booking_str_method(self):
        """Тест строкового представления бронирования"""
        expected_str = f'Booking {self.booking.id} - testuser - Ticket A1 for {self.flight}'
        self.assertEqual(str(self.booking), expected_str)

    def test_booking_status_choices(self):
        """Тест изменения статуса бронирования"""
        self.booking.status = 'confirmed'
        self.booking.save()
        self.assertEqual(self.booking.status, 'confirmed')
