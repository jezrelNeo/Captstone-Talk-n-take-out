<?php
require_once 'api/config.php';

try {
    // Add back the dropped columns
    $pdo->exec("ALTER TABLE orders ADD COLUMN coffee_count INT(11) NOT NULL DEFAULT 0");
    echo "Added column: coffee_count\n";

    $pdo->exec("ALTER TABLE orders ADD COLUMN bread_count INT(11) NOT NULL DEFAULT 0");
    echo "Added column: bread_count\n";

    $pdo->exec("ALTER TABLE orders ADD COLUMN pastry_count INT(11) NOT NULL DEFAULT 0");
    echo "Added column: pastry_count\n";

    $pdo->exec("ALTER TABLE orders ADD COLUMN order_type VARCHAR(50) DEFAULT 'Dine In'");
    echo "Added column: order_type\n";

    echo "Columns added back successfully.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
