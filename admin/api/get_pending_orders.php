<?php
header("Content-Type: application/json");

require_once '../../api/config.php';

try {
    // Get pending orders
    $stmt = $pdo->query("SELECT id, order_id, username, items, subtotal, total, order_type, status, created_at
                         FROM orders
                         WHERE status = 'pending'
                         ORDER BY created_at DESC");
    $orders = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $orders[] = [
            "id" => (int)$row["id"],
            "order_id" => $row["order_id"],
            "username" => $row["username"],
            "items" => $row["items"],
            "subtotal" => (float)$row["subtotal"],
            "total" => (float)$row["total"],
            "order_type" => $row["order_type"],
            "status" => $row["status"],
            "timestamp" => $row["created_at"]
        ];
    }

    echo json_encode(["success" => true, "orders" => $orders]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
