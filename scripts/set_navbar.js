fetch('../components/navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        window.location.href = "../index.html";
    });
  });
