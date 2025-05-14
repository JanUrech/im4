<?php
session_start();


// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Nicht eingeloggt !!!']);
    exit;
}

require_once __DIR__ . '/../system/config.php';

try {
    $stmt = $pdo->prepare("SELECT vorname, nachname, alter_jahre, geschlecht, groesse_cm, gewicht_kg, BMI FROM nutzer WHERE ID = :user_id");
    $stmt->execute([':user_id' => $_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Convert data to format expected by frontend
        $profile = [
            'vorname' => $user['vorname'],
            'nachname' => $user['nachname'],
            'age' => $user['alter_jahre'],
            'gender' => $user['geschlecht'] === 'm' ? 'männlich' : ($user['geschlecht'] === 'w' ? 'weiblich' : 'divers'),
            'height' => ($user['groesse_cm'] / 100), // Convert cm to m
            'weight' => $user['gewicht_kg'],
            'bmi' => $user['BMI']
        ];
        
        echo json_encode(['success' => true, 'profile' => $profile]);
    } else {
        echo json_encode(['error' => 'Profil nicht gefunden']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Datenbankfehler: ' . $e->getMessage()]);
}
?>