// DOM Elements
const searchSummary = document.getElementById('searchSummary');
const flightsList = document.getElementById('flightsList');

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

// Format price for display
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
    }).format(price);
}

// Create flight card HTML
function createFlightCard(flight) {
    return `
        <div class="flight-card">
            <div class="flight-header">
                <h3>${flight.flight_number}</h3>
                <span class="price">${formatPrice(flight.price)}</span>
            </div>
            <div class="flight-details">
                <div class="departure">
                    <p class="time">${formatDate(flight.departure_time).split(',')[1]}</p>
                    <p class="city">${flight.departure_city}</p>
                    <p class="date">${formatDate(flight.departure_time).split(',')[0]}</p>
                </div>
                <div class="flight-duration">
                    <div class="line"></div>
                </div>
                <div class="arrival">
                    <p class="time">${formatDate(flight.arrival_time).split(',')[1]}</p>
                    <p class="city">${flight.arrival_city}</p>
                    <p class="date">${formatDate(flight.arrival_time).split(',')[0]}</p>
                </div>
            </div>
            <div class="flight-footer">
                <p class="seats">Свободных мест: ${flight.available_seats}</p>
                <button class="btn-select" onclick="selectFlight(${flight.id})">Выбрать</button>
            </div>
        </div>
    `;
}

// Handle flight selection
function selectFlight(flightId) {
    // Проверяем авторизацию
    const token = localStorage.getItem('token');
    if (!token) {
        loginModal.style.display = 'block';
        return;
    }
    
    // Переходим на страницу выбора места
    window.location.href = `/flight-details.html?id=${flightId}`;
}

// Get search parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const departureCity = urlParams.get('departure_city');
const arrivalCity = urlParams.get('arrival_city');
const departureDate = urlParams.get('departure_date');

// Update search summary
searchSummary.innerHTML = `
    <p>
        <strong>${departureCity}</strong> → 
        <strong>${arrivalCity}</strong><br>
        Дата вылета: <strong>${new Date(departureDate).toLocaleDateString('ru-RU')}</strong>
    </p>
`;

// Fetch flights
async function fetchFlights() {
    try {
        const response = await fetch(`http://localhost:8000/api/flights/?departure_city=${departureCity}&arrival_city=${arrivalCity}&departure_date=${departureDate}`);
        
        if (!response.ok) {
            throw new Error('Ошибка при загрузке рейсов');
        }
        
        const data = await response.json();
        
        // Extract flights data based on API response format
        // The API is returning a paginated response with results array
        let flights;
        
        if (Array.isArray(data)) {
            // Direct array response
            flights = data;
        } else if (data.results && Array.isArray(data.results)) {
            // Django REST Framework paginated response
            flights = data.results;
        } else if (data.flights && Array.isArray(data.flights)) {
            // Object with flights property
            flights = data.flights;
        } else {
            console.error('Unknown API response format:', data);
            flightsList.innerHTML = '<p class="error">Ошибка формата данных от сервера</p>';
            return;
        }
        
        if (flights.length === 0) {
            flightsList.innerHTML = '<p class="no-results">На выбранную дату рейсов не найдено</p>';
            return;
        }
        
        flightsList.innerHTML = flights.map(flight => createFlightCard(flight)).join('');
        
    } catch (error) {
        console.error('Error fetching flights:', error);
        flightsList.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// Load flights on page load
document.addEventListener('DOMContentLoaded', fetchFlights); 