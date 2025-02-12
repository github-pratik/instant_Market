// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update cart count in navbar
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'inline' : 'none';
    }
}

// Initialize cart count when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load cart data from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    updateCartDisplay();
});

// Listen for storage changes (in case cart is updated in another tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        cart = JSON.parse(e.newValue || '[]');
        updateCartCount();
    }
});

// Function to format price
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    let subtotal = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item mb-3 p-3 border rounded">
                <div class="row align-items-center">
                    <div class="col-md-2 col-sm-3 mb-2 mb-md-0">
                        <img src="${item.image}" 
                             class="img-fluid rounded" 
                             alt="${item.title}" 
                             style="width: 100px; height: 100px; object-fit: cover;">
                    </div>
                    <div class="col-md-4 col-sm-9">
                        <h5 class="mb-1">${item.title}</h5>
                        <p class="text-muted mb-0">Price: ${formatPrice(item.price)}</p>
                    </div>
                    <div class="col-md-3 col-sm-6 mt-2 mt-md-0">
                        <div class="quantity-selector">
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 col-sm-4 mt-2 mt-md-0">
                        <p class="mb-0">${formatPrice(itemTotal)}</p>
                    </div>
                    <div class="col-md-1 col-sm-2 mt-2 mt-md-0 text-end">
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="removeItem(${item.id})">×</button>
                    </div>
                </div>
            </div>
        `;
    });

    const tax = subtotal * 0.06; // 6% tax
    const total = subtotal + tax;

    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

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

    // Show receipt in modal
    const receiptContent = document.getElementById('receiptContent');
    receiptContent.textContent = receipt;
    
    // Hide payment modal and show receipt modal
    bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
    const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
    receiptModal.show();
    
    // Add download button handler
    document.getElementById('downloadReceiptBtn').onclick = () => {
        const blob = new Blob([receipt], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${orderDetails.orderId}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    
    // Store order details
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load cart data from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    updateCartDisplay();
    updateCartCount();

    // Payment method toggle
    const paymentMethod = document.getElementById('paymentMethod');
    const newCardSection = document.getElementById('newCardSection');
    const savedCardSection = document.getElementById('savedCardSection');
    
    paymentMethod.addEventListener('change', (e) => {
        if (e.target.value === 'saved') {
            newCardSection.style.display = 'none';
            savedCardSection.style.display = 'block';
            // Remove required attributes from new card fields
            document.querySelectorAll('#newCardSection input').forEach(input => {
                input.removeAttribute('required');
            });
        } else {
            newCardSection.style.display = 'block';
            savedCardSection.style.display = 'none';
            // Add back required attributes
            document.querySelectorAll('#newCardSection input:not(#saveCard)').forEach(input => {
                input.setAttribute('required', '');
            });
        }
    });

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
            
            // Get last four digits based on payment method
            let lastFour;
            if (paymentMethod.value === 'saved') {
                lastFour = document.querySelector('input[name="savedCard"]:checked').value;
            } else {
                lastFour = document.getElementById('cardNumber').value.slice(-4);
                
                // Save card if checkbox is checked
                if (document.getElementById('saveCard').checked) {
                    const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
                    savedCards.push({
                        lastFour: lastFour,
                        name: document.getElementById('cardName').value,
                        expiry: document.getElementById('expiry').value
                    });
                    localStorage.setItem('savedCards', JSON.stringify(savedCards));
                }
            }
            
            const orderDetails = {
                orderId: 'ORD' + Date.now(),
                date: new Date().toLocaleString(),
                subtotal: subtotal,
                tax: tax,
                total: total,
                userId: JSON.parse(sessionStorage.getItem('userSession')).username,
                lastFour: lastFour,
                items: cart.map(item => ({
                    title: item.title,
                    quantity: item.quantity,
                    price: item.price,
                    sellerId: item.sellerId || 'admin'
                }))
            };

            // Generate and show receipt
            generateReceipt(orderDetails);

            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();

            // Add event listener for when receipt modal is closed
            document.getElementById('receiptModal').addEventListener('hidden.bs.modal', () => {
                window.location.href = 'home.html';
            }, { once: true });
        });
    }

    // Update cart count when page loads
    updateCartCount();
}); 