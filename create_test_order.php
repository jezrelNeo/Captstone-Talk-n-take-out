<?php
require_once 'api/config.php';

try {
    // Create a test order
    $testOrder = [
        'order_id' => 'TEST-' . time(),
        'username' => 'test_user',
        'items' => json_encode([
            ['name' => 'Test Coffee', 'price' => 5.00, 'quantity' => 1, 'category' => 'coffee']
        ]),
        'subtotal' => 5.00,
        'total' => 5.00,
        'order_type' => 'Dine In',
        'status' => 'pending',
        'coffee_count' => 1,
        'bread_count' => 0,
        'pastry_count' => 0
    ];

    $sql = "INSERT INTO orders (order_id, username, items, subtotal, total, order_type, status, coffee_count, bread_count, pastry_count, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $testOrder['order_id'],
        $testOrder['username'],
        $testOrder['items'],
        $testOrder['subtotal'],
        $testOrder['total'],
        $testOrder['order_type'],
        $testOrder['status'],
        $testOrder['coffee_count'],
        $testOrder['bread_count'],
        $testOrder['pastry_count']
    ]);

    echo "Test order created successfully with ID: " . $pdo->lastInsertId() . "\n";

} catch (Exception $e) {
    echo "Error creating test order: " . $e->getMessage();
}
?>
