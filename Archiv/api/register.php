<?php

require_once '../system/config.php'; // Konfiguration einbinden

// Diese drei Header beheben in der Regel CORS-Probleme
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");



if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight-Anfrage: Nur Header zurückgeben, keine Daten
    http_response_code(200);
    exit();
}

// Immer nur JSON zurückgeben – keine Leerzeichen, kein HTML davor!
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Fehler nicht direkt ausgeben (für sauberen JSON-Output)
ini_set('display_errors', 0);
error_reporting(0);

// Lese die Rohdaten
$input = file_get_contents("php://input");

// Versuche, die JSON-Daten zu dekodieren
$data = json_decode($input, true);

// Prüfen, ob Daten korrekt angekommen sind
if (is_array($data)) {
  
    $firstname = htmlspecialchars($data['firstname'] ?? '');
$lastname = htmlspecialchars($data['lastname'] ?? '');
$email = htmlspecialchars($data['email'] ?? '');

try {
    // Bereite die SQL-Anweisung vor
    $stmt = $pdo->prepare("INSERT INTO users (firstname, lastname, email) VALUES (:firstname, :lastname, :email)");

    // Führe sie mit den Parametern aus
    $stmt->execute([
        ':firstname' => $firstname,
        ':lastname' => $lastname,
        ':email' => $email
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Daten erfolgreich gespeichert",
        "firstname" => $firstname,
        "lastname" => $lastname,
        "email" => $email
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Fehler beim Speichern: " . $e->getMessage()
    ]);
}

}
?>
