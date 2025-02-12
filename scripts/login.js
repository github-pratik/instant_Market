// User credentials
const validCredentials = {
    user: { username: 'user', password: 'user', role: 'user' },
    seller: { username: 'admin', password: 'admin', role: 'seller' }
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const userSession = sessionStorage.getItem('userSession');
    if (userSession) {
        const user = JSON.parse(userSession);
        redirectBasedOnRole(user.role);
    }

    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Clear any existing session
        sessionStorage.removeItem('userSession');

        // Check credentials
        const user = Object.values(validCredentials).find(
            cred => cred.username === username && cred.password === password
        );

        if (user) {
            // Store user session
            const userSession = {
                username: user.username,
                role: user.role,
                loggedIn: true
            };
            sessionStorage.setItem('userSession', JSON.stringify(userSession));

            redirectBasedOnRole(user.role);
        } else {
            loginError.textContent = 'Invalid username or password';
        }
    });
});

function redirectBasedOnRole(role) {
    if (role === 'seller') {
        window.location.href = 'seller-dashboard.html';
    } else {
        window.location.href = 'home.html';
    }
} 