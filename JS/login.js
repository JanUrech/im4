console.log("login.js geladenneu");

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#user-email").value.trim();
  const password = document.querySelector("#user-password").value;

  if (!email || !password) {
    alert("Bitte fülle alle Felder aus");
    return;
  }

  if (password.length < 8) {
    alert("Passwort muss mindestens 8 Zeichen lang sein");
    return;
  }

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  try {
    const res = await fetch("../php/login.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json(); // ⚠️ JSON statt text()

    console.log("Antwort vom Server:", data);

    if (data.status === "success") {
      window.location.href = "TestUntersuch.html";
    } else {
      alert(data.message || "Login fehlgeschlagen.");
    }
  } catch (err) {
    console.error("Fehler beim Senden:", err);
    alert("Ein unerwarteter Fehler ist aufgetreten.");
  }
});
