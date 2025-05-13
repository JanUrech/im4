<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../system/config.php';
header('Content-Type: text/plain; charset=UTF-8');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Felder auslesen und bereinigen
    $vorname = trim($_POST["vorname"] ?? '');
    $nachname = trim($_POST["nachname"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $password = $_POST["password"] ?? '';
    $alter_jahre = $_POST["alter_jahre"] ?? '';
    $geschlecht = $_POST["geschlecht"] ?? '';
    $groesse_cm = $_POST["groesse_cm"] ?? '';
    $gewicht_kg = $_POST["gewicht_kg"] ?? '';

    // Validierung
    if (
        empty($vorname) || empty($nachname) || empty($email) || empty($password)
        || empty($alter_jahre) || empty($geschlecht) || empty($groesse_cm) || empty($gewicht_kg)
    ) {
        echo "❗️Bitte alle Felder ausfüllen.";
        exit;
    }

    if (strlen($password) < 8) {
        echo "❗️Das Passwort muss mindestens 8 Zeichen lang sein.";
        exit;
    }

    // Prüfen, ob E-Mail schon existiert
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM nutzer WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetchColumn() > 0) {
        echo "❗️Ein Nutzer mit dieser E-Mail existiert bereits.";
        exit;
    }

    // Passwort hashen
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // BMI berechnen
    $bmi = ($groesse_cm > 0) ? round($gewicht_kg / pow($groesse_cm / 100, 2), 1) : null;

    // Datenbankeintrag
    $sql = "INSERT INTO nutzer (vorname, nachname, email, password, alter_jahre, geschlecht, groesse_cm, gewicht_kg, BMI)
            VALUES (:vorname, :nachname, :email, :password, :alter_jahre, :geschlecht, :groesse_cm, :gewicht_kg, :bmi)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':vorname' => $vorname,
            ':nachname' => $nachname,
            ':email' => $email,
            ':password' => $hashed_password,
            ':alter_jahre' => $alter_jahre,
            ':geschlecht' => $geschlecht,
            ':groesse_cm' => $groesse_cm,
            ':gewicht_kg' => $gewicht_kg,
            ':bmi' => $bmi
        ]);

        echo "✅ Registrierung erfolgreich. Dein BMI: $bmi";

        // Session starten und Nutzer-ID speichern
        session_start();
        $_SESSION['user_id'] = $user['ID'];
        $_SESSION['email'] = $user['email'];


    } catch (PDOException $e) {
        echo "❌ Fehler beim Speichern: " . $e->getMessage();
    }
}
?>