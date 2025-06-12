<?php
// DB-Verbindung aufbauen
require_once __DIR__ . '/../system/config.php';
header('Content-Type: text/plain; charset=UTF-8');

// Nutzer und Untersuchungen abfragen
$nutzerStmt = $pdo->query("SELECT ID FROM nutzer");
$untersuchungStmt = $pdo->query("SELECT id FROM untersuchungen");
$nutzer = $nutzerStmt->fetchAll(PDO::FETCH_COLUMN);
$untersuchungen = $untersuchungStmt->fetchAll(PDO::FETCH_COLUMN);

// Vorbereitete Einfüge-Abfrage
$insertStmt = $pdo->prepare("
    INSERT INTO nutzer_untersuchung 
    (nutzer_id, untersuchungen_id, arzt_id, letzte_untersuchung, naechste_untersuchung, status) 
    VALUES 
    (:nutzer_id, :untersuchungen_id, NULL, NULL, NULL, 'offen')
");

// Alle Kombinationen einfügen
foreach ($nutzer as $nutzerId) {
    foreach ($untersuchungen as $untersuchungId) {
        // Optional: prüfen, ob Kombination bereits existiert
        $checkStmt = $pdo->prepare("
            SELECT COUNT(*) FROM nutzer_untersuchung 
            WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id
        ");
        $checkStmt->execute([
            'nutzer_id' => $nutzerId,
            'untersuchungen_id' => $untersuchungId
        ]);
        if ($checkStmt->fetchColumn() == 0) {
            $insertStmt->execute([
                'nutzer_id' => $nutzerId,
                'untersuchungen_id' => $untersuchungId
            ]);
        }
    }
}
