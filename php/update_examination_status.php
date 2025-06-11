<?php
session_start();
header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../system/config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Nicht eingeloggt']);
    exit;
}

$nutzerId = $_SESSION['user_id'];
$untersuchungenId = $_POST['untersuchungen_id'] ?? null;
$status = $_POST['status'] ?? null;

if (!$untersuchungenId || !$status) {
    echo json_encode(['error' => 'Fehlende Parameter']);
    exit;
}

$stmt = $pdo->prepare('UPDATE nutzer_untersuchung SET status = :status WHERE nutzer_id = :nutzer_id AND untersuchungen_id = :untersuchungen_id');
$stmt->execute([
    'status' => $status,
    'nutzer_id' => $nutzerId,
    'untersuchungen_id' => $untersuchungenId
]);

echo json_encode(['success' => true]);
