<?php
require_once 'api/config.php';

try {
    $result = $pdo->query("SELECT COUNT(*) as total FROM orders");
    $total = $result->fetch()['total'];

    echo "Total orders in database: $total\n";

    if ($total > 0) {
        $result = $pdo->query("SELECT id, order_id, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5");
        $orders = $result->fetchAll(PDO::FETCH_ASSOC);

        echo "\nRecent orders:\n";
        foreach ($orders as $order) {
            echo "ID: {$order['id']}, Order ID: {$order['order_id']}, Status: {$order['status']}, Created: {$order['created_at']}\n";
        }
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
