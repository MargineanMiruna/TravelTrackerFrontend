document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = currentUser?.token;

    if (!token) {
        alert("You are not logged in. Please log in first.");
        window.location.href = "../root/index.html";
        return;
    }

    document.getElementById("welcome-username").textContent = currentUser.username;

    fetch("http://localhost:8080/api/stats", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to fetch stats");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("total-trips").textContent = data.totalTrips;
        document.getElementById("countries-visited").textContent = data.totalCountries;
        document.getElementById("total-days").textContent = data.totalDays;
        document.getElementById("world-percentage").textContent = data.worldPercentage + "%";
    })
    .catch(error => {
        console.error("Error fetching stats:", error);
        alert("Failed to load stats. Please try again.");
    });
});
