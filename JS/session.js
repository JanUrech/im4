 async function destroySessio() {
 
 try {
    const res = await fetch("php/session.php");
    const reply = await res.text();
    console.log("Antwort vom Server:\n" + reply);
   
  } catch (err) {
    console.error("Fehler beim Senden:", err);
  }
}

destroySessio();