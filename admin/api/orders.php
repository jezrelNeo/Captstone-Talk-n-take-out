<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Get all orders
        $stmt = $pdo->prepare("
            SELECT
                id, order_id as orderId, username, items, total, status, orderType, created_at as timestamp
            FROM orders
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format data
        foreach ($orders as &$order) {
            $order['total'] = (float)$order['total'];
            $order['status'] = $order['status'] ?: 'pending';
            $order['orderType'] = $order['orderType'] ?: 'Dine In';
            $order['items'] = json_decode($order['items'], true) ?: [];
        }

        echo json_encode([
            "success" => true,
            "data" => $orders,
            "count" => count($orders)
        ]);

    } elseif ($method === 'PUT') {
        // Update order status
        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = $input['orderId'] ?? null;
        $status = $input['status'] ?? null;

        if (!$orderId || !$status) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "error" => "Missing orderId or status"
            ]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$status, $orderId]);

        echo json_encode([
            "success" => true,
            "message" => "Order status updated successfully"
        ]);

    } else {
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "error" => "Method not allowed"
        ]);
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>
