<?php
require_once 'api/config.php';

try {
    // Drop the specified columns from orders table
    $pdo->exec("ALTER TABLE orders DROP COLUMN coffee_count");
    $pdo->exec("ALTER TABLE orders DROP COLUMN bread_count");
    $pdo->exec("ALTER TABLE orders DROP COLUMN pastry_count");
    $pdo->exec("ALTER TABLE orders DROP COLUMN orderType");

    echo "Database updated successfully! Dropped coffee_count, bread_count, pastry_count, and orderType columns from orders table.";

} catch (Exception $e) {
    echo "Error updating database: " . $e->getMessage();
}
?>
