console.log("protectedText.js geladen");

//fetch
fetch("php/protected.php")
    .then((res) => res.json())
    .then((data) => {
        console.log("Antwort vom Server:", data);

        if (data.status === "error") {
            // redirect to login page
           window.location.href = "login.html";
           console.log("Fehler beim Abrufen der Daten:", data.status);
        }

        else {
            // Welcome-Message entfernt
        }
    })
    .catch((error) => {
        console.error("Fehler beim Abrufen der Daten:", error);
        // Kein Zugriff auf data im Fehlerfall!
        alert("Fehler beim Abrufen der Daten: " + error);
    });
