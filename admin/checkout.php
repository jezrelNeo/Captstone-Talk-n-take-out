<?php
// checkout.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors_checkout.log'); // Specific log file

// Database connection
$host = "localhost";
$user = "root";
$pass = "";
$db = "coffee_master";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    error_log("DB connection failed in checkout.php: " . $conn->connect_error);
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "DB connection failed: " . $conn->connect_error]);
    exit;
}

// Check if orders table exists
$table_check = $conn->query("SHOW TABLES LIKE 'orders'");
if ($table_check->num_rows == 0) {
    error_log("Orders table does not exist in checkout.php");
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Orders table does not exist"]);
    $conn->close();
    exit;
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);
error_log("Received POST data: " . print_r($data, true)); // Log incoming data
if (!$data || !isset($data['cartItems']) || !isset($data['total']) || !isset($data['username'])) {
    error_log("Invalid or missing POST data in checkout.php");
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Invalid or missing request data"]);
    $conn->close();
    exit;
}

// Prepare order data
$order_id = uniqid("order_");
$username = $conn->real_escape_string($data['username']);
$items = json_encode($data['cartItems']);
$total = floatval($data['total']);
$subtotal = $total; // No tax calculation

// Insert order
$sql = "INSERT INTO orders (order_id, username, items, subtotal, total, order_type, status, created_at) VALUES (?, ?, ?, ?, ?, 'Dine In', 'pending', NOW())";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log("Prepare failed in checkout.php: " . $conn->error);
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("sssds", $order_id, $username, $items, $subtotal, $total);
if (!$stmt->execute()) {
    error_log("Execute failed in checkout.php: " . $stmt->error);
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Execute failed: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}

// Verify insertion
$verify_sql = "SELECT order_id FROM orders WHERE order_id = ?";
$verify_stmt = $conn->prepare($verify_sql);
$verify_stmt->bind_param("s", $order_id);
$verify_stmt->execute();
$result = $verify_stmt->get_result();
if ($result->num_rows === 0) {
    error_log("Order $order_id not found after insertion in checkout.php");
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Order not saved"]);
    $stmt->close();
    $verify_stmt->close();
    $conn->close();
    exit;
}

ob_end_clean();
echo json_encode(["success" => true, "order_id" => $order_id]);

$stmt->close();
$verify_stmt->close();
$conn->close();
?>
