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
    u_untersuchung.untersuchungen_id,
    untersuchungen.Untersuchung AS name,
    u_untersuchung.letzte_untersuchung,
    u_untersuchung.naechste_untersuchung,
    u_untersuchung.status,
    u_untersuchung.arzt_id
FROM nutzer_untersuchung u_untersuchung
JOIN untersuchungen ON untersuchungen.ID = u_untersuchung.untersuchungen_id
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
    $status = $row['status'];
    $id = $row['untersuchungen_id']; // Klein geschrieben, wie in der SQL-Auswahl
    $letzte = $row['letzte_untersuchung'];
    $naechste = $row['naechste_untersuchung'];
    $arzt_id = $row['arzt_id'];
    // Status-basiertes Routing
    if ($status === 'offen') {
        $data['noetige'][] = ['id' => $id, 'name' => $name, 'arzt_id' => $arzt_id];
    } elseif ($status === 'geplant') {
        $data['geplante'][] = [
            'id' => $id,
            'name' => $name,
            'naechste_untersuchung' => $naechste,
            'arzt_id' => $arzt_id
        ];
    } elseif ($status === 'erledigt') {
        $data['erledigte'][] = [
            'id' => $id,
            'name' => $name,
            'letzte_untersuchung' => $letzte,
            'arzt_id' => $arzt_id
        ];
    } elseif ($status === 'abgelehnt') {
        $data['nichtDurchgefuehrte'][] = ['id' => $id, 'name' => $name, 'arzt_id' => $arzt_id];
    }
    // Optional: weitere Status oder Anzeigearten können ergänzt werden
}

echo json_encode($data);
