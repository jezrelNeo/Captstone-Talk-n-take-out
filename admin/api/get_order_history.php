<?php
session_start();
header("Content-Type: application/json");

require_once '../../api/config.php';

try {
    // Get only completed orders for history view
    $sql = "
        SELECT
            id,
            order_id,
            username,
            items,
            total,
            created_at,
            order_type,
            status
        FROM orders
        WHERE status = 'completed'
        ORDER BY created_at DESC
        LIMIT 100
    ";

    $result = $pdo->query($sql);
    $orders = $result->fetchAll(PDO::FETCH_ASSOC);

    // Format orders for history view
    $formattedOrders = [];
    foreach ($orders as $order) {
        $formattedOrders[] = [
            'id' => $order['id'],
            'order_id' => $order['order_id'],
            'username' => $order['username'],
            'total' => (float)$order['total'],
            'timestamp' => $order['created_at'],
            'order_type' => $order['order_type'],
            'items' => json_decode($order['items'], true) ?: []
        ];
    }

    // Always return success with orders array (empty if no completed orders)
    echo json_encode([
        "success" => true,
        "orders" => $formattedOrders,
        "message" => count($formattedOrders) . " completed orders found"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
