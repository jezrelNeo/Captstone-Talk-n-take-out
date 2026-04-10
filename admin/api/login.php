<?php
header("Content-Type: application/json");
require_once("../db_connect.php");

$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"] ?? '';
$password = $data["password"] ?? '';

if (!$username || !$password) {
    echo json_encode(["success" => false, "message" => "Missing username or password"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM admin WHERE username = ? LIMIT 1");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user["password"])) {
    echo json_encode([
        "success" => true,
        "admin" => [
            "id" => $user["id"],
            "username" => $user["username"],
            "fullName" => $user["full_name"],
            "role" => $user["role"]
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid username or password"]);
}
