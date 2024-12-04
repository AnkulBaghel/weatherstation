const city = 'Greater Noida';

async function getCoordinates(city) {
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
    const response = await fetch(geocodingUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.length === 0) {
        throw new Error('City not found');
    }
    return {
        lat: data[0].lat,
        lon: data[0].lon
    };
}

async function getWindSpeed(lat, lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(weatherUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const windSpeed = data.current_weather.windspeed;
    
    // Update the wind speed in the designated HTML section
    document.getElementById('wind').innerText = `${windSpeed} km/h`; // Assuming your "wind" element is where you want the wind speed to appear
}

async function fetchWindSpeedForCity(city) {
    try {
        const { lat, lon } = await getCoordinates(city);
        await getWindSpeed(lat, lon);
    } catch (error) {
        document.getElementById('wind').innerText = '--'; // Display error handling for wind speed
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Fetch wind speed for the given city
fetchWindSpeedForCity(city);