document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = currentUser?.token;

    if (!token) {
        alert("You are not logged in. Please log in first.");
        window.location.href = "../index.html";
        return;
    }

    const map = L.map('map', {
        center: [20, 0],
        zoom: 3,
        minZoom: 1,
        maxZoom: 10,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        noWrap: true,
    }).addTo(map);

    fetch('http://localhost:8080/api/visitedCountries', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(visitedCities => {
        const normalizedVisited = visitedCities.map(city => city.trim().toLowerCase());

        // Fetch GeoJSON data
        return fetch('../assets/custom.geo.json')
            .then(response => response.json())
            .then(geoData => ({ normalizedVisited, geoData }));
    })
    .then(({ normalizedVisited, geoData }) => {
        L.geoJSON(geoData, {
            style: feature => {
                const cityName = feature.properties.name?.trim().toLowerCase();
                const isVisited = normalizedVisited.includes(cityName);

                return {
                    fillColor: isVisited ? 'yellowgreen' : 'white', 
                    fillOpacity: 0.7,
                    color: '#333',
                    weight: 1
                };
            },
            onEachFeature: (feature, layer) => {
                const cityName = feature.properties.name;
                const normalizedCity = cityName?.trim().toLowerCase();

                if (normalizedVisited.includes(normalizedCity)) {
                    // Add popup to visited city polygon
                    layer.bindPopup(`<b>${cityName}</b>`);
                }
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error:', error));
});
