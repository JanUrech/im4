console.log("login.js geladen");

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Verhindert das Neuladen

  const email = document.querySelector("#user-email").value.trim();
  const password = document.querySelector("#user-password").value;

  // Validierung
  if (!email || !password) {
    alert("Bitte fülle alle Felder aus");
    return;
  }

  if (password.length < 8) {
    alert("Passwort muss mindestens 8 Zeichen lang sein");
    return;
  }

  // FormData vorbereiten
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  try {
    const res = await fetch("php/login.php", {
      method: "POST",
      body: formData,
    });
    const reply = await res.text();
    console.log("Antwort vom Server:\n" + reply);
    alert(reply);

    if (reply.includes("Login erfolgreich. ")) {
      window.location.href = "protected.html"; // Weiterleitung zur Startseite
    } else {
      alert("Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.");
    }
    // Hier kannst du auch die Antwort des Servers weiterverarbeiten
  } catch (err) {
    console.error("Fehler beim Senden:", err);
  }
});
