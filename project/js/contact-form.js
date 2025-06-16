/**
 * Mindful Habits Tracker - Contact Form Script
 * This file handles the contact form functionality.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the contact form
    initContactForm();
});

/**
 * Initialize the contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Add form submission handler
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate the form
            if (validateForm(contactForm)) {
                // Simulate form submission
                submitForm(contactForm);
            }
        });
    }
}

/**
 * Validate the contact form
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} Whether the form is valid
 */
function validateForm(form) {
    let isValid = true;
    
    // Get form fields
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');
    
    // Clear previous error messages
    clearErrors(form);
    
    // Validate name (required)
    if (!name.value.trim()) {
        showError(name, 'Please enter your name');
        isValid = false;
    }
    
    // Validate email (required and format)
    if (!email.value.trim()) {
        showError(email, 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject (required)
    if (!subject.value) {
        showError(subject, 'Please select a subject');
        isValid = false;
    }
    
    // Validate message (required and minimum length)
    if (!message.value.trim()) {
        showError(message, 'Please enter your message');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError(message, 'Your message should be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Show an error message for a form field
 * @param {HTMLElement} field - The field with the error
 * @param {string} message - The error message
 */
function showError(field, message) {
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    
    // Add error class to the field
    field.classList.add('error');
    
    // Insert error message after the field
    field.parentNode.appendChild(errorElement);
}

/**
 * Clear all error messages from the form
 * @param {HTMLFormElement} form - The form to clear errors from
 */
function clearErrors(form) {
    // Remove error classes from fields
    const fields = form.querySelectorAll('.error');
    fields.forEach(field => field.classList.remove('error'));
    
    // Remove error messages
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());
}

/**
 * Check if an email address is valid
 * @param {string} email - The email address to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Submit the form (simulated)
 * @param {HTMLFormElement} form - The form to submit
 */
function submitForm(form) {
    // Get form data
    const formData = new FormData(form);
    const formValues = {};
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
        formValues[key] = value;
    }
    
    // In a real application, you would send this data to a server
    console.log('Form submitted with values:', formValues);
    
    // Show success message
    showSuccessMessage(form);
    
    // Reset the form
    form.reset();
}

/**
 * Show a success message after form submission
 * @param {HTMLFormElement} form - The form that was submitted
 */
function showSuccessMessage(form) {
    // Create success message container
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <h3>Thank You!</h3>
        <p>Your message has been sent successfully. We'll get back to you soon.</p>
    `;
    
    // Hide the form
    form.style.display = 'none';
    
    // Insert success message before the form
    form.parentNode.insertBefore(successMessage, form);
    
    // Add a button to send another message
    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-primary';
    resetButton.textContent = 'Send Another Message';
    successMessage.appendChild(resetButton);
    
    // Add event listener to reset button
    resetButton.addEventListener('click', function() {
        // Remove success message
        successMessage.remove();
        
        // Show the form again
        form.style.display = 'block';
    });
}

// Add CSS for form validation
(function() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group {
            position: relative;
            margin-bottom: var(--spacing-lg);
        }
        
        .form-error {
            color: var(--color-error);
            font-size: 0.85rem;
            margin-top: 5px;
        }
        
        .error {
            border-color: var(--color-error) !important;
        }
        
        .form-success {
            background-color: var(--color-success);
            color: white;
            padding: var(--spacing-lg);
            border-radius: var(--border-radius-md);
            margin-bottom: var(--spacing-lg);
            text-align: center;
        }
        
        .form-success h3 {
            color: white;
            margin-top: 0;
        }
        
        .form-success .btn {
            margin-top: var(--spacing-md);
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: var(--spacing-xl);
        }
        
        .contact-info {
            background-color: var(--color-white);
            padding: var(--spacing-lg);
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-sm);
        }
        
        .contact-method {
            margin-bottom: var(--spacing-lg);
        }
        
        .contact-method h4 {
            color: var(--color-secondary);
            margin-bottom: var(--spacing-sm);
        }
        
        .social-links {
            display: flex;
            gap: var(--spacing-md);
        }
        
        .contact-form-container {
            background-color: var(--color-white);
            padding: var(--spacing-lg);
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-sm);
        }
        
        .contact-form {
            display: flex;
            flex-direction: column;
        }
        
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }
        
        .checkbox-group input {
            width: auto;
        }
        
        .checkbox-group label {
            margin-bottom: 0;
            font-weight: normal;
        }
        
        .contact-header {
            background-color: var(--color-primary);
            color: var(--color-white);
            padding: var(--spacing-xl) 0;
            text-align: center;
        }
        
        .contact-header h2 {
            color: var(--color-white);
        }
        
        .contact-form-section {
            padding: var(--spacing-xxl) 0;
        }
        
        .faq-section {
            background-color: var(--color-white);
            padding: var(--spacing-xxl) 0;
        }
        
        .faq-section h2 {
            text-align: center;
            margin-bottom: var(--spacing-xl);
        }
        
        .faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--spacing-lg);
        }
        
        .faq-item {
            background-color: var(--color-background);
            padding: var(--spacing-lg);
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-sm);
        }
        
        .faq-item h3 {
            color: var(--color-primary);
            margin-bottom: var(--spacing-sm);
        }
        
        /* Responsive styles for contact form */
        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
            }
            
            .contact-info {
                order: 2;
            }
            
            .contact-form-container {
                order: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
})();
