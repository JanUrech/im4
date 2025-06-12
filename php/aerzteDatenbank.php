<?php
// aerzteDatenbank.php – Verbindung zur Datenbank über config.php und Testausgabe eines Eintrags aus der Tabelle 'arzt'

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../system/config.php';

try {
    // Test: Hole den Eintrag mit der ID 1 aus der Tabelle 'arzt'
    $stmt = $pdo->prepare('SELECT * FROM arzt WHERE id = :id');
    $stmt->execute(['id' => 1]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "Kein Eintrag mit ID 1 in Tabelle 'arzt' gefunden."]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
