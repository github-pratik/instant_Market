// Sample products data
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

// Filter state
let currentFilters = {
    search: '',
    category: '',
    minPrice: null,
    maxPrice: null
};

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to display products
function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCol = document.createElement('div');
        productCol.className = 'col';
        productCol.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description.substring(0, 100)}...</p>
                    <p class="price-tag">$${product.price.toFixed(2)}</p>
                    <p class="badge-condition">${product.condition}</p>
                    <button onclick="showProductDetails(${product.id})" class="btn btn-gmu">View Details</button>
                </div>
            </div>
        `;
        grid.appendChild(productCol);
    });
}

// Filter products based on current filters
function filterProducts() {
    let filtered = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                            product.description.toLowerCase().includes(currentFilters.search.toLowerCase());
        const matchesCategory = !currentFilters.category || product.category === currentFilters.category;
        const matchesPrice = (!currentFilters.minPrice || product.price >= currentFilters.minPrice) &&
                           (!currentFilters.maxPrice || product.price <= currentFilters.maxPrice);
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    displayProducts(filtered);
}

// Function to show product details in modal
function showProductDetails(productId) {
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const product = allProducts.find(p => p.id === productId) || products.find(p => p.id === productId);
    
    if (!product) return;
    
    const modalContent = document.getElementById('productModalContent');
    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" class="img-fluid rounded" alt="${product.title}">
            </div>
            <div class="col-md-6">
                <h4>${product.title}</h4>
                <p class="price-tag mb-3">$${product.price.toFixed(2)}</p>
                <p class="badge-condition mb-3">${product.condition}</p>
                <p class="text-muted mb-4">${product.description}</p>
                <div class="mb-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="quantity-selector">
                            <label for="quantity" class="form-label">Quantity:</label>
                            <input type="number" class="form-control" id="quantity" 
                                   value="1" min="1" max="10" style="width: 80px">
                        </div>
                        <button onclick="addToCart(${product.id})" class="btn btn-gmu">
                            Add to Cart
                        </button>
                    </div>
                </div>
                <div class="mb-4">
                    <h5>Category</h5>
                    <p class="badge-gmu">${product.category}</p>
                </div>
                <div class="mb-4">
                    <h5>Contact Seller</h5>
                    <a href="mailto:${product.contact}" class="btn btn-gmu">
                        Send Email
                    </a>
                </div>
                <div class="text-muted">
                    <small>Posted: ${new Date(product.datePosted).toLocaleDateString()}</small>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
    
    // Update recommendations
    window.ProductRecommender.updateRecommendations(productId);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial display
    displayProducts(products);

    // Check for product ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        showProductDetails(parseInt(productId));
    }

    // Search input
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        filterProducts();
    });

    searchButton.addEventListener('click', () => {
        filterProducts();
    });

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        filterProducts();
    });

    // Price filters
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const applyFilters = document.getElementById('applyFilters');

    applyFilters.addEventListener('click', () => {
        currentFilters.minPrice = minPrice.value ? Number(minPrice.value) : null;
        currentFilters.maxPrice = maxPrice.value ? Number(maxPrice.value) : null;
        filterProducts();
    });

    updateCartCount();
});

function addToCart(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const product = allProducts.find(p => p.id === productId) || products.find(p => p.id === productId);
    
    if (!product) return;

    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success message
    const toast = new bootstrap.Toast(document.getElementById('cartToast'));
    document.getElementById('cartToastBody').textContent = 
        `Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart`;
    toast.show();
    
    // Update cart count in navbar
    updateCartCount();
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'inline' : 'none';
    }
} 