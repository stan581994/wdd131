// Get DOM elements
const counterElement = document.getElementById('counter');
const reviewSummaryElement = document.getElementById('reviewSummary');
const currentYearElement = document.getElementById('currentYear');
const lastModifiedElement = document.getElementById('lastModified');

// Set current year in footer
currentYearElement.textContent = new Date().getFullYear();

// Set last modified date in footer
lastModifiedElement.textContent = document.lastModified;

// Initialize submission counter
let submissionCount = 0;

// Load counter from localStorage if available
if (localStorage.getItem('reviewSubmissionCount')) {
    submissionCount = parseInt(localStorage.getItem('reviewSubmissionCount'));
} else {
    // If no counter exists, set it to 1 for the first submission
    submissionCount = 1;
    localStorage.setItem('reviewSubmissionCount', submissionCount);
}

// Update counter display
counterElement.textContent = submissionCount;

// Parse URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const paramObj = {};
    
    for (const [key, value] of params.entries()) {
        // If the key already exists, make it an array
        if (paramObj[key]) {
            if (!Array.isArray(paramObj[key])) {
                paramObj[key] = [paramObj[key]];
            }
            paramObj[key].push(value);
        } else {
            paramObj[key] = value;
        }
    }
    
    return paramObj;
}

// Display review details
function displayReviewDetails() {
    const params = getUrlParams();
    
    if (Object.keys(params).length === 0) {
        reviewSummaryElement.innerHTML = '<p>No review details available.</p>';
        return;
    }
    
    let html = '<dl class="review-details">';
    
    // Product information
    if (params.product) {
        html += `<dt>Product:</dt><dd>${params.product}</dd>`;
    }
    
    // Installation date
    if (params['installation-date']) {
        const date = new Date(params['installation-date']);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        html += `<dt>Installation Date:</dt><dd>${formattedDate}</dd>`;
    }
    
    // Rating
    if (params.rating) {
        const stars = '★'.repeat(parseInt(params.rating)) + '☆'.repeat(5 - parseInt(params.rating));
        html += `<dt>Rating:</dt><dd>${stars} (${params.rating}/5)</dd>`;
    }
    
    // Features
    if (params.features) {
        const features = Array.isArray(params.features) ? params.features : [params.features];
        html += '<dt>Useful Features:</dt><dd><ul>';
        features.forEach(feature => {
            html += `<li>${feature}</li>`;
        });
        html += '</ul></dd>';
    } else {
        html += '<dt>Useful Features:</dt><dd>None selected</dd>';
    }
    
    // Review text
    if (params.review) {
        html += `<dt>Review:</dt><dd>${params.review}</dd>`;
    }
    
    // Username
    if (params.username) {
        html += `<dt>Submitted by:</dt><dd>${params.username}</dd>`;
    } else {
        html += '<dt>Submitted by:</dt><dd>Anonymous</dd>';
    }
    
    html += '</dl>';
    
    reviewSummaryElement.innerHTML = html;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayReviewDetails();
});
