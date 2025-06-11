<?php
// login.php

session_start();
session_destroy();
session_start();
header('Content-Type: application/json; charset=UTF-8'); // Nur JSON Header setzen

require_once __DIR__ . '/../system/config.php';

// Eingaben sichern
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
unset($_POST['email']);
unset($_POST['password']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "E-Mail und Passwort müssen ausgefüllt sein."]);
        exit;
    }

    // Nutzer anhand der E-Mail abrufen
    $stmt = $pdo->prepare("SELECT ID, email, password FROM nutzer WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Passwort prüfen
    if ($user && password_verify($password, $user['password'])) {
        session_regenerate_id(true); // Session-Fixation verhindern

        $_SESSION['user_id'] = $user['ID'];
        $_SESSION['email']   = $user['email'];

        echo json_encode([
            "status" => "success",
            "message" => "Login erfolgreich. Willkommen, " . htmlspecialchars($user['email']) . "!"
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "E-Mail oder Passwort ist falsch."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Ungültige Anfragemethode."]);
}
