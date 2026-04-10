<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "coffee_master";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create product_categories table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS product_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_code VARCHAR(50) NOT NULL,
            category VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_product_category (product_code, category),
            FOREIGN KEY (product_code) REFERENCES menu_items(code) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ");

    // Migrate existing categories
    $stmt = $pdo->query("SELECT code, category FROM menu_items WHERE category IS NOT NULL AND category != ''");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($products as $product) {
        $insertStmt = $pdo->prepare("INSERT IGNORE INTO product_categories (product_code, category) VALUES (?, ?)");
        $insertStmt->execute([$product['code'], $product['category']]);
    }

    echo "Database schema updated successfully. Migrated " . count($products) . " products.\n";

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
