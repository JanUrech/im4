console.log("register.js geladen");

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Formulardaten auslesen
  const form = document.querySelector("#register-form");
  const formData = new FormData(form);

  // Einfache Validierung
  const requiredFields = [
    "vorname", "nachname", "email", "password",
    "alter_jahre", "geschlecht", "groesse_cm", "gewicht_kg"
  ];

  for (const field of requiredFields) {
    if (!formData.get(field) || formData.get(field).trim() === "") {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }
  }

  if (formData.get("password").length < 8) {
    alert("Passwort muss mindestens 8 Zeichen lang sein.");
    return;
  }

  try {
    const res = await fetch("php/register.php", {
      method: "POST",
      body: formData,
    });

    const reply = await res.text();
    console.log("Antwort vom Server:\n" + reply);
    alert(reply);

    if (reply.includes("✅")) {
      // Nach erfolgreicher Registrierung ggf. weiterleiten
      window.location.href = "protected.html";
        

    }
  } catch (err) {
    console.error("Fehler beim Senden:", err);
    alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
  }
});
