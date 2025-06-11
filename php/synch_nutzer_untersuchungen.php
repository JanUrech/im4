<?php
// DB-Verbindung aufbauen
require_once __DIR__ . '/../system/config.php';
header('Content-Type: text/plain; charset=UTF-8');

// Nutzer und Untersuchungen abfragen
$nutzerStmt = $pdo->query("SELECT ID FROM nutzer");
$untersuchungStmt = $pdo->query("SELECT ID FROM untersuchung");

$nutzer = $nutzerStmt->fetchAll(PDO::FETCH_COLUMN);
$untersuchungen = $untersuchungStmt->fetchAll(PDO::FETCH_COLUMN);

// Vorbereitete Einfüge-Abfrage
$insertStmt = $pdo->prepare("
    INSERT INTO nutzer_untersuchung 
    (nutzer_id, untersuchung_id, arzt_id, letzte_untersuchung, naechste_untersuchung, regelmaessigkeit_monate, status) 
    VALUES 
    (:nutzer_id, :untersuchung_id, NULL, NULL, NULL, NULL, 'offen')
");

// Alle Kombinationen einfügen
foreach ($nutzer as $nutzerId) {
    foreach ($untersuchungen as $untersuchungId) {

        // Optional: prüfen, ob Kombination bereits existiert
        $checkStmt = $pdo->prepare("
            SELECT COUNT(*) FROM nutzer_untersuchung 
            WHERE nutzer_id = :nutzer_id AND untersuchung_id = :untersuchung_id
        ");
        $checkStmt->execute([
            'nutzer_id' => $nutzerId,
            'untersuchung_id' => $untersuchungId
        ]);

        if ($checkStmt->fetchColumn() == 0) {
            // Nur einfügen, wenn Kombination noch nicht existiert
            $insertStmt->execute([
                'nutzer_id' => $nutzerId,
                'untersuchung_id' => $untersuchungId
            ]);
        }
    }
}
echo "Einträge erfolgreich eingefügt.";
