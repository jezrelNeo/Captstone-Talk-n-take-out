<?php
header("Content-Type: application/json");

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    $data = $_POST; // fallback
}

$username = trim($data['username'] ?? '');
$email    = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');
$contact  = trim($data['contact'] ?? '');

// Debugging: check if empty
if (!$username || !$email || !$password || !$contact) {
    echo json_encode([
        "success" => false,
        "message" => "All fields are required",
        "debug"   => $data // <-- will show you what PHP actually got
    ]);
    exit();
}

// ✅ Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// DB connection
$conn = new mysqli("localhost", "root", "", "coffee_master");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$sql = "INSERT INTO users (username, email, password, contact_number, registration_date)
        VALUES (?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $username, $email, $hashedPassword, $contact);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
