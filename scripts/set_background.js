fetch("./components/background.html")
        .then(response => response.text())
        .then(data => {document.getElementById("background-carousel").innerHTML = data;});