<?php
// aerzteDatenbank.php – Gibt alle Ärzte als JSON-Array für das Dropdown zurück oder fügt einen neuen Arzt ein

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../system/config.php';

// Einzelnen Arzt mit allen Feldern zurückgeben, falls id-Parameter gesetzt ist
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    try {
        $stmt = $pdo->prepare('SELECT * FROM arzt WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $arzt = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($arzt) {
            echo json_encode($arzt);
        } else {
            echo json_encode(['error' => 'Arzt nicht gefunden!']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Neuen Arzt anlegen
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['name']) || trim($data['name']) === '') {
        echo json_encode(['error' => 'Name ist erforderlich!']);
        exit;
    }
    try {
        $stmt = $pdo->prepare('INSERT INTO arzt (name, adresse, telefon, webseite, email) VALUES (:name, :adresse, :telefon, :webseite, :email)');
        $stmt->execute([
            'name' => $data['name'],
            'adresse' => $data['adresse'] ?? '',
            'telefon' => $data['telefon'] ?? '',
            'webseite' => $data['webseite'] ?? '',
            'email' => $data['email'] ?? ''
        ]);
        $id = $pdo->lastInsertId();
        $arzt = [
            'id' => $id,
            'name' => $data['name'],
            'adresse' => $data['adresse'] ?? '',
            'telefon' => $data['telefon'] ?? '',
            'webseite' => $data['webseite'] ?? '',
            'email' => $data['email'] ?? ''
        ];
        echo json_encode(['success' => true, 'arzt' => $arzt]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

try {
    // Hole alle Ärzte (id, name) aus der Tabelle 'arzt'
    $stmt = $pdo->query('SELECT id, name FROM arzt ORDER BY name');
    $aerzte = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($aerzte);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
