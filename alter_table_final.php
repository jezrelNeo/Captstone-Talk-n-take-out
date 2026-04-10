<?php
require_once 'api/config.php';

try {
    // Check current columns
    $result = $pdo->query("DESCRIBE orders");
    $columns = $result->fetchAll(PDO::FETCH_COLUMN, 0);
    echo "Current columns: " . implode(', ', $columns) . "\n";

    // Drop columns if they exist
    $columnsToDrop = ['coffee_count', 'bread_count', 'pastry_count', 'order_type'];
    foreach ($columnsToDrop as $col) {
        if (in_array($col, $columns)) {
            $pdo->exec("ALTER TABLE orders DROP COLUMN `$col`");
            echo "Dropped column: $col\n";
        } else {
            echo "Column $col not found\n";
        }
    }

    echo "Table altered successfully.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
