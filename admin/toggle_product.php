<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "coffee_master";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed"]));
}

$id = intval($_POST['id']);
$newStatus = intval($_POST['available']);

$sql = "UPDATE menu_items SET is_available = $newStatus WHERE id = $id";
if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Status updated!"]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}

$conn->close();
?>