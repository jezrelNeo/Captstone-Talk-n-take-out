<?php
header("Content-Type: application/json");

require_once '../../api/config.php';

try {
    // Get completed orders for today with items
    $sql = "
        SELECT
            id,
            order_id,
            username,
            items,
            total,
            created_at,
            order_type
        FROM orders
        WHERE status = 'completed'
        AND DATE(created_at) = CURDATE()
        ORDER BY created_at DESC
        LIMIT 50
    ";

    $result = $pdo->query($sql);
    $orders = $result->fetchAll(PDO::FETCH_ASSOC);

    // Format orders for dashboard
    $formattedOrders = [];
    foreach ($orders as $order) {
        $formattedOrders[] = [
            'id' => $order['id'],
            'orderId' => $order['order_id'],
            'username' => $order['username'],
            'total' => (float)$order['total'],
            'completedAt' => $order['created_at'],
            'orderType' => $order['order_type'],
            'items' => json_decode($order['items'], true) ?: []
        ];
    }

    // Get today's order count
    $countSql = "SELECT COUNT(*) as count FROM orders WHERE status = 'completed' AND DATE(created_at) = CURDATE()";
    $countResult = $pdo->query($countSql);
    $orderCount = $countResult->fetch()['count'];

    echo json_encode([
        "success" => true,
        "orders" => $formattedOrders,
        "todayOrderCount" => (int)$orderCount
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
