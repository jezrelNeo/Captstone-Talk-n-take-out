<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "coffee_master";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die(json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

$orderId    = $data["orderId"] ?? "";
$username   = $data["username"] ?? "guest"; // default username if not provided
$orderType  = $data["orderType"] ?? "Dine-in"; // default if not provided
$items      = $data["items"] ?? [];
$subtotal   = $data["subtotal"] ?? 0;
$total      = $data["total"] ?? 0;

// --- Count items per category ---
$coffeeCount = 0;
$breadCount  = 0;
$pastryCount = 0;

foreach ($items as $item) {
  $category = strtolower($item["category"] ?? "");
  $qty = intval($item["quantity"]);

  if (strpos($category, "coffee") !== false || strpos($category, "beverage") !== false) {
    $coffeeCount += $qty;
  } elseif (strpos($category, "bread") !== false) {
    $breadCount += $qty;
  } elseif (
    strpos($category, "pastry") !== false ||
    strpos($category, "pastries") !== false ||
    strpos($category, "cake") !== false
  ) {
    $pastryCount += $qty;
  }
}

$itemsJson = json_encode($items, JSON_UNESCAPED_UNICODE);

// --- Prepared Statement ---
$stmt = $conn->prepare("INSERT INTO orders
  (order_id, username, items, subtotal, total, order_type, status, coffee_count, bread_count, pastry_count, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");

$status = 'pending'; // Default status for new orders

$stmt->bind_param(
  "ssssssssss",
  $orderId,
  $username,
  $itemsJson,
  $subtotal,
  $total,
  $orderType,
  $status,
  $coffeeCount,
  $breadCount,
  $pastryCount
);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Order saved successfully"]);
} else {
  echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
