// Sample featured products data
const products = [
    {
        id: 1,
        title: "Calculus Textbook",
        price: 45.00,
        image: "assets/images/placeholder.jpg",
        description: "Calculus: Early Transcendentals, 8th Edition",
        category: "textbooks",
        condition: "Good"
    },
    {
        id: 2,
        title: "GMU Hoodie",
        price: 25.00,
        image: "assets/images/placeholder.jpg",
        description: "Size L, Like New Condition",
        category: "clothing",
        condition: "Like New"
    },
    {
        id: 3,
        title: "Scientific Calculator",
        price: 30.00,
        image: "assets/images/placeholder.jpg",
        description: "TI-84 Plus, Perfect for Math Classes",
        category: "electronics",
        condition: "Good"
    },
    {
        id: 4,
        title: "Study Desk",
        price: 50.00,
        image: "assets/images/placeholder.jpg",
        description: "Sturdy wooden desk, perfect for dorm",
        category: "furniture",
        condition: "Used"
    }
];

// Function to display products in a grid
function displayProducts(containerId, productsToShow) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    productsToShow.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';
        col.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-muted">${product.description.substring(0, 100)}...</p>
                    <p class="price-tag">$${product.price.toFixed(2)}</p>
                    <p class="badge-condition">${product.condition}</p>
                    <button onclick="showProductDetails(${product.id})" class="btn btn-gmu w-100">View Details</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Display featured products
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const allProducts = [...products, ...storedProducts];
    displayProducts('featured-items-grid', allProducts);

    // Get personalized recommendations
    if (typeof ProductRecommender !== 'undefined') {
        ProductRecommender.getHomePageRecommendations();
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = allProducts.filter(product => 
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
            displayProducts('featured-items-grid', filteredProducts);
        });
    }
});

// Function to show product details (will be implemented in products.js)
function showProductDetails(productId) {
    window.location.href = `products.html?id=${productId}`;
} 