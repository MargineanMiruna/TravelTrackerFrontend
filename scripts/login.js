document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
            .then(async res => {
                if (!res.ok) {
                    const error = await res.text();
                    throw new Error(error);
                }
                return res.json();
            })
            .then(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response));
                window.location.href = "./pages/home.html";
            })
            .catch(err => alert('Login failed: ' + err.message));
    });
});