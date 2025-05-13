console.log("login.js geladen");

document.getElementById("login-form").addEventListener("submit", async (event) => {event.preventDefault(); // Verhindert das Neuladen der Seite}
    const loginInfo = document.querySelector("#user-email").value.trim();
    const password = document.querySelector("#user-password").value.trim();
    console.log("loginInfo: ", loginInfo);
    console.log("password: ", password);}
)