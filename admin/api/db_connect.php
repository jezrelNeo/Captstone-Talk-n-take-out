<?php
$host = "localhost";
$user = "root"; // default in XAMPP
$pass = "";     // default in XAMPP (empty password)
$db   = "coffee_master";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
