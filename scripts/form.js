// Product data array
const products = [
    {
        id: 1,
        name: "Smart Thermostat",
        category: "Home Automation"
    },
    {
        id: 2,
        name: "Air Purifier",
        category: "Home Appliances"
    },
    {
        id: 3,
        name: "Robot Vacuum",
        category: "Home Appliances"
    },
    {
        id: 4,
        name: "Smart Light Bulbs",
        category: "Home Automation"
    },
    {
        id: 5,
        name: "Water Filter System",
        category: "Home Appliances"
    },
    {
        id: 6,
        name: "Security Camera",
        category: "Home Security"
    },
    {
        id: 7,
        name: "Smart Door Lock",
        category: "Home Security"
    }
];

// Get DOM elements
const reviewForm = document.getElementById('reviewForm');
const productSelect = document.getElementById('product');
const currentYearElement = document.getElementById('currentYear');
const lastModifiedElement = document.getElementById('lastModified');

// Set current year in footer
currentYearElement.textContent = new Date().getFullYear();

// Set last modified date in footer
lastModifiedElement.textContent = document.lastModified;

// Populate product select options
function populateProductOptions() {
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = `${product.name} (${product.category})`;
        productSelect.appendChild(option);
    });
}

// Initialize the form
function initForm() {
    // Populate product options
    populateProductOptions();
    
    // Add visual feedback for form fields
    const formInputs = reviewForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Add visual feedback when field is valid/invalid
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('invalid');
                this.classList.add('valid');
            } else {
                this.classList.remove('valid');
                this.classList.add('invalid');
            }
        });
    });
    
    // Handle rating selection
    setupRatingSystem();
    
    // Handle form submission to increment counter
    reviewForm.addEventListener('submit', function() {
        // Only increment if the form is valid
        if (this.checkValidity()) {
            // Initialize submission counter
            let submissionCount = 0;
            
            // Load counter from localStorage if available
            if (localStorage.getItem('reviewSubmissionCount')) {
                submissionCount = parseInt(localStorage.getItem('reviewSubmissionCount'));
            }
            
            // Increment submission counter
            submissionCount++;
            
            // Save counter to localStorage
            localStorage.setItem('reviewSubmissionCount', submissionCount);
        }
    });
}

// Setup interactive rating system
function setupRatingSystem() {
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    const ratingText = document.getElementById('rating-text');
    
    const ratingDescriptions = {
        1: "Poor - Does not meet expectations",
        2: "Fair - Needs improvement",
        3: "Good - Meets expectations",
        4: "Very Good - Exceeds expectations",
        5: "Excellent - Outstanding performance"
    };
    
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Update rating text
            ratingText.textContent = ratingDescriptions[this.value];
            
            // Add visual feedback
            ratingText.style.color = this.value >= 4 ? '#2ecc71' : 
                                    this.value >= 3 ? '#f39c12' : 
                                    '#e74c3c';
        });
    });
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', initForm);
