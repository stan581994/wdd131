// Temple Data Array
const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  // Adding three more temple objects
  {
    templeName: "Cebu Philippines",
    location: "Cebu City, Philippines",
    dedicated: "2010, June, 13",
    area: 29556,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/cebu-city-philippines-temple/cebu-city-philippines-temple-3999.jpg"
  },
  {
    templeName: "Tokyo Japan",
    location: "Tokyo, Japan",
    dedicated: "1980, October, 27",
    area: 52590,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/tokyo-japan-temple/tokyo-japan-temple-26340-main.jpg"
  },
  {
    templeName: "Rome Italy",
    location: "Rome, Italy",
    dedicated: "2019, March, 10",
    area: 40000,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/rome-italy-temple/rome-italy-temple-3545.jpg"
  }
];

// Function to display temple cards
function displayTemples(templeList) {
  const templeCardsContainer = document.getElementById('templeCards');
  
  // Get existing elements
  const heading = templeCardsContainer.querySelector('h2');
  const filterControls = templeCardsContainer.querySelector('.filter-controls');
  
  // Clear existing content except the h2 and filter controls
  templeCardsContainer.innerHTML = '';
  templeCardsContainer.appendChild(heading);
  templeCardsContainer.appendChild(filterControls);
  
  // Loop through each temple and create a card
  templeList.forEach(temple => {
    // Create temple card
    const templeCard = document.createElement('div');
    templeCard.className = 'temple-card';
    
    // Create temple image with lazy loading
    const img = document.createElement('img');
    img.src = temple.imageUrl;
    img.alt = temple.templeName;
    img.loading = 'lazy'; // Native lazy loading
    
    // Create temple info container
    const templeInfo = document.createElement('div');
    templeInfo.className = 'temple-info';
    
    // Create temple name
    const templeName = document.createElement('div');
    templeName.className = 'temple-name';
    templeName.textContent = temple.templeName;
    
    // Create temple location
    const templeLocation = document.createElement('div');
    templeLocation.className = 'temple-location';
    templeLocation.textContent = temple.location;
    
    // Create temple dedicated date
    const templeDedicated = document.createElement('div');
    templeDedicated.className = 'temple-dedicated';
    templeDedicated.textContent = `Dedicated: ${temple.dedicated}`;
    
    // Create temple area
    const templeArea = document.createElement('div');
    templeArea.className = 'temple-area';
    templeArea.textContent = `Area: ${temple.area.toLocaleString()} sq ft`;
    
    // Append all elements to the temple info container
    templeInfo.appendChild(templeName);
    templeInfo.appendChild(templeLocation);
    templeInfo.appendChild(templeDedicated);
    templeInfo.appendChild(templeArea);
    
    // Append image and info to the temple card
    templeCard.appendChild(img);
    templeCard.appendChild(templeInfo);
    
    // Append the temple card to the container
    templeCardsContainer.appendChild(templeCard);
  });
}

// Helper function to set active button
function setActiveButton(activeButton) {
  // Remove active class from all buttons
  const buttons = document.querySelectorAll('.filter-controls button');
  buttons.forEach(button => button.classList.remove('active'));
  
  // Add active class to the clicked button
  activeButton.classList.add('active');
}

// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const hamburgerButton = document.getElementById('hamburgerBtn');
  
  // Toggle menu function
  function toggleMenu() {
    // Toggle the 'open' class on the button
    hamburgerButton.classList.toggle('open');
    
    // Change button text based on state
    const isOpen = hamburgerButton.classList.contains('open');
    hamburgerButton.textContent = isOpen ? '✕' : '☰';
    
    // Set aria-expanded attribute for accessibility
    hamburgerButton.setAttribute('aria-expanded', isOpen);
  }
  
  // Add click event to hamburger button
  hamburgerButton.addEventListener('click', toggleMenu);
  
  // Set up filter button event listeners
  const allButton = document.getElementById('allButton');
  const oldButton = document.getElementById('oldButton');
  const newButton = document.getElementById('newButton');
  const largeButton = document.getElementById('largeButton');
  const smallButton = document.getElementById('smallButton');
  
  allButton.addEventListener('click', () => {
    setActiveButton(allButton);
    displayTemples(temples);
  });
  
  oldButton.addEventListener('click', () => {
    setActiveButton(oldButton);
    const oldTemples = temples.filter(temple => {
      const dedicatedYear = parseInt(temple.dedicated.split(', ')[0]);
      return dedicatedYear < 2000;
    });
    displayTemples(oldTemples);
  });
  
  newButton.addEventListener('click', () => {
    setActiveButton(newButton);
    const newTemples = temples.filter(temple => {
      const dedicatedYear = parseInt(temple.dedicated.split(', ')[0]);
      return dedicatedYear >= 2000;
    });
    displayTemples(newTemples);
  });
  
  largeButton.addEventListener('click', () => {
    setActiveButton(largeButton);
    const largeTemples = temples.filter(temple => temple.area > 50000);
    displayTemples(largeTemples);
  });
  
  smallButton.addEventListener('click', () => {
    setActiveButton(smallButton);
    const smallTemples = temples.filter(temple => temple.area <= 50000);
    displayTemples(smallTemples);
  });
  
  // Display all temples when the page loads
  displayTemples(temples);
});
