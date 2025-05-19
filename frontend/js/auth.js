// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const profileLink = document.getElementById('profileLink');

// Базовый URL для API
const API_BASE_URL = 'http://localhost:8000';

// Handle registration link click
if (registerLink) {
    registerLink.onclick = (e) => {
        e.preventDefault();
        window.location.href = '/register.html';
    };
}

// Show/hide login modal
if (loginLink) {
    loginLink.onclick = () => {
        loginModal.style.display = 'block';
    };
}

if (closeBtn) {
    closeBtn.onclick = () => {
        loginModal.style.display = 'none';
    };
}

window.onclick = (event) => {
    if (loginModal && event.target === loginModal) {
        loginModal.style.display = 'none';
    }
};

// Handle login form submission
if (loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById('username') || document.getElementById('loginUsername');
        const passwordInput = document.getElementById('password') || document.getElementById('loginPassword');
        const username = usernameInput ? usernameInput.value : '';
        const password = passwordInput ? passwordInput.value : '';

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Ошибка входа');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ошибка при попытке входа');
        }
    };
}

// Update UI based on auth state
function updateAuthUI(isAuthenticated) {
    if (loginLink) loginLink.style.display = isAuthenticated ? 'none' : 'block';
    if (registerLink) registerLink.style.display = isAuthenticated ? 'none' : 'block';
    if (profileLink) profileLink.style.display = isAuthenticated ? 'block' : 'none';
}

// Check auth state on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    updateAuthUI(token && user);
});

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на странице регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Проверяем наличие кнопки выхода
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Обновляем навигацию в зависимости от состояния авторизации
    updateNavigation();
});

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/register/`, {
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
        
        if (response.ok) {
            alert('Регистрация успешна! Теперь вы можете войти.');
            window.location.href = '/login.html';
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Ошибка регистрации');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка при попытке регистрации');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
}

function updateNavigation() {
    const token = localStorage.getItem('token');
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks) {
        if (token) {
            // Пользователь авторизован
            navLinks.innerHTML = `
                <li><a href="/">Главная</a></li>
                <li><a href="/flights.html">Рейсы</a></li>
                <li><a href="/profile.html">Профиль</a></li>
                <li><a href="#" id="logoutButton" class="btn-logout">Выйти</a></li>
            `;
            
            // Добавляем обработчик для кнопки выхода
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                logoutButton.addEventListener('click', handleLogout);
            }
        } else {
            // Пользователь не авторизован
            navLinks.innerHTML = `
                <li><a href="/">Главная</a></li>
                <li><a href="/flights.html">Рейсы</a></li>
                <li><a href="/login.html" class="btn-login">Войти</a></li>
                <li><a href="/register.html" class="btn-register">Регистрация</a></li>
            `;
        }
    }
}