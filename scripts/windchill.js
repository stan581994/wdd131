// Wind Chill Calculator for Philippines Page

// Function to calculate wind chill factor
function calculateWindChill(temperature, windSpeed) {
    return (temperature <= 10 && windSpeed > 4.8) ? (13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16)).toFixed(1) : "N/A";
}

// Get static values from the weather display
document.addEventListener("DOMContentLoaded", function() {
    // Static values (matching the displayed values in the HTML)
    const temperature = 32; // in Celsius
    const windSpeed = 15;   // in km/h
    
    // Calculate wind chill
    const windChill = calculateWindChill(temperature, windSpeed);
    
    // Display the wind chill value
    const windChillElement = document.querySelector(".weather-details p:nth-child(2)");
    if (windChillElement) {
        // If wind chill is "N/A", display it as is, otherwise add °C
        windChillElement.innerHTML = `<strong>Wind Chill:</strong> ${windChill === "N/A" ? windChill : windChill + "°C"}`;
    }
    
    // Log the calculation for verification
    console.log(`Temperature: ${temperature}°C, Wind Speed: ${windSpeed} km/h, Wind Chill: ${windChill}`);
});
