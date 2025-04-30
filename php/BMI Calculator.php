<?php
// Verbindung zur Datenbank
$servername = "mw2lgm.myd.infomaniak.com";
$username = "mw2lgm_im4";
$password = "K$.C?7X#uYr66tr";
$dbname = "mw2lgm_im4";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verbindung prüfen
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

// Wenn das Formular abgeschickt wurde
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $alter = $_POST["alter"];
    $geschlecht = $_POST["geschlecht"];
    $groesse_cm = $_POST["groesse_cm"];
    $gewicht_kg = $_POST["gewicht_kg"];

    // BMI berechnen
    if ($groesse_cm > 0) {
        $bmi = round($gewicht_kg / pow($groesse_cm / 100, 2), 1);
    } else {
        $bmi = null;
    }

    // SQL-Insert
    $stmt = $conn->prepare("INSERT INTO nutzer (`name`, `alter`, geschlecht, groesse_cm, gewicht_kg, BMI) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sisddi", $name, $alter, $geschlecht, $groesse_cm, $gewicht_kg, $bmi);

    if ($stmt->execute()) {
        echo "<p>✅ Nutzer erfolgreich gespeichert. BMI: $bmi</p>";
    } else {
        echo "<p>❌ Fehler: " . $stmt->error . "</p>";
    }

    $stmt->close();
}

$conn->close();
?>