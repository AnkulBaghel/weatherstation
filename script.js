// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVAzen_KeAByye43Hg12RrisCV0KO26N0",
    authDomain: "weather-station-92c86.firebaseapp.com",
    databaseURL: "https://weather-station-92c86-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "weather-station-92c86",
    storageBucket: "weather-station-92c86.firebasestorage.app",
    messagingSenderId: "855505630350",
    appId: "1:855505630350:web:52f236f172f5ad0b26c5df",
    measurementId: "G-X0K4CB91QW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Login using Firebase Authentication
const email = "ankulbaghel098@gmail.com";
const password = "weatherstation123";

signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log("Login successful!");
        fetchWeatherData(); // Fetch weather data after successful login
    })
    .catch((error) => {
        console.error("Error during login:", error.message);
    });

// Function to update the current date and day
function updateDateAndDay() {
    const today = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Format the date
    const dayName = dayNames[today.getDay()];
    const date = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

    // Update the DOM elements
    document.getElementById("day-name").textContent = dayName;
    document.getElementById("date").textContent = date;
}

// Function to fetch and update weather data from Firebase
function fetchWeatherData() {
    const weatherRef = ref(db, "DHT"); // Path to fetch DHT data from Firebase

    // Listen for real-time updates
    onValue(weatherRef, (snapshot) => {
        const data = snapshot.val();

        // Update weather-related elements with fetched data
        document.getElementById("location").textContent = data.location || "Greater Noida";
        document.getElementById("temperature").textContent = `${data.temperature || 0}°C`;
        document.getElementById("humidity").textContent = `${data.humidity || 0}%`;
        document.getElementById("precipitation").textContent = `${data.rainValue || 0}%`;  // Rain value (could be for precipitation)
        document.getElementById("description").textContent = data.condition || "Clear";

        // Update weather icon
        const weatherIcon = document.getElementById("weather-icon");
        const condition = (data.condition || "clear").toLowerCase();
        if (condition === "sunny") {
            weatherIcon.setAttribute("data-feather", "sun");
        } else if (condition === "cloudy") {
            weatherIcon.setAttribute("data-feather", "cloud");
        } else if (condition === "rainy") {
            weatherIcon.setAttribute("data-feather", "cloud-rain");
        } else {
            weatherIcon.setAttribute("data-feather", "sun");
        }

        // Refresh feather icons
        feather.replace();
    });
}

// Initialize the page
window.onload = () => {
    updateDateAndDay(); // Update the current date and day
};
