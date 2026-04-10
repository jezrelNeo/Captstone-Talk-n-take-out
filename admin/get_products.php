<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "coffee_master";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT mi.*, GROUP_CONCAT(pc.category) as categories
        FROM menu_items mi
        LEFT JOIN product_categories pc ON mi.code = pc.product_code
        GROUP BY mi.id, mi.code, mi.name, mi.price, mi.description, mi.image, mi.category, mi.is_available, mi.sort_order
        ORDER BY mi.sort_order ASC, mi.name ASC";
$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Keep backward compatibility
        if (empty($row['category']) && !empty($row['categories'])) {
            $row['category'] = explode(',', $row['categories'])[0];
        }
        $products[] = $row;
    }
}

echo json_encode(["success" => true, "products" => $products]);
$conn->close();
?>