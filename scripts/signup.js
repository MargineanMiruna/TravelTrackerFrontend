document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signup-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!firstName || !lastName || !username || !email || !password) {
            alert("All fields are required.");
            return;
        }

        fetch('http://localhost:8080/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, username, email, password }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.text();
                    throw new Error(error);
                }
                return res.json();
            })
            .then((data) => {
                alert(`Welcome ${data.username}! Your account has been created.`);
                window.location.href = "login.html";
            })
            .catch((err) => {
                alert("Signup failed: " + err.message);
            });
    });
});
