<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Nicht eingeloggt']);
    exit;
}

require_once __DIR__ . '/../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $age = $input['age'] ?? null;
    $gender = $input['gender'] ?? null;
    $height = $input['height'] ?? null; // Expected in meters
    $weight = $input['weight'] ?? null;
    
    // Convert gender back to database format
    $gender_db = '';
    if ($gender === 'männlich') $gender_db = 'm';
    else if ($gender === 'weiblich') $gender_db = 'w';
    else if ($gender === 'divers') $gender_db = 'd';
    
    // Convert height from meters to cm
    $height_cm = $height * 100;
    
    // Calculate BMI
    $bmi = $height_cm > 0 ? round($weight / pow($height_cm / 100, 2), 1) : null;
    
    try {
        $stmt = $pdo->prepare("
            UPDATE nutzer 
            SET alter_jahre = :age, geschlecht = :gender, groesse_cm = :height_cm, gewicht_kg = :weight, BMI = :bmi 
            WHERE ID = :user_id
        ");
        
        $stmt->execute([
            ':age' => $age,
            ':gender' => $gender_db,
            ':height_cm' => $height_cm,
            ':weight' => $weight,
            ':bmi' => $bmi,
            ':user_id' => $_SESSION['user_id']
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Profil erfolgreich aktualisiert']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Datenbankfehler: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Nur POST-Anfragen erlaubt']);
}
?>