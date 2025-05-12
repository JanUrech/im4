<?php
// Verbindung zur Datenbank über PDO laden
require_once __DIR__ . '/../system/config.php';

// Wenn das Formular abgeschickt wurde
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Eingaben aus dem Formular
    $vorname     = $_POST["vorname"];
    $nachname    = $_POST["nachname"];
    $password    = $_POST["password"];
    $alter_jahre       = $_POST["alter_jahre"];
    $geschlecht  = $_POST["geschlecht"];
    $groesse_cm  = $_POST["groesse_cm"];
    $gewicht_kg  = $_POST["gewicht_kg"];

    // BMI berechnen
    if ($groesse_cm > 0) {
        $bmi = round($gewicht_kg / pow($groesse_cm / 100, 2), 1);
    } else {
        $bmi = null;
    }

    // SQL vorbereiten
    $sql = "INSERT INTO nutzer (vorname, nachname, password, alter_jahre, geschlecht, groesse_cm, gewicht_kg, BMI)
            VALUES (:vorname, :nachname, :password, :alter_jahre, :geschlecht, :groesse_cm, :gewicht_kg, :bmi)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':vorname'     => $vorname,
            ':nachname'    => $nachname,
            ':password'    => $password,
            ':alter_jahre'       => $alter_jahre,
            ':geschlecht'  => $geschlecht,
            ':groesse_cm'  => $groesse_cm,
            ':gewicht_kg'  => $gewicht_kg,
            ':bmi'         => $bmi
        ]);
        echo "<p>✅ Nutzer erfolgreich gespeichert. BMI: $bmi</p>";
    } catch (PDOException $e) {
        echo "<p>❌ Fehler beim Speichern: " . $e->getMessage() . "</p>";
    }
}
?>
