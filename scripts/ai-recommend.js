// Product tags and categories for AI matching
const productTags = {
    textbooks: ['study', 'academic', 'education', 'books', 'course', 'learning'],
    electronics: ['tech', 'gadget', 'digital', 'electronic', 'device', 'computer'],
    furniture: ['home', 'decor', 'furniture', 'living', 'storage', 'desk'],
    clothing: ['wear', 'fashion', 'apparel', 'clothes', 'outfit', 'accessories']
};

// Recommendation weights
const weights = {
    category: 0.4,
    price: 0.3,
    condition: 0.2,
    tags: 0.1
};

class ProductRecommender {
    constructor() {
        this.recentViews = [];
        this.userPreferences = {
            priceRange: { min: 0, max: 1000 },
            preferredCategories: new Set(),
            viewHistory: []
        };
    }

    // Calculate similarity score between two products
    calculateSimilarity(product1, product2) {
        let score = 0;

        // Category matching
        if (product1.category === product2.category) {
            score += weights.category;
        }

        // Price similarity (inverse of price difference percentage)
        const priceDiff = Math.abs(product1.price - product2.price) / Math.max(product1.price, product2.price);
        score += weights.price * (1 - priceDiff);

        // Condition matching
        if (product1.condition === product2.condition) {
            score += weights.condition;
        }

        // Tag matching
        const productTags1 = productTags[product1.category] || [];
        const productTags2 = productTags[product2.category] || [];
        const commonTags = productTags1.filter(tag => productTags2.includes(tag));
        score += weights.tags * (commonTags.length / Math.max(productTags1.length, productTags2.length));

        return score;
    }

    // Get recommendations based on a product
    getRecommendations(product, allProducts, limit = 3) {
        return allProducts
            .filter(p => p.id !== product.id) // Exclude the current product
            .map(p => ({
                product: p,
                score: this.calculateSimilarity(product, p)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.product);
    }

    // Update user preferences based on viewed product
    updatePreferences(product) {
        this.userPreferences.viewHistory.push({
            category: product.category,
            price: product.price,
            timestamp: new Date()
        });

        this.userPreferences.preferredCategories.add(product.category);

        // Update price range preferences
        const recentViews = this.userPreferences.viewHistory.slice(-5);
        const prices = recentViews.map(v => v.price);
        this.userPreferences.priceRange = {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }

    // Get personalized recommendations based on user history
    getPersonalizedRecommendations(allProducts, limit = 4) {
        if (this.userPreferences.viewHistory.length === 0) {
            return allProducts.slice(0, limit); // Return random products if no history
        }

        const scoredProducts = allProducts.map(product => {
            let score = 0;

            // Category preference
            if (this.userPreferences.preferredCategories.has(product.category)) {
                score += weights.category;
            }

            // Price range preference
            if (product.price >= this.userPreferences.priceRange.min &&
                product.price <= this.userPreferences.priceRange.max) {
                score += weights.price;
            }

            // Recent views similarity
            const recentViewScores = this.userPreferences.viewHistory
                .slice(-3)
                .map(view => this.calculateSimilarity(
                    { category: view.category, price: view.price },
                    product
                ));
            score += Math.max(...recentViewScores, 0) * weights.tags;

            return { product, score };
        });

        return scoredProducts
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.product);
    }

    static courseRequirements = {
        'SWE632': {
            required: ['laptop', 'textbook'],
            recommended: ['tablet', 'monitor'],
            keywords: ['SWE632', 'UI/UX', 'design', 'software engineering', 'web development', 
                      'MacBook', 'iPad', 'Figma', 'monitor', 'interface', 'usability']
        },
        'CS550': {
            required: ['laptop', 'textbook'],
            recommended: ['database software'],
            keywords: ['database', 'SQL', 'data management', 'MacBook', 'computer']
        },
        'MATH113': {
            required: ['calculator', 'textbook'],
            recommended: ['notebook'],
            keywords: ['Calculus', 'calculator', 'math', 'TI-84']
        },
        'SWE437': {
            required: ['laptop', 'textbook'],
            recommended: ['second monitor'],
            keywords: ['software', 'engineering', 'development', 'MacBook', 'computer']
        }
    };

    static getRecommendationsForCourse(courseCode) {
        const course = this.courseRequirements[courseCode.toUpperCase()];
        if (!course) return [];

        // Filter products based on course requirements
        return products.filter(product => {
            const matchesKeywords = course.keywords.some(keyword =>
                product.description.toLowerCase().includes(keyword.toLowerCase()) ||
                product.title.toLowerCase().includes(keyword.toLowerCase())
            );

            const isRelevantForCourse = product.courseRelevant?.includes(courseCode.toUpperCase());

            return matchesKeywords || isRelevantForCourse;
        });
    }

    static searchWithRecommendations(searchTerm) {
        // Check if search term includes a course code
        const courseCodeMatch = searchTerm.match(/[A-Za-z]{2,4}\d{3}/);
        if (courseCodeMatch) {
            const courseCode = courseCodeMatch[0].toUpperCase();
            return this.getRecommendationsForCourse(courseCode);
        }

        // Regular search if no course code found
        return products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}

// Initialize the recommender
const recommender = new ProductRecommender();

// Function to display recommendations
function displayRecommendations(recommendations, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    recommendations.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="text-success fw-bold">$${product.price.toFixed(2)}</p>
                    <button onclick="viewProduct(${product.id})" class="btn btn-outline-success btn-sm">View Details</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Update recommendations when viewing a product
function updateRecommendations(productId) {
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const currentProduct = allProducts.find(p => p.id === productId);
    
    if (currentProduct) {
        recommender.updatePreferences(currentProduct);
        const recommendations = recommender.getRecommendations(currentProduct, allProducts);
        displayRecommendations(recommendations, 'recommendationsContainer');
    }
}

// Get personalized recommendations for homepage
function getHomePageRecommendations() {
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const recommendations = recommender.getPersonalizedRecommendations(allProducts);
    displayRecommendations(recommendations, 'personalizedRecommendations');
}

// Export functions for use in other files
window.ProductRecommender = {
    updateRecommendations,
    getHomePageRecommendations
};

// Update search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const recommendations = ProductRecommender.searchWithRecommendations(searchTerm);
            displayProducts('featured-items-grid', recommendations);
        });
    }
}); 