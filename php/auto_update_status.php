<?php
// Dieses Skript aktualisiert den Status aller nutzer_untersuchung-Einträge automatisch anhand der Fälligkeit und geplanten Untersuchung
session_start();
header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../system/config.php';

// Prüfen, ob der Nutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Nicht eingeloggt']);
    exit;
}

$nutzerId = $_SESSION['user_id'];
$heute = date('Y-m-d');

// Alle relevanten Untersuchungen des Nutzers holen
$stmt = $pdo->prepare('SELECT untersuchungen_id, faelligkeit_untersuchung, naechste_untersuchung FROM nutzer_untersuchung WHERE nutzer_id = :nutzer_id');
$stmt->execute(['nutzer_id' => $nutzerId]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as $row) {
    $id = $row['untersuchungen_id'];
    $faellig = $row['faelligkeit_untersuchung'];
    $naechste = $row['naechste_untersuchung'];
    // Hole aktuellen Status aus der DB
    $stmtStatus = $pdo->prepare('SELECT status FROM nutzer_untersuchung WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
    $stmtStatus->execute([
        'nutzer_id' => $nutzerId,
        'untersuchungen_id' => $id
    ]);
    $statusRow = $stmtStatus->fetch(PDO::FETCH_ASSOC);
    $currentStatus = $statusRow ? $statusRow['status'] : '';
    // Wenn abgelehnt, nie überschreiben!
    if ($currentStatus === 'abgelehnt') {
        continue;
    }
    $status = 'offen';

    // Prüfe, ob letzte_untersuchung gesetzt ist und berechne ggf. faelligkeit_untersuchung neu
    $stmtLetzte = $pdo->prepare('SELECT letzte_untersuchung FROM nutzer_untersuchung WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
    $stmtLetzte->execute([
        'nutzer_id' => $nutzerId,
        'untersuchungen_id' => $id
    ]);
    $letzteRow = $stmtLetzte->fetch(PDO::FETCH_ASSOC);
    if ($letzteRow && $letzteRow['letzte_untersuchung']) {
        // --- NEU: Wenn letzte_untersuchung > heute, verschiebe sie nach naechste_untersuchung ---
        if ($letzteRow['letzte_untersuchung'] > $heute) {
            $stmt = $pdo->prepare('UPDATE nutzer_untersuchung SET naechste_untersuchung = :naechste, letzte_untersuchung = NULL, faelligkeit_untersuchung = NULL, status = "geplant" WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
            $stmt->execute([
                'naechste' => $letzteRow['letzte_untersuchung'],
                'nutzer_id' => $nutzerId,
                'untersuchungen_id' => $id
            ]);
            // Nach dem Verschieben: Wert für weitere Logik anpassen
            $naechste = $letzteRow['letzte_untersuchung'];
            $letzteRow['letzte_untersuchung'] = null;
            $faellig = null;
        } else {
            // Hole Frequenz aus untersuchungen
            $stmtFreq = $pdo->prepare('SELECT frequenz FROM untersuchungen WHERE ID = :untersuchungen_id');
            $stmtFreq->execute(['untersuchungen_id' => $id]);
            $freqRow = $stmtFreq->fetch(PDO::FETCH_ASSOC);
            if ($freqRow && is_numeric($freqRow['frequenz'])) {
                $years = (int)$freqRow['frequenz'];
                $faelligkeit = date('Y-m-d', strtotime($letzteRow['letzte_untersuchung'] . ' + ' . $years . ' years'));
                // In DB speichern, falls unterschiedlich
                if ($faellig != $faelligkeit) {
                    $stmtFaellig = $pdo->prepare('UPDATE nutzer_untersuchung SET faelligkeit_untersuchung = :faelligkeit WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
                    $stmtFaellig->execute([
                        'faelligkeit' => $faelligkeit,
                        'nutzer_id' => $nutzerId,
                        'untersuchungen_id' => $id
                    ]);
                    $faellig = $faelligkeit;
                }
            }
        }
    }

    // Status-Logik: Wenn naechste_untersuchung in der Zukunft, immer 'geplant'
    if ($naechste && $naechste > $heute) {
        $status = 'geplant';
    } elseif ($faellig && $faellig > $heute) {
        $status = 'erledigt';
    }
    $stmtUpdate = $pdo->prepare('UPDATE nutzer_untersuchung SET status = :status WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
    $stmtUpdate->execute([
        'status' => $status,
        'nutzer_id' => $nutzerId,
        'untersuchungen_id' => $id
    ]);
}

echo json_encode(['success' => true]);
