const client = mqtt.connect('wss://labserver.sense-campus.gr:9002');
const topic = "image";

const map = L.map('map').setView([38.246295, 21.735110], 16);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20
}).addTo(map);

let currentOverlay = null;

client.on('connect', function () {
    console.log('Connected to MQTT');
    client.subscribe(topic);
});

client.on('message', function (topic, message) {
    console.log('Received MQTT image update');
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
