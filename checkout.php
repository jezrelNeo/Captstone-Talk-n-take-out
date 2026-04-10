<?php
header('Content-Type: application/json');

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "coffee_master";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "DB Error"]));
}

// Function to generate short order ID: 2 letters + 3 numbers
function generateShortOrderId() {
    $letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $numbers = '0123456789';

    $letter1 = $letters[rand(0, 25)];
    $letter2 = $letters[rand(0, 25)];
    $num1 = $numbers[rand(0, 9)];
    $num2 = $numbers[rand(0, 9)];
    $num3 = $numbers[rand(0, 9)];

    return $letter1 . $letter2 . $num1 . $num2 . $num3;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['items']) || !is_array($data['items'])) {
    echo json_encode(["success" => false, "error" => "Invalid items"]);
    exit;
}

// Use sent values OR recalculate safely
$subtotal = floatval($data["subtotal"] ?? 0);
if ($subtotal <= 0) {
    // Fallback: calculate from items
    foreach ($data['items'] as $item) {
        $subtotal += floatval($item['price'] ?? 0) * intval($item['quantity'] ?? 0);
    }
}

$total = $subtotal;

$orderId   = generateShortOrderId();
$username  = $data["username"] ?? "guest";
$orderType = $data["orderType"] ?? "Dine In";
$items     = $data["items"];

$itemsJson = json_encode($items, JSON_UNESCAPED_UNICODE);

// Count items for analytics
$coffee_count = 0;
$bread_count = 0;
$pastry_count = 0;

foreach ($items as $item) {
    $category = strtolower($item['category'] ?? '');
    if (strpos($category, 'coffee') !== false) {
        $coffee_count += intval($item['quantity'] ?? 1);
    } elseif (strpos($category, 'bread') !== false) {
        $bread_count += intval($item['quantity'] ?? 1);
    } elseif (strpos($category, 'pastry') !== false) {
        $pastry_count += intval($item['quantity'] ?? 1);
    }
}

$stmt = $conn->prepare("INSERT INTO orders
    (order_id, username, items, subtotal, total, coffee_count, bread_count, pastry_count, order_type, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())");

$stmt->bind_param("sssddiiis", $orderId, $username, $itemsJson, $subtotal, $total, $coffee_count, $bread_count, $pastry_count, $orderType);

if ($stmt->execute()) {
    echo json_encode([
        "success"   => true,
        "order_id"  => $orderId,
        "total"     => $total
    ]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
