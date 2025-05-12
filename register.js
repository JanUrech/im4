console.log("register.js geladen");

// Wenn das Formular abgeschickt wird
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    // Werte aus dem Formular holen
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let email = document.getElementById("email").value;

    // Daten an PHP senden
    fetch("api/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: email
        })
    })
    .then(function(response) {
        return response.json(); // Antwort als JSON lesen
    })
    .then(function(data) {
        console.log("Antwort vom Server:", data);
        alert("Registrierung erfolgreich: " + data.firstname + " " + data.lastname);
    })
    .catch(function(error) {
        console.error("Fehler beim Senden der Daten:", error);
        alert("Es gab einen Fehler. Bitte versuche es erneut.");
    });
});
