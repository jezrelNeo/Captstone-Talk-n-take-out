<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once '../../api/config.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $orderId = $data['order_id'] ?? null;

    if (!$orderId) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => "Order ID is required"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Order deleted successfully"
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "error" => "Order not found"
        ]);
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Failed to delete order"
    ]);
}
?>
