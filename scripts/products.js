// Sample products data
const products = [
    {
        id: 1,
        title: "Calculus Textbook",
        price: 45.00,
        image: "assets/images/calculus.jpg",
        description: "Calculus: Early Transcendentals, 8th Edition",
        category: "textbooks",
        condition: "Good",
        courseRelevant: ["MATH113", "MATH114"]
    },
    {
        id: 2,
        title: "GMU Hoodie",
        price: 25.00,
        image: "assets/images/gmu_hoodie.avif",
        description: "Size L, Like New Condition",
        category: "clothing",
        condition: "Like New",
        courseRelevant: ["Fashion", "Design"]
    },
    {
        id: 3,
        title: "Scientific Calculator",
        price: 30.00,
        image: "assets/images/calculator.webp",
        description: "TI-84 Plus, Perfect for Math Classes",
        category: "electronics",
        condition: "Good",
        courseRelevant: ["MATH113", "MATH114"]
    },
    {
        id: 4,
        title: "Study Desk",
        price: 50.00,
        image: "assets/images/study_table.png",
        description: "Sturdy wooden desk, perfect for dorm",
        category: "furniture",
        condition: "Used",
        courseRelevant: ["study", "table"]
    },
    {
        id: 5,
        title: "Software Testing Textbook",
        price: 55.00,
        image: "assets/images/software-text-book.jpeg",
        description: "Introduction to Software Testing, Ammann and Offutt || GMU Textbook",
        category: "textbooks",
        condition: "Like New",
        courseRelevant: ["SWE632", "SWE437"]
    },
    {
        id: 6,
        title: "MacBook Pro",
        price: 899.00,
        image: "assets/images/macbook-pro.jpeg",
        description: "2024 MacBook Pro, Perfect for CS/SWE courses",
        category: "electronics",
        condition: "Good",
        courseRelevant: ["SWE632", "CS550", "CS504"]
    },
    {
        id: 7,
        title: "iPad Pro with Apple Pencil",
        price: 650.00,
        image: "assets/images/ipad.jpeg",
        description: "Great for note-taking and design work",
        category: "electronics",
        condition: "Like New",
        courseRelevant: ["SWE632", "ART204"]
    },
    {
        id: 8,
        title: "UI/UX Design Textbook",
        price: 65.00,
        image: "assets/images/ui-ux.jpeg",
        description: "Design Methods by Amy J. Ko, 2nd edition, revised 2024;- Perfect for SWE632",
        category: "textbooks",
        condition: "Like New",
        courseRelevant: ["SWE632"]
    },
    {
        id: 9,
        title: "Parallels Desktop 18",
        price: 35.00,
        image: "assets/images/parrallel-desk.avif",
        description: "Run Windows apps like Microsoft Office, Internet Explorer, Access, Quicken, QuickBooks, Visual Studio, and CAD",
        category: "electronics",
        condition: "New",
        courseRelevant: ["SWE632"]
    },
    {
        title: "27-inch Monitor",
        price: 180.00,
        image: "assets/images/monitor.jpeg",
        description: "Perfect for UI design work in SWE632. Great for multitasking.",
        category: "electronics",
        condition: "Good",
        courseRelevant: ["SWE632", "SWE437"]
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
function displayProducts(containerId, productsToShow) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    productsToShow.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4 mb-3';
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-img-wrapper">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-muted">${product.description.substring(0, 80)}...</p>
                    <p class="price-tag">$${product.price.toFixed(2)}</p>
                    <div class="badges">
                        <span class="badge-condition">${product.condition}</span>
                        ${product.courseRelevant ? `
                            <span class="badge bg-success">Relevant for: ${product.courseRelevant.join(', ')}</span>
                        ` : ''}
                    </div>
                    <button onclick="showProductDetails(${product.id})" class="btn btn-gmu w-100 mt-auto">View Details</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Filter products based on current filters
function filterProducts() {
    // First check if search term is a course code
    const courseCodeMatch = currentFilters.search.match(/[A-Za-z]{2,4}\d{3}/i);
    
    let filtered = [];
    if (courseCodeMatch) {
        const courseCode = courseCodeMatch[0].toUpperCase();
        filtered = products.filter(product => {
            // Check if product is relevant for the course
            const isRelevantForCourse = product.courseRelevant?.includes(courseCode);
            
            // Check if product matches course keywords
            const matchesKeywords = product.description.toLowerCase().includes(courseCode.toLowerCase()) ||
                                  product.title.toLowerCase().includes(courseCode.toLowerCase());
            
            return isRelevantForCourse || matchesKeywords;
        });

        // If no direct matches, try getting recommendations from AI
        if (filtered.length === 0) {
            filtered = ProductRecommender.getRecommendationsForCourse(courseCode);
        }
    } else {
        // Regular search if not a course code
        filtered = products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                                product.description.toLowerCase().includes(currentFilters.search.toLowerCase());
            const matchesCategory = !currentFilters.category || product.category === currentFilters.category;
            const matchesPrice = (!currentFilters.minPrice || product.price >= currentFilters.minPrice) &&
                               (!currentFilters.maxPrice || product.price <= currentFilters.maxPrice);
            
            return matchesSearch && matchesCategory && matchesPrice;
        });
    }

    displayProducts('productsGrid', filtered);
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
                ${product.courseRelevant ? `
                    <div class="mb-4">
                        <h5>Course Requirements</h5>
                        <p class="text-muted">This item is recommended for these courses:</p>
                        <div class="d-flex flex-wrap gap-2">
                            ${product.courseRelevant.map(course => `
                                <span class="badge bg-success">${course}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
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
    displayProducts('productsGrid', products);

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

    // Update cart count when page loads
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