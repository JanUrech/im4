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
$letzteUntersuchung = $_POST['letzte_untersuchung'] ?? null; // Neues Datum für erledigte

// Prüfen, ob mindestens eine Aktion übergeben wurde
if (!$untersuchungenId || (!$status && !$naechsteUntersuchung && !$letzteUntersuchung)) {
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

// --- NEU: Wenn naechste_untersuchung < heute, verschiebe sie nach letzte_untersuchung ---
$heute = date('Y-m-d');
if ($naechsteUntersuchung && $naechsteUntersuchung < $heute) {
    // Setze letzte_untersuchung auf naechste_untersuchung, lösche naechste_untersuchung und setze Status auf erledigt
    $stmt = $pdo->prepare('UPDATE nutzer_untersuchung SET letzte_untersuchung = :letzte, naechste_untersuchung = NULL, status = "erledigt" WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
    $stmt->execute([
        'letzte' => $naechsteUntersuchung,
        'nutzer_id' => $nutzerId,
        'untersuchungen_id' => $untersuchungenId
    ]);
}

// Datum der letzten Untersuchung speichern (für erledigte)
if ($letzteUntersuchung) {
    $stmt = $pdo->prepare('UPDATE nutzer_untersuchung SET letzte_untersuchung = :letzte_untersuchung WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
    $stmt->execute([
        'letzte_untersuchung' => $letzteUntersuchung,
        'nutzer_id' => $nutzerId,
        'untersuchungen_id' => $untersuchungenId
    ]);

    // Fälligkeit berechnen: Hole die Frequenz in Jahren aus untersuchungen
    $stmtFreq = $pdo->prepare('SELECT frequenz FROM untersuchungen WHERE ID = :untersuchungen_id');
    $stmtFreq->execute(['untersuchungen_id' => $untersuchungenId]);
    $freqRow = $stmtFreq->fetch(PDO::FETCH_ASSOC);
    if ($freqRow && is_numeric($freqRow['frequenz'])) {
        $years = (int)$freqRow['frequenz'];
        // Fälligkeit berechnen
        $faelligkeit = date('Y-m-d', strtotime($letzteUntersuchung . ' + ' . $years . ' years'));
        // In DB speichern
        $stmtFaellig = $pdo->prepare('UPDATE nutzer_untersuchung SET faelligkeit_untersuchung = :faelligkeit WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
        $stmtFaellig->execute([
            'faelligkeit' => $faelligkeit,
            'nutzer_id' => $nutzerId,
            'untersuchungen_id' => $untersuchungenId
        ]);
    }
}

// Erfolgsmeldung zurückgeben
// Nach jedem Update: Status automatisch anpassen
require_once __DIR__ . '/auto_update_status.php';
// Skript beenden, damit nicht zweimal JSON ausgegeben wird
exit;
