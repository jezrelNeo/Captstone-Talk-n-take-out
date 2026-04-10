<?php
require_once 'api/config.php';

try {
    // Add status column to orders table
    $pdo->exec("ALTER TABLE orders ADD COLUMN status VARCHAR(20) DEFAULT 'pending'");

    // Add orderType column to orders table
    $pdo->exec("ALTER TABLE orders ADD COLUMN orderType VARCHAR(20) DEFAULT 'Dine In'");

    echo "Database updated successfully! Added status and orderType columns to orders table.";

} catch (Exception $e) {
    echo "Error updating database: " . $e->getMessage();
}
?>
