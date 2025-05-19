// Initialize search form
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) {
        console.error('Search form not found, not initializing search functionality.');
        return; // If no search form, no need to proceed with its specific logic
    }

    // Set minimum date for departure date input
    const departureDateInput = document.getElementById('departDate');
    console.log(departureDateInput);
    if (departureDateInput) { // Only proceed if the element exists
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Format date as YYYY-MM-DD
        const formattedDate = tomorrow.toISOString().split('T')[0];
        departureDateInput.min = formattedDate;
        
        // Set default value to tomorrow
        departureDateInput.value = formattedDate;
    } else {
        console.warn('Departure date input (departDate) not found, skipping initialization.');
    }

    // Handle search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fromCityElement = document.getElementById('fromCity');
        const toCityElement = document.getElementById('toCity');
        const departDateElement = document.getElementById('departDate');
        
        if (!fromCityElement || !toCityElement || !departDateElement) {
            console.error('Required form elements for search (fromCity, toCity, or departDate) not found.');
            return;
        }
        
        // Build query string
        const queryParams = new URLSearchParams({
            departure_city: fromCityElement.value,
            arrival_city: toCityElement.value,
            departure_date: departDateElement.value,
        });
        
        // Redirect to flights page with search parameters
        window.location.href = `/flights.html?${queryParams.toString()}`;
    });
}); 