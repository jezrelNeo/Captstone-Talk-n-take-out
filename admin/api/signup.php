<?php
header("Content-Type: application/json");
require_once("../db_connect.php");

$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"] ?? '';
$password = $data["password"] ?? '';
$fullName = $data["fullName"] ?? '';

if (!$username || !$password || !$fullName) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

// Hash password (more secure than plain text)
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    // Check if username exists
    $checkStmt = $conn->prepare("SELECT id FROM admin WHERE username = ?");
    $checkStmt->bind_param("s", $username);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Username already exists."]);
        exit;
    }

    // Insert user
    $stmt = $conn->prepare("INSERT INTO admin (username, password, full_name, role, created_at) VALUES (?, ?, ?, 'user', NOW())");
    $stmt->bind_param("sss", $username, $hashedPassword, $fullName);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Account created successfully. Please login."]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
