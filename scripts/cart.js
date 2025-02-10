// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to format price
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
        subtotalElement.textContent = formatPrice(0);
        taxElement.textContent = formatPrice(0);
        totalElement.textContent = formatPrice(0);
        return;
    }

    let subtotal = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item mb-3 p-3 border-bottom">
                <div class="row align-items-center">
                    <div class="col-2">
                        <img src="${item.image}" class="img-fluid rounded" alt="${item.title}">
                    </div>
                    <div class="col-4">
                        <h5 class="mb-1">${item.title}</h5>
                        <p class="text-muted mb-0">Price: ${formatPrice(item.price)}</p>
                    </div>
                    <div class="col-3">
                        <div class="quantity-selector">
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="col-2">
                        <p class="mb-0">${formatPrice(itemTotal)}</p>
                    </div>
                    <div class="col-1">
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="removeItem(${item.id})">×</button>
                    </div>
                </div>
            </div>
        `;
    });

    const tax = subtotal * 0.06; // 6% tax
    const total = subtotal + tax;

    subtotalElement.textContent = formatPrice(subtotal);
    taxElement.textContent = formatPrice(tax);
    totalElement.textContent = formatPrice(total);
}

// Function to update item quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }
}

// Function to remove item from cart
function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// Function to update cart count in navbar
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'inline' : 'none';
    }
}

// Function to generate receipt
function generateReceipt(orderDetails) {
    const receipt = `
        ===================================
        INSTANT MARKET - ORDER RECEIPT
        ===================================
        Order Date: ${new Date().toLocaleString()}
        Order ID: ${orderDetails.orderId}
        
        Items:
        ${cart.map(item => `
        ${item.title}
        Quantity: ${item.quantity}
        Price: ${formatPrice(item.price)}
        Subtotal: ${formatPrice(item.price * item.quantity)}
        `).join('\n')}
        
        -----------------------------------
        Subtotal: ${formatPrice(orderDetails.subtotal)}
        Tax (6%): ${formatPrice(orderDetails.tax)}
        Total: ${formatPrice(orderDetails.total)}
        
        Payment Method: Credit Card
        Card ending in: ${orderDetails.lastFour}
        
        Thank you for shopping at Instant Market!
        ===================================
    `;

    // Create blob and download receipt
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${orderDetails.orderId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateCartCount();

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
            paymentModal.show();
        });
    }

    // Payment form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const tax = subtotal * 0.06;
            const total = subtotal + tax;
            
            const orderDetails = {
                orderId: 'ORD' + Date.now(),
                date: new Date().toLocaleString(),
                subtotal: subtotal,
                tax: tax,
                total: total,
                userId: JSON.parse(sessionStorage.getItem('userSession')).username,
                lastFour: document.getElementById('cardNumber').value.slice(-4),
                items: cart.map(item => ({
                    title: item.title,
                    quantity: item.quantity,
                    price: item.price,
                    sellerId: item.sellerId || 'admin' // Default to admin for sample products
                }))
            };

            // Save order to localStorage
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(orderDetails);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Generate and download receipt
            generateReceipt(orderDetails);

            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();

            // Close modal and show success message
            bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
            alert('Thank you for your purchase! Your receipt has been downloaded.');
            
            // Redirect to home page after successful purchase
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        });
    }
}); 