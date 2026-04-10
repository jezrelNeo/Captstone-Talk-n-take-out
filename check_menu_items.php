<?php
require_once 'api/config.php';

try {
    $stmt = $pdo->query('SHOW TABLES LIKE "menu_items"');
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (empty($result)) {
        echo 'menu_items table does not exist\n';
    } else {
        echo 'menu_items table exists\n';
        $stmt = $pdo->query('DESCRIBE menu_items');
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo 'Columns:\n';
        foreach ($columns as $col) {
            echo '- ' . $col['Field'] . ' (' . $col['Type'] . ')\n';
        }
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . '\n';
}
?>
