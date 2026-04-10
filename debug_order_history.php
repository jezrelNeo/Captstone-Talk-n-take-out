<?php
require_once 'api/config.php';

try {
    echo "=== ORDER HISTORY DEBUG ===\n\n";

    // Check table structure
    echo "Table structure:\n";
    $result = $pdo->query('DESCRIBE orders');
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo $row['Field'] . ' - ' . $row['Type'] . ' - ' . $row['Null'] . ' - ' . $row['Default'] . "\n";
    }

    echo "\n\nOrder status counts:\n";
    $result = $pdo->query('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo $row['status'] . ': ' . $row['count'] . "\n";
    }

    echo "\n\nRecent orders (last 5):\n";
    $result = $pdo->query('SELECT id, order_id, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5');
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo $row['id'] . ' - ' . $row['order_id'] . ' - ' . $row['status'] . ' - ' . $row['created_at'] . "\n";
    }

    echo "\n\nCompleted orders (last 5):\n";
    $result = $pdo->query('SELECT id, order_id, status, created_at FROM orders WHERE status = "completed" ORDER BY created_at DESC LIMIT 5');
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo $row['id'] . ' - ' . $row['order_id'] . ' - ' . $row['status'] . ' - ' . $row['created_at'] . "\n";
    }

    echo "\n\nTesting get_order_history.php endpoint:\n";
    // Simulate the API call
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

    echo "Found " . count($orders) . " completed orders\n";

    if (count($orders) > 0) {
        echo "Sample order data:\n";
        $order = $orders[0];
        echo "ID: " . $order['id'] . "\n";
        echo "Order ID: " . $order['order_id'] . "\n";
        echo "Status: " . $order['status'] . "\n";
        echo "Total: " . $order['total'] . "\n";
        echo "Items: " . substr($order['items'], 0, 100) . "...\n";
    }

} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
?>
