<?php
require_once 'api/config.php';

try {
    // Check table structure
    echo "=== ORDERS TABLE STRUCTURE ===\n";
    $result = $pdo->query("DESCRIBE orders");
    $columns = $result->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        echo "{$col['Field']}: {$col['Type']} - Default: {$col['Default']}\n";
    }

    echo "\n=== ALL ORDERS IN DATABASE ===\n";
    $result = $pdo->query("SELECT * FROM orders ORDER BY id DESC");
    $orders = $result->fetchAll(PDO::FETCH_ASSOC);

    if (count($orders) == 0) {
        echo "No orders found in database.\n";
    } else {
        foreach ($orders as $order) {
            echo "ID: {$order['id']}, Order ID: {$order['order_id']}, Status: {$order['status']}, Created: {$order['created_at']}\n";
            echo "Items: " . substr($order['items'], 0, 100) . "...\n";
            echo "Total: {$order['total']}, Type: {$order['order_type']}\n\n";
        }
    }

    echo "\n=== PENDING ORDERS COUNT ===\n";
    $result = $pdo->query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    $count = $result->fetch()['count'];
    echo "Pending orders: $count\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
