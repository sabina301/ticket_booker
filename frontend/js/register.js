// DOM Elements
const registerForm = document.getElementById('registerForm');
const showLoginLink = document.getElementById('showLoginLink');

// Show login modal when clicking "Already have an account?"
showLoginLink.onclick = (e) => {
    e.preventDefault();
    loginModal.style.display = 'block';
};

// Handle registration form submission
registerForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    
    try {
        console.log('Sending registration data:', {
            username,
            email,
            password,
            password2: confirmPassword
        });
        
        const response = await fetch('http://localhost:8000/api/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                password2: confirmPassword
            }),
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error('Server error details:', errorData);
                throw new Error(JSON.stringify(errorData) || 'Ошибка при регистрации');
            } else {
                const textError = await response.text();
                console.error('Server returned non-JSON response:', textError);
                throw new Error('Сервер вернул неожиданный ответ');
            }
        }

        const data = await response.json();
        
        // Show success message
        alert('Регистрация успешна! Теперь вы можете войти в систему.');
        
        // Redirect to login
        window.location.href = '/';
        
    } catch (error) {
        alert(error.message);
    }
}; 