<?php
session_start();
header('Content-Type: application/json; charset=UTF-8');

// DB-Verbindung
require_once __DIR__ . '/../system/config.php';

// Prüfen ob Nutzer eingeloggt
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Nicht eingeloggt']);
    exit;
}

$nutzerId = $_SESSION['user_id'];

// Daten abrufen (JOIN mit Untersuchung für Namen)
$stmt = $pdo->prepare(" 
SELECT 
    u_untersuchung.untersuchung_id,
    untersuchungen.Untersuchung AS name,
    u_untersuchung.letzte_untersuchung,
    u_untersuchung.naechste_untersuchung,
    u_untersuchung.status
FROM nutzer_untersuchung u_untersuchung
JOIN untersuchungen ON untersuchungen.ID = u_untersuchung.untersuchung_id
WHERE u_untersuchung.nutzer_id = :nutzer_id
");
$stmt->execute(['nutzer_id' => $nutzerId]);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Kategorien vorbereiten
$data = [
    'noetige' => [],
    'geplante' => [],
    'nichtDurchgefuehrte' => [],
    'erledigte' => []
];

// Alle in gleiche Kategorie verteilen (bis Status implementiert ist)
foreach ($results as $row) {
    $name = $row['name'];
    $letzte = $row['letzte_untersuchung'];
    $naechste = $row['naechste_untersuchung'];

    // Beispielhafte Zuordnung: Falls Datum für nächste Untersuchung vorhanden → geplante, sonst → noetige
    if (!empty($naechste)) {
        $data['geplante'][] = "$name (" . date('d.m.Y', strtotime($naechste)) . ")";
    } elseif (!empty($letzte)) {
        $data['noetige'][] = "$name (zuletzt am " . date('d.m.Y', strtotime($letzte)) . ")";
    } else {
        $data['noetige'][] = $name;
    }
}

echo json_encode($data);
