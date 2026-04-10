<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Adjust in production!

require_once 'config.php'; // Your DB connection

try {
    $stmt = $pdo->prepare("
        SELECT 
            code, name, category, price, description, image
        FROM menu_items 
        WHERE is_available = 1 
        ORDER BY sort_order, name
    ");
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format price properly
    foreach ($items as &$item) {
        $item['price'] = (float)$item['price'];
        // Fix image path if needed
        if ($item['image'] && !str_starts_with($item['image'], 'http')) {
            $item['image'] = 'https://yourdomain.com/' . ltrim($item['image'], '/');
        }
    }

    echo json_encode([
        "success" => true,
        "data" => $items,
        "count" => count($items)
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Failed to load menu"
    ]);
}
?>