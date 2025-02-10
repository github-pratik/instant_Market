document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});

function updateDashboard() {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const sellerOrders = orders.filter(order => 
        order.items.some(item => item.sellerId === userSession.username)
    );

    // Update total sales
    const totalSales = sellerOrders.reduce((total, order) => {
        const sellerItems = order.items.filter(item => item.sellerId === userSession.username);
        return total + sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, 0);
    document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;

    // Update active listings
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const activeListings = products.filter(p => p.sellerId === userSession.username).length;
    document.getElementById('activeListings').textContent = activeListings;

    // Update total orders
    document.getElementById('totalOrders').textContent = sellerOrders.length;

    // Display recent sales
    const recentSalesContainer = document.getElementById('recentSales');
    const recentSales = sellerOrders.slice(-5).reverse();

    if (recentSales.length === 0) {
        recentSalesContainer.innerHTML = '<p class="text-muted">No sales yet</p>';
        return;
    }

    recentSalesContainer.innerHTML = `
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${recentSales.map(order => `
                        <tr>
                            <td>${order.orderId}</td>
                            <td>${new Date(order.date).toLocaleString()}</td>
                            <td>${order.items
                                .filter(item => item.sellerId === userSession.username)
                                .map(item => `${item.quantity}x ${item.title}`).join('<br>')}</td>
                            <td>$${order.items
                                .filter(item => item.sellerId === userSession.username)
                                .reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
} 