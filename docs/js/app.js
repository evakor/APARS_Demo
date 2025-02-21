// Initialize MQTT Connection
const client = mqtt.connect('wss://labserver.sense-campus.gr:9002');
const topic = "image";

// Map Tile Layers
const lightTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20
});

const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20
});

// Initialize Map
const map = L.map('map').setView([38.246295, 21.735110], 16);
let currentTileLayer = lightTileLayer; // Default to light mode
currentTileLayer.addTo(map);

let currentOverlay = null;

// Connect to MQTT
client.on('connect', function () {
    console.log('Connected to MQTT');
    client.subscribe(topic);
});

client.on('message', function (topic, message) {
    console.log('Received MQTT Image');
    const base64Image = message.toString();
    const imageUrl = `data:image/png;base64,${base64Image}`;
    localStorage.setItem("latestImage", imageUrl);

    if (currentOverlay) {
        map.removeLayer(currentOverlay);
    }

    currentOverlay = L.imageOverlay(imageUrl, [[38.205683, 21.708846], [38.294508, 21.830913]], {
        opacity: 0.5
    }).addTo(map);
});

// Theme Toggle Logic
const themeToggle = document.getElementById("theme-toggle");

// Function to set the theme
function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark-mode");
        map.removeLayer(currentTileLayer);
        currentTileLayer = darkTileLayer;
    } else {
        document.body.classList.remove("dark-mode");
        map.removeLayer(currentTileLayer);
        currentTileLayer = lightTileLayer;
    }
    currentTileLayer.addTo(map);
}

// Event Listener for Toggle Switch
themeToggle.addEventListener("change", () => {
    const isDarkMode = themeToggle.checked;
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    applyTheme(isDarkMode);
});

// Apply saved theme on load
const savedTheme = localStorage.getItem("theme") === "dark";
themeToggle.checked = savedTheme;
applyTheme(savedTheme);

// Function to open the side menu
function openMenu() {
    document.getElementById("side-menu").style.width = "250px";
}

// Function to close the side menu
function closeMenu() {
    document.getElementById("side-menu").style.width = "0";
}