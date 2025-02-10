document.addEventListener('DOMContentLoaded', () => {
    const orders = getFilteredOrders();
    displayOrderHistory(orders);

    // Add search functionality
    const searchInput = document.getElementById('orderSearchInput');
    const searchButton = document.getElementById('orderSearchButton');

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredOrders = getFilteredOrders(searchTerm);
        displayOrderHistory(filteredOrders);
    }

    searchInput.addEventListener('input', handleSearch);
    searchButton.addEventListener('click', handleSearch);
});

function getFilteredOrders(searchTerm = '') {
    const orderHistoryContainer = document.getElementById('orderHistory');
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filter orders for current user
    let userOrders = orders.filter(order => order.userId === userSession.username);

    // Apply search filter if searchTerm exists
    if (searchTerm) {
        userOrders = userOrders.filter(order => {
            const orderString = JSON.stringify(order).toLowerCase();
            const searchTerms = searchTerm.toLowerCase().split(' ');
            return searchTerms.every(term => 
                orderString.includes(term) ||
                new Date(order.date).toLocaleString().toLowerCase().includes(term) ||
                order.items.some(item => 
                    item.title.toLowerCase().includes(term) ||
                    item.price.toString().includes(term)
                )
            );
        });
    }

    return userOrders;
}

function displayOrderHistory(userOrders) {
    const orderHistoryContainer = document.getElementById('orderHistory');
    
    if (userOrders.length === 0) {
        orderHistoryContainer.innerHTML = `
            <div class="alert alert-info">
                ${document.getElementById('orderSearchInput')?.value 
                    ? 'No orders found matching your search.' 
                    : "You haven't placed any orders yet."}
                <a href="products.html" class="alert-link">Start shopping</a>
            </div>
        `;
        return;
    }

    orderHistoryContainer.innerHTML = userOrders.map(order => `
        <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <strong>Order ID:</strong> ${order.orderId}
                    <br>
                    <small class="text-muted">Ordered on: ${new Date(order.date).toLocaleString()}</small>
                </div>
                <h5 class="mb-0">Total: $${order.total.toFixed(2)}</h5>
            </div>
            <div class="card-body">
                <h6>Items:</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.title}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `).join('');
} 