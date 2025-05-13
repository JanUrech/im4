<?php
session_destroy();
require_once __DIR__ . '/../system/config.php';
header('Content-Type: text/plain; charset=UTF-8');

// Eingaben sichern
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Frühzeitige Prüfung
if (empty($email) || empty($password)) {
    echo "E-Mail und Passwort müssen ausgefüllt sein.";
    exit;
}

// Nutzer anhand der E-Mail abrufen
$stmt = $pdo->prepare("SELECT * FROM nutzer WHERE email = :email");
$stmt->execute([':email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Prüfung auf Existenz und Passwort
if ($user && password_verify($password, $user['password'])) {
    echo "Login erfolgreich. Willkommen, " . htmlspecialchars($user['email']) . "!";
    // Session starten und Nutzer-ID speichern
    session_start();
    $_SESSION['user_id'] = $user['ID'];
    $_SESSION['email'] = $user['email'];
} else {
    echo "Login fehlgeschlagen. E-Mail oder Passwort ist falsch.";
}
?>