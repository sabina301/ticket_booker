// DOM Elements
const flightInfo = document.getElementById('flightInfo');
const seatsGrid = document.getElementById('seatsGrid');
const bookingSummary = document.getElementById('bookingSummary');
const selectedSeatElement = document.getElementById('selectedSeat');
const ticketPriceElement = document.getElementById('ticketPrice');
const bookButton = document.getElementById('bookButton');
const confirmationModal = document.getElementById('confirmationModal');
const confirmBookingBtn = document.getElementById('confirmBooking');
const cancelBookingBtn = document.getElementById('cancelBooking');
const confirmationDetails = document.querySelector('.confirmation-details');

// Get flight ID from URL
const urlParams = new URLSearchParams(window.location.search);
const flightId = urlParams.get('id');

// State
let selectedSeat = null;
let flightData = null;
let tickets = [];

// Format date for display
function formatDate(dateString) {
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('ru-RU', options);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

// Create flight info HTML
function createFlightInfo(flight) {
    return `
        <h2>Информация о рейсе ${flight.flight_number}</h2>
        <div class="flight-route">
            <div class="city">
                <h3>${flight.departure_city}</h3>
                <p>${formatDate(flight.departure_time).split(',')[1]}</p>
                <p>${formatDate(flight.departure_time).split(',')[0]}</p>
            </div>
            <div class="arrow"></div>
            <div class="city">
                <h3>${flight.arrival_city}</h3>
                <p>${formatDate(flight.arrival_time).split(',')[1]}</p>
                <p>${formatDate(flight.arrival_time).split(',')[0]}</p>
            </div>
        </div>
        <div class="flight-details">
            <div class="detail-item">
                <h4>Стоимость</h4>
                <p>${formatPrice(flight.price)}</p>
            </div>
            <div class="detail-item">
                <h4>Свободных мест</h4>
                <p>${flight.available_seats}</p>
            </div>
        </div>
    `;
}

// Create seats grid
function createSeatsGrid(tickets) {
    const rows = Math.ceil(tickets.length / 6);
    let html = '';
    
    for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        const seatClass = ticket.status === 'available' ? 'available' : 'occupied';
        html += `
            <div class="seat ${seatClass}" 
                 data-ticket-id="${ticket.id}" 
                 data-seat-number="${ticket.seat_number}"
                 data-price="${ticket.price}"
                 ${ticket.status !== 'available' ? 'disabled' : ''}>
                ${ticket.seat_number}
            </div>
        `;
    }
    
    return html;
}

// Handle seat selection
function handleSeatClick(event) {
    const seat = event.target;
    if (!seat.classList.contains('seat') || seat.classList.contains('occupied')) {
        return;
    }
    
    // Remove previous selection
    const previousSelected = document.querySelector('.seat.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    // Add new selection
    seat.classList.add('selected');
    selectedSeat = {
        id: seat.dataset.ticketId,
        number: seat.dataset.seatNumber,
        price: seat.dataset.price
    };
    
    // Update booking summary
    selectedSeatElement.textContent = selectedSeat.number;
    ticketPriceElement.textContent = formatPrice(selectedSeat.price);
    bookingSummary.style.display = 'block';
}

// Show confirmation modal
function showConfirmationModal() {
    if (!selectedSeat) return;
    
    confirmationDetails.innerHTML = `
        <p><strong>Рейс:</strong> ${flightData.flight_number}</p>
        <p><strong>Маршрут:</strong> ${flightData.departure_city} → ${flightData.arrival_city}</p>
        <p><strong>Дата вылета:</strong> ${formatDate(flightData.departure_time)}</p>
        <p><strong>Место:</strong> ${selectedSeat.number}</p>
        <p><strong>Стоимость:</strong> ${formatPrice(selectedSeat.price)}</p>
    `;
    
    confirmationModal.style.display = 'block';
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmationModal.style.display = 'none';
}

// Handle booking confirmation
async function handleBookingConfirmation() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            loginModal.style.display = 'block';
            return;
        }
        
        const response = await fetch('http://localhost:8000/api/bookings/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ticket: selectedSeat.id
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при бронировании билета');
        }
        
        const booking = await response.json();
        
        // Redirect to profile page
        window.location.href = '/profile.html';
        
    } catch (error) {
        alert(error.message);
    } finally {
        closeConfirmationModal();
    }
}

// Fetch flight data and tickets
async function fetchFlightData() {
    try {
        // Fetch flight details
        const flightResponse = await fetch(`http://localhost:8000/api/flights/${flightId}/`);
        if (!flightResponse.ok) {
            throw new Error('Ошибка при загрузке информации о рейсе');
        }
        flightData = await flightResponse.json();
        
        // Update flight info
        flightInfo.innerHTML = createFlightInfo(flightData);
        
        // Fetch available tickets
        const ticketsResponse = await fetch(`http://localhost:8000/api/flights/${flightId}/available_tickets/`);
        if (!ticketsResponse.ok) {
            throw new Error('Ошибка при загрузке информации о местах');
        }
        tickets = await ticketsResponse.json();
        
        // Create seats grid
        seatsGrid.innerHTML = createSeatsGrid(tickets);
        
    } catch (error) {
        alert(error.message);
    }
}

// Event Listeners
seatsGrid.addEventListener('click', handleSeatClick);
bookButton.addEventListener('click', showConfirmationModal);
confirmBookingBtn.addEventListener('click', handleBookingConfirmation);
cancelBookingBtn.addEventListener('click', closeConfirmationModal);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === confirmationModal) {
        closeConfirmationModal();
    }
});

// Load data on page load
document.addEventListener('DOMContentLoaded', fetchFlightData); 