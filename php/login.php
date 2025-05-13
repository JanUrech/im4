<?php

require_once __DIR__ . '/../system/config.php';
header('Content-Type: text/plain; charset=UTF-8');

$loginInfo = $_POST['loginInfo'] ?? '';
$password = $_POST['password'] ?? '';

echo "habe die Daten: $loginInfo und $password";
?>
