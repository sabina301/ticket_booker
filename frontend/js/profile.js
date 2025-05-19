// DOM Elements
const profileInfo = document.getElementById('profileInfo');
const bookingsList = document.getElementById('bookingsList');
const logoutLink = document.getElementById('logoutLink');

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

// Create profile info HTML
function createProfileInfo(user) {
    return `
        <h2>Личная информация</h2>
        <div class="profile-details">
            <div class="profile-detail">
                <h4>Имя пользователя</h4>
                <p>${user.username}</p>
            </div>
            <div class="profile-detail">
                <h4>Email</h4>
                <p>${user.email}</p>
            </div>
            <div class="profile-detail">
                <h4>Дата регистрации</h4>
                <p>${new Date(user.date_joined).toLocaleDateString('ru-RU')}</p>
            </div>
        </div>
    `;
}

// Create booking card HTML
function createBookingCard(booking) {
    const statusClasses = {
        'pending': 'pending',
        'confirmed': 'confirmed',
        'cancelled': 'cancelled'
    };
    
    const statusText = {
        'pending': 'Ожидает подтверждения',
        'confirmed': 'Подтверждено',
        'cancelled': 'Отменено'
    };
    
    return `
        <div class="booking-card">
            <div class="booking-header">
                <h3>Рейс ${booking.ticket_details.flight.flight_number}</h3>
                <span class="booking-status ${statusClasses[booking.status]}">${statusText[booking.status]}</span>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <span>Маршрут</span>
                    <strong>${booking.ticket_details.flight.departure_city} → ${booking.ticket_details.flight.arrival_city}</strong>
                </div>
                <div class="booking-detail">
                    <span>Дата вылета</span>
                    <strong>${formatDate(booking.ticket_details.flight.departure_time)}</strong>
                </div>
                <div class="booking-detail">
                    <span>Место</span>
                    <strong>${booking.ticket_details.seat_number}</strong>
                </div>
                <div class="booking-detail">
                    <span>Стоимость</span>
                    <strong>${formatPrice(booking.total_price)}</strong>
                </div>
            </div>
            <div class="booking-actions">
                ${booking.status === 'pending' ? `
                    <button class="btn-cancel-booking" onclick="cancelBooking(${booking.id})">Отменить</button>
                ` : ''}
                ${booking.status === 'confirmed' ? `
                    <button class="btn-download-ticket" onclick="downloadTicket(${booking.id})">Скачать билет</button>
                ` : ''}
            </div>
        </div>
    `;
}

// Handle booking cancellation
async function cancelBooking(bookingId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }
        
        const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при отмене бронирования');
        }
        
        // Refresh bookings list
        fetchBookings();
        
    } catch (error) {
        alert(error.message);
    }
}

// Handle ticket download
function downloadTicket(bookingId) {
    // This would typically generate a PDF ticket
    alert('Функция скачивания билета будет доступна позже');
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Fetch user profile
async function fetchProfile() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }
        
        const response = await fetch('http://localhost:8000/api/users/me/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при загрузке профиля');
        }
        
        const user = await response.json();
        profileInfo.innerHTML = createProfileInfo(user);
        
    } catch (error) {
        alert(error.message);
    }
}

// Fetch user bookings
async function fetchBookings() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
            return;
        }
        
        const response = await fetch('http://localhost:8000/api/bookings/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при загрузке бронирований');
        }
        
        const bookings = await response.json();
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p class="no-bookings">У вас пока нет бронирований</p>';
            return;
        }
        
        bookingsList.innerHTML = bookings.map(booking => createBookingCard(booking)).join('');
        
    } catch (error) {
        alert(error.message);
    }
}

// Event Listeners
logoutLink.addEventListener('click', handleLogout);

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    fetchBookings();
}); 