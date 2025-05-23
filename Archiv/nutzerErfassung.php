<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// DB-Verbindung
require_once __DIR__ . '/../system/config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $vorname     = $_POST["vorname"];
    $nachname    = $_POST["nachname"];
    $email       = $_POST["email"];
    $password    = $_POST["password"];
    $alter_jahre = $_POST["alter_jahre"];
    $geschlecht  = $_POST["geschlecht"];
    $groesse_cm  = $_POST["groesse_cm"];
    $gewicht_kg  = $_POST["gewicht_kg"];

    // Validierung
    if (empty($vorname) || empty($nachname) || empty($email) || empty($password) || empty($alter_jahre) || empty($geschlecht) || empty($groesse_cm) || empty($gewicht_kg)) {
        echo "❗️Bitte alle Felder ausfüllen.";
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Prüfen, ob E-Mail bereits existiert
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM nutzer WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetchColumn();

    if ($user > 0) {
        echo "❗️Ein Benutzer mit dieser E-Mail existiert bereits.";
        exit;
    }

    // BMI berechnen
    $bmi = ($groesse_cm > 0) ? round($gewicht_kg / pow($groesse_cm / 100, 2), 1) : null;

    // Einfügen
    $sql = "INSERT INTO nutzer (vorname, nachname, email, password, alter_jahre, geschlecht, groesse_cm, gewicht_kg, BMI)
            VALUES (:vorname, :nachname, :email, :password, :alter_jahre, :geschlecht, :groesse_cm, :gewicht_kg, :bmi)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':vorname'     => $vorname,
            ':nachname'    => $nachname,
            ':email'       => $email,
            ':password'    => $hashed_password,
            ':alter_jahre' => $alter_jahre,
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
