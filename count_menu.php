<?php
require_once 'api/config.php';

try {
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM menu_items");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Total menu items: " . $result['count'] . "\n";

    // Also show by category
    $stmt = $pdo->prepare("SELECT category, COUNT(*) as count FROM menu_items GROUP BY category ORDER BY category");
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "\nBy category:\n";
    foreach ($categories as $cat) {
        echo "- " . $cat['category'] . ": " . $cat['count'] . "\n";
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . '\n';
}
?>
