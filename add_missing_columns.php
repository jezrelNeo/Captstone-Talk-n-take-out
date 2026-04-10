<?php
require_once 'api/config.php';

try {
    // Get existing columns
    $stmt = $pdo->query("DESCRIBE orders");
    $existingColumns = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $existingColumns[] = $row['Field'];
    }

    // Columns to add
    $columnsToAdd = [
        "order_type" => "VARCHAR(20) DEFAULT 'Dine In'",
        "status" => "VARCHAR(20) DEFAULT 'pending'",
        "coffee_count" => "INT DEFAULT 0",
        "bread_count" => "INT DEFAULT 0",
        "pastry_count" => "INT DEFAULT 0"
    ];

    foreach ($columnsToAdd as $column => $definition) {
        if (!in_array($column, $existingColumns)) {
            $pdo->exec("ALTER TABLE orders ADD COLUMN $column $definition");
            echo "Added $column column.<br>";
        } else {
            echo "$column column already exists.<br>";
        }
    }

    echo "All columns processed successfully!";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
