<?php
require_once 'api/config.php';

try {
    // Add status column if it doesn't exist
    $pdo->exec("ALTER TABLE orders ADD COLUMN status VARCHAR(20) DEFAULT 'pending'");
    echo "Added column: status\n";

    echo "Status column added successfully.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
