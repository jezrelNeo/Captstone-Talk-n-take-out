<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'config.php';

try {
    $stmt = $pdo->prepare("
        SELECT
            code, name, category, price, description, image, is_available
        FROM menu_items
        ORDER BY sort_order, name
    ");
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format price properly
    foreach ($items as &$item) {
        $item['price'] = (float)$item['price'];
        // Prepend the correct path for uploaded images
        if ($item['image']) {
            $item['image'] = 'admin/product_images/' . $item['image'];
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
