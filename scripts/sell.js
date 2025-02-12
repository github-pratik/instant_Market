// Function to generate a unique ID for new products
function generateId() {
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    const maxId = existingProducts.reduce((max, product) => Math.max(max, product.id), 0);
    return maxId + 1;
}

// Function to save product to localStorage
function saveProduct(product) {
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    existingProducts.push(product);
    localStorage.setItem('products', JSON.stringify(existingProducts));
}

// Form validation and submission handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sellForm');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // Get selected courses
        const selectedCourses = Array.from(document.querySelectorAll('input[name="courseRelevant"]:checked'))
            .map(checkbox => checkbox.value);
        
        // Add other courses if specified
        const otherCourses = document.getElementById('otherCourse').value
            .split(',')
            .map(course => course.trim().toUpperCase())
            .filter(course => course.match(/[A-Z]{2,4}\d{3}/));
        
        const courseRelevant = [...selectedCourses, ...otherCourses];

        // Create new product object
        const newProduct = {
            id: generateId(),
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value),
            category: document.getElementById('category').value,
            condition: document.getElementById('condition').value,
            image: document.getElementById('image').value,
            contact: document.getElementById('contact').value,
            datePosted: new Date().toISOString(),
            courseRelevant: courseRelevant.length > 0 ? courseRelevant : undefined,
        };

        // Save to localStorage
        saveProduct(newProduct);

        // Show success modal
        successModal.show();

        // Reset form
        form.reset();
        form.classList.remove('was-validated');
    });
});

// Update products.js to load items from localStorage
document.addEventListener('DOMContentLoaded', () => {
    // Load products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    // Combine with default products if needed
    const allProducts = [...products, ...storedProducts];
    
    // Display all products
    displayProducts(allProducts);
}); 