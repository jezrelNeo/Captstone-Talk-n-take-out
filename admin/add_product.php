<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "coffee_master";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed"]));
}

$name = $conn->real_escape_string($_POST['name']);
$code = strtoupper(trim($_POST['code']));
$price = floatval($_POST['price']);
$description = $conn->real_escape_string($_POST['description']);
$category = $conn->real_escape_string($_POST['category']);
$is_available = isset($_POST['is_available']) ? 1 : 0;

$image = '';

$upload_dir = 'product_images/';
if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg','jpeg','png','gif','webp'];

    if (in_array($ext, $allowed) && $_FILES['image']['size'] <= 5000000) {
        $new_name = uniqid('product_') . '.' . $ext;
        $path = $upload_dir . $new_name;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $path)) {
            // Store only the filename
            $image = $new_name;
        }
    }
}

$image = $conn->real_escape_string($image);

$sql = "INSERT INTO menu_items (code, name, price, description, image, category, is_available) 
VALUES ('$code', '$name', $price, '$description', '$image', '$category', $is_available)";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Product added successfully!"]);
} else {
    if ($image !== '') @unlink($upload_dir . $image);
    echo json_encode(["success" => false, "message" => $conn->error]);
}

$conn->close();
?>
