<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../../api/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data['order_id'] ?? 0);

if ($id <= 0) {
    echo json_encode(["success" => false, "error" => "Invalid order ID"]);
    exit;
}

// Update status to completed instead of deleting
$sql = "UPDATE orders SET status = 'completed' WHERE id = ? AND status = 'pending'";

$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => true, "message" => "Order completed!"]);
} else {
    echo json_encode(["success" => false, "error" => "Order not found or already completed"]);
}
?>