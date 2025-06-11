<?php
// login.php

ini_set('session.cookie_httponly', 1);
// ini_set('session.cookie_secure', 1); // Aktiviere dies, wenn HTTPS verwendet wird
session_start();
header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../system/config.php';

// Nur POST-Anfragen erlauben
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Eingaben validieren
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

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
