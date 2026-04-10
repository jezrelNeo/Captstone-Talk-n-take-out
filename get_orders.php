<?php
// get_order.php
header("Content-Type: application/json");

// DB connection
$host = "localhost";
$user = "root"; // Adjust if needed
$pass = ""; // Add password if needed
$db = "coffee_master";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    error_log("DB connection failed: " . $conn->connect_error);
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// Get orderId from query string
if (!isset($_GET["orderId"])) {
    echo json_encode(["success" => false, "message" => "Missing orderId"]);
    exit;
}

$orderId = $conn->real_escape_string($_GET["orderId"]);

$sql = "SELECT order_id, username, items, total, timestamp, order_type FROM orders WHERE order_id = '$orderId' LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $row["items"] = json_decode($row["items"], true);
    echo json_encode(["success" => true, "order" => $row]);
} else {
    error_log("Order not found for orderId: $orderId");
    echo json_encode(["success" => false, "message" => "Order not found"]);
}

$conn->close();
?>