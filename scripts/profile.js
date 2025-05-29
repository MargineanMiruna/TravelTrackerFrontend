document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = currentUser?.token;

    if (!token) {
        alert("You are not logged in. Please log in first.");
        window.location.href = "../root/index.html";
        return;
    }

    document.getElementById("full-name").textContent = currentUser.name;

    const tripsContainer = document.getElementById("trips-container");
    const noTripsMessage = document.getElementById("no-trips-message");

    fetch("http://localhost:8080/api/trips", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to fetch trips");
        }
        return response.json();
    })
    .then(trips => {
        if (trips.length === 0) {
            noTripsMessage.style.display = "block";
        } else {
            trips.forEach(trip => {
                const tripCard = createTripContainer(trip, trips.length, token);
                tripsContainer.appendChild(tripCard);
            });
        }
    })
    .catch(error => {
        console.error("Error fetching trips:", error);
        noTripsMessage.textContent = "Error loading trips. Please try again.";
        noTripsMessage.style.display = "block";
    });
});

function createTripContainer(trip, totalTrips, token) {
    const col = document.createElement("div");
    col.className = "col-md-6";

    const row = document.createElement("div");
    row.className = "row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 bg-white position-relative";
    row.style.opacity = "90%";

    const leftCol = document.createElement("div");
    leftCol.className = "col p-4 d-flex flex-column position-static";

    const country = document.createElement("strong");
    country.className = "d-inline-block mb-2 text-primary-emphasis";
    country.textContent = trip.country || "Country";

    const title = document.createElement("h3");
    title.className = "mb-0";
    title.textContent = (trip.tripType || "") + " in " + (trip.city || "City");

    const date = document.createElement("div");
    date.className = "mb-1 text-body-secondary";
    if (trip.startDate && trip.endDate) {
        const startDateObj = new Date(trip.startDate);
        const endDateObj = new Date(trip.endDate);
        const formattedStartDate = startDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedEndDate = endDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        date.textContent = `${formattedStartDate} - ${formattedEndDate}`;
    } else {
        date.textContent = "Start date - End date";
    }

    const description = document.createElement("p");
    description.className = "card-text mb-auto";
    description.textContent = trip.description || "No description available.";

    const transport = document.createElement("div");
    transport.className = "mb-1 text-body-secondary";
    transport.textContent = "Travelled by " + (trip.transport || "Not specified");

    leftCol.appendChild(country);
    leftCol.appendChild(title);
    leftCol.appendChild(date);
    leftCol.appendChild(description);
    leftCol.appendChild(transport);

    const rightCol = document.createElement("div");
    rightCol.className = "col-auto d-none d-lg-block";

    if (trip.id) {
        const img = document.createElement("img");
        fetch(`http://localhost:8080/api/trip/picture?tripId=${trip.id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error("Image not found");
            return response.blob();
        })
        .then(blob => {
            const objectURL = URL.createObjectURL(blob);
            img.src = objectURL;
        })
        .catch(err => {
            console.warn("Failed to load image for tripId:", trip.id, err);
            rightCol.innerHTML = "";
        });

        img.alt = trip.title || "Trip picture";
        img.width = 200;
        img.height = 250;
        img.style.objectFit = "cover";
        img.className = "rounded";

        rightCol.appendChild(img);
    }

    row.appendChild(leftCol);
    row.appendChild(rightCol);
    col.appendChild(row);

    return col;
}
