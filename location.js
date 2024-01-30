// Check if the Geolocation API is supported by the browser
if ("geolocation" in navigator) {
    // Geolocation is available
    navigator.geolocation.getCurrentPosition(function(position) {
        // Get the latitude and longitude coordinates
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Call the reverse geocoding service (e.g., Google Maps Geocoding API)
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`)
            .then(response => response.json())
            .then(data => {
                // Extract the city from the address components
                const addressComponents = data.results[0].address_components;
                const cityComponent = addressComponents.find(component =>
                    component.types.includes("locality")
                );
                const city = cityComponent ? cityComponent.long_name : "Unknown";

                // Display the user's city
                console.log("User's city:", city);
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
            });
    }, function(error) {
        // Handle errors, if any
        console.error("Error getting user's location:", error.message);
    });
} else {
    // Geolocation is not available
    console.error("Geolocation is not supported by this browser.");
}
