document.addEventListener("DOMContentLoaded", () => {
    const open = document.getElementById("add-trip");
    const close = document.getElementById("close-modal");
    const modal = document.getElementById("modal-container");

    open.addEventListener("click", () => {
        modal.classList.add("show");
    });

    close.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    document.getElementById('trip-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const city = document.getElementById("city").value;
        const country = document.getElementById("country").value;
        const tripType = document.getElementById("tripType").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const transport = document.getElementById("transport").value;
        const description = document.getElementById("description").value;
        const imageFile = document.getElementById("image").files[0];

        const token = JSON.parse(localStorage.getItem("currentUser"))?.token;
        if (!token) {
            alert("You are not logged in. Please log in first.");
            window.location.href = "login.html";
            return;
        }

        try {
            const tripResponse = await fetch("http://localhost:8080/api/trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ city, country, tripType, startDate, endDate, transport, description })
            });

            if (!tripResponse.ok) {
                const error = await tripResponse.text();
                throw new Error(error || 'Failed to create trip');
            }

            const createdTrip = await tripResponse.json();
            const tripId = createdTrip.id;

            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const pictureResponse = await fetch(`http://localhost:8080/api/trip/${tripId}/picture`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                if (!pictureResponse.ok) {
                    const error = await pictureResponse.text();
                    throw new Error(error || 'Failed to upload picture');
                }
            }

            alert("Trip and picture saved successfully");
            modal.classList.remove("show");
            window.location.reload();
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
});