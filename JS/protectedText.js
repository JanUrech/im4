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
            document.getElementById("welcome-message").innerHTML = "Willkommen" + data.firstname
        

        }
    })
    .catch((error) => {
        console.error("Fehler beim Abrufen der Daten:", error);
        // Hier kannst du die Daten weiterverarbeiten
        alert("Willkommen, " + data.firstname + " " + data.lastname);
    });
