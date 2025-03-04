// Initialize MQTT Connection with persistent session and explicit clientId
const client = mqtt.connect('wss://labserver.sense-campus.gr:9002', {
  clean: false,
  clientId: 'apars_' + Math.random().toString(16).substr(2, 8)
});
const topic = "image";

// Map Tile Layers
const lightTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

// Check if a previously received image is saved and load it
const savedImage = localStorage.getItem("latestImage");
if (savedImage) {
  currentOverlay = L.imageOverlay(savedImage, [[38.205683, 21.708846], [38.294508, 21.830913]], {
    opacity: 0.5
  }).addTo(map);
}

// Connect to MQTT and subscribe with QoS 1 to get any retained/queued message
client.on('connect', function () {
  console.log('Connected to MQTT');
  client.subscribe(topic, { qos: 1 }, function (err) {
    if (err) {
      console.error("Subscription error:", err);
    }
  });
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

themeToggle.addEventListener("change", () => {
  const isDarkMode = themeToggle.checked;
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  applyTheme(isDarkMode);
});

// Apply saved theme on load
const savedTheme = localStorage.getItem("theme") === "dark";
themeToggle.checked = savedTheme;
applyTheme(savedTheme);

// Side Menu functions
function openMenu() {
  document.getElementById("side-menu").style.width = "250px";
}

function closeMenu() {
  document.getElementById("side-menu").style.width = "0";
}

// Close the menu when a link is clicked
document.querySelectorAll(".side-menu a").forEach(link => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// Close the menu if the user clicks outside of it
document.addEventListener("click", function(event) {
  let menu = document.getElementById("side-menu");
  let menuIcon = document.querySelector(".menu-icon");
  if (menu.style.width === "250px" && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
    closeMenu();
  }
});
