// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const hamburgerButton = document.getElementById('hamburgerBtn');
    const primaryNav = document.getElementById('primaryNav');
    
    // Toggle menu function
    function toggleMenu() {
        // Toggle the 'open' class on both the button and the menu
        hamburgerButton.classList.toggle('open');
        primaryNav.classList.toggle('open');
        
        // Change button text based on state
        const isOpen = hamburgerButton.classList.contains('open');
        hamburgerButton.textContent = isOpen ? '✕' : '☰';
        
        // Set aria-expanded attribute for accessibility
        hamburgerButton.setAttribute('aria-expanded', isOpen);
    }
    
    // Add click event to hamburger button
    hamburgerButton.addEventListener('click', toggleMenu);
    
    // Close menu when window is resized to larger than mobile breakpoint
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && hamburgerButton.classList.contains('open')) {
            // Reset menu state
            hamburgerButton.classList.remove('open');
            primaryNav.classList.remove('open');
            hamburgerButton.textContent = '☰';
            hamburgerButton.setAttribute('aria-expanded', false);
        }
    });
});
