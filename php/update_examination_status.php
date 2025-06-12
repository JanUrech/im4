<?php
// Startet die Session und gibt die Antwort als JSON zurück
session_start();
header('Content-Type: application/json; charset=UTF-8');

// Datenbankverbindung laden
require_once __DIR__ . '/../system/config.php';

// Prüfen, ob der Nutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Nicht eingeloggt']);
    exit;
}

$nutzerId = $_SESSION['user_id'];
$untersuchungenId = $_POST['untersuchungen_id'] ?? null; // ID der Untersuchung
$status = $_POST['status'] ?? null; // Neuer Status
$naechsteUntersuchung = $_POST['naechste_untersuchung'] ?? null; // Neues Datum

// Prüfen, ob mindestens eine Aktion übergeben wurde
if (!$untersuchungenId || (!$status && !$naechsteUntersuchung)) {
    echo json_encode(['error' => 'Fehlende Parameter']);
    exit;
}

// Status der Untersuchung für den Nutzer aktualisieren
if ($status) {
    $stmt = $pdo->prepare('UPDATE nutzer_untersuchung SET status = :status WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
    $stmt->execute([
        'status' => $status,
        'nutzer_id' => $nutzerId,
        'untersuchungen_id' => $untersuchungenId
    ]);
}
// Datum der nächsten Untersuchung speichern
if ($naechsteUntersuchung) {
    $stmt = $pdo->prepare('UPDATE nutzer_untersuchung SET naechste_untersuchung = :naechste_untersuchung WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
    $stmt->execute([
        'naechste_untersuchung' => $naechsteUntersuchung,
        'nutzer_id' => $nutzerId,
        'untersuchungen_id' => $untersuchungenId
    ]);
}

// Erfolgsmeldung zurückgeben
echo json_encode(['success' => true]);
