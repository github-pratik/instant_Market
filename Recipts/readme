# Instant Market - GMU Student Marketplace

Instant Market is a web-based marketplace platform designed specifically for GMU students to buy and sell items within the university community. The platform facilitates the exchange of textbooks, electronics, furniture, and other essentials, making it easier for students to find what they need at affordable prices.

## Features

- User Authentication (Student/Seller roles)
- Product Listings with Categories
- Shopping Cart System
- Order History Tracking
- AI-Powered Product Recommendations
- Search and Filter Functionality
- Secure Payment Processing
- Receipt Generation System
- Seller Dashboard with Sales Analytics

## Technologies Used

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Bootstrap 5.3.0
  - Bootstrap Icons

- **Storage:**
  - LocalStorage (for demo purposes)
  - SessionStorage (for user authentication)

- **Additional Libraries:**
  - Bootstrap Bundle (includes Popper.js)

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Text editor (VS Code, Sublime Text, etc.)
- Basic understanding of web development

### Installation

1. Clone the repository

2. Navigate to the project directory

3. Open the project in your preferred code editor

- Using VS Code's Live Server extension

5. Access the application at `http://localhost:8000` (or the port provided by your server)

### Login Credentials

- **User Account:**
  - Username: user
  - Password: user

- **Seller Account:**
  - Username: admin
  - Password: admin

## System Architecture

### Receipt System

The receipt generation system works as follows:

1. **Generation:**
   - When a purchase is completed, the system creates a detailed receipt containing:
     - Order ID
     - Purchase Date
     - Item Details
     - Quantity
     - Individual Prices
     - Subtotal
     - Tax (6%)
     - Total Amount
     - Payment Method Details

2. **Download Process:**
   ```javascript
   // Create receipt content
   const receipt = generateReceiptContent(orderDetails);
   
   // Convert to Blob
   const blob = new Blob([receipt], { type: 'text/plain' });
   
   // Create download link
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `receipt_${orderDetails.orderId}.txt`;
   
   // Trigger download
   a.click();
   
   // Cleanup
   window.URL.revokeObjectURL(url);
   ```

3. **Storage:**
   - Receipts are generated as .txt files
   - Order details are stored in localStorage for order history
   - Sellers can access sale information through their dashboard

## Project Structure

nstant-market/
├── assets/
│ ├── images/
│ └── styles.css
├── scripts/
│ ├── ai-recommend.js
│ ├── auth.js
│ ├── cart.js
│ ├── login.js
│ ├── main.js
│ ├── order-history.js
│ ├── products.js
│ ├── receipt.js
│ ├── seller-dashboard.js
│ ├── signup.js
│ └── utils.js
├── index.html
├── login.html
├── signup.html
├── products.html
├── cart.html
├── order-history.html
├── seller-dashboard.html
├── receipt.html
├── products.html

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Pratik Patil - ppatil8@gmu.edu
Yash Sanap - ysanap@gmu.edu



