function checkAuth() {
    const userSession = sessionStorage.getItem('userSession');
    if (!userSession) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(userSession);
    const currentPage = window.location.pathname.split('/').pop();

    // Allow access to home.html and products.html for regular users
    if (user.role === 'user') {
        const allowedPages = ['home.html', 'products.html', 'about.html', 'cart.html', 'order-history.html'];
        if (!allowedPages.includes(currentPage)) {
            window.location.href = 'home.html';
            return;
        }
    }

    // Allow access to seller pages for sellers
    if (user.role === 'seller') {
        const allowedPages = ['seller-dashboard.html', 'sell.html'];
        if (!allowedPages.includes(currentPage)) {
            window.location.href = 'seller-dashboard.html';
            return;
        }
    }

    return user;
}

function logout() {
    sessionStorage.removeItem('userSession');
    localStorage.removeItem('cart');
    window.location.href = 'login.html';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // Skip auth check for login page
    if (window.location.pathname.includes('login.html')) {
        return;
    }
    
    checkAuth();

    // Update navigation based on user role
    const user = JSON.parse(sessionStorage.getItem('userSession') || '{}');
    if (user.role === 'user') {
        // Hide seller-specific navigation items
        const sellerItems = document.querySelectorAll('.seller-only');
        sellerItems.forEach(item => item.style.display = 'none');
    }
});

// Add logout functionality to all pages
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    if (!window.location.pathname.includes('login.html')) {
        checkAuth();
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        // Prevent default link behavior and handle logout
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}); 