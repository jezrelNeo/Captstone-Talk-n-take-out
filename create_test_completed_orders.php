<?php
require_once 'api/config.php';

try {
    echo "=== CREATING TEST COMPLETED ORDERS ===\n\n";

    // Insert some test completed orders
    $testOrders = [
        [
            'order_id' => 'TEST001',
            'username' => 'testuser1',
            'items' => json_encode([
                ['name' => 'Test Coffee', 'price' => 50.00, 'quantity' => 2],
                ['name' => 'Test Cake', 'price' => 50.00, 'quantity' => 1]
            ]),
            'total' => 150.00,
            'order_type' => 'Dine In',
            'status' => 'completed'
        ],
        [
            'order_id' => 'TEST002',
            'username' => 'testuser2',
            'items' => json_encode([
                ['name' => 'Test Sandwich', 'price' => 75.00, 'quantity' => 1]
            ]),
            'total' => 75.00,
            'order_type' => 'Take Out',
            'status' => 'completed'
        ],
        [
            'order_id' => 'TEST003',
            'username' => 'testuser3',
            'items' => json_encode([
                ['name' => 'Test Burger', 'price' => 100.00, 'quantity' => 1],
                ['name' => 'Test Fries', 'price' => 30.00, 'quantity' => 1]
            ]),
            'total' => 130.00,
            'order_type' => 'Dine In',
            'status' => 'completed'
        ]
    ];

    foreach ($testOrders as $order) {
        $sql = "INSERT INTO orders (order_id, username, items, total, order_type, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $order['order_id'],
            $order['username'],
            $order['items'],
            $order['total'],
            $order['order_type'],
            $order['status']
        ]);
        echo "✅ Inserted order: {$order['order_id']}\n";
    }

    echo "\n=== VERIFYING COMPLETED ORDERS ===\n";

    // Check completed orders
    $result = $pdo->query("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'");
    $row = $result->fetch(PDO::FETCH_ASSOC);
    echo "Total completed orders: {$row['count']}\n";

    // Show recent completed orders
    $result = $pdo->query("SELECT id, order_id, status, created_at FROM orders WHERE status = 'completed' ORDER BY created_at DESC LIMIT 5");
    echo "\nRecent completed orders:\n";
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo "{$row['id']} - {$row['order_id']} - {$row['status']} - {$row['created_at']}\n";
    }

    echo "\n✅ Test completed orders created successfully!\n";
    echo "Now visit the Orders page and check the History tab to see if the orders appear.\n";

} catch (Exception $e) {
    echo '❌ Error: ' . $e->getMessage() . "\n";
}
?>
