<?php
header("Content-Type: application/json");
include "db.php";

$input = json_decode(file_get_contents("php://input"), true);
$email = $input["email"];
$password = $input["password"];

$stmt = $conn->prepare("SELECT username, password FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row["password"])) {
        echo json_encode([
            "success" => true,
            "username" => $row["username"] // ✅ Send username
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}
?>
