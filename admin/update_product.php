<?php
header("Content-Type: application/json");

require_once '../api/config.php';

try {
    error_log("update_product.php called with method: " . $_SERVER['REQUEST_METHOD']);
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
        throw new Exception('Invalid request method');
    }

    $id = $_POST['id'] ?? null;
    $name = trim($_POST['name'] ?? '');
    $code = trim(strtoupper($_POST['code'] ?? ''));
    $price = $_POST['price'] ?? null;
    $description = trim($_POST['description'] ?? '');
    $category = $_POST['category'] ?? '';
    $is_available = isset($_POST['is_available']) ? (int)$_POST['is_available'] : 1;

    if (!$id || !$name || !$code || $price === null || !$category) {
        throw new Exception('All required fields must be provided');
    }

    if (!is_numeric($price) || $price < 0) {
        throw new Exception('Invalid price');
    }

    // Check if product exists
    $checkStmt = $pdo->prepare("SELECT id FROM menu_items WHERE id = ?");
    $checkStmt->execute([$id]);
    if (!$checkStmt->fetch()) {
        throw new Exception('Product not found');
    }

    // Check if code is unique (excluding current product)
    $codeCheckStmt = $pdo->prepare("SELECT id FROM menu_items WHERE code = ? AND id != ?");
    $codeCheckStmt->execute([$code, $id]);
    if ($codeCheckStmt->fetch()) {
        throw new Exception('Product code already exists');
    }

    $imagePath = null;

    // Handle image upload if provided
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];
        $fileType = $_FILES['image']['type'];

        if (!in_array($fileType, $allowedTypes)) {
            throw new Exception('Invalid image type. Only JPG, PNG, GIF, WEBP, SVG, and BMP are allowed.');
        }

        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($_FILES['image']['size'] > $maxSize) {
            throw new Exception('Image file is too large. Maximum size is 5MB.');
        }

        $uploadDir = 'product_images/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileName = 'product_' . uniqid() . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $imagePath = $fileName;

            // Delete old image if exists
            $oldImageStmt = $pdo->prepare("SELECT image FROM menu_items WHERE id = ?");
            $oldImageStmt->execute([$id]);
            $oldImage = $oldImageStmt->fetchColumn();

            if ($oldImage && file_exists($uploadDir . $oldImage)) {
                unlink($uploadDir . $oldImage);
            }
        } else {
            throw new Exception('Failed to upload image');
        }
    }

    // Update product
    if ($imagePath) {
        $stmt = $pdo->prepare("
            UPDATE menu_items
            SET name = ?, code = ?, price = ?, description = ?, category = ?, is_available = ?, image = ?
            WHERE id = ?
        ");
        $stmt->execute([$name, $code, $price, $description, $category, $is_available, $imagePath, $id]);
    } else {
        $stmt = $pdo->prepare("
            UPDATE menu_items
            SET name = ?, code = ?, price = ?, description = ?, category = ?, is_available = ?
            WHERE id = ?
        ");
        $stmt->execute([$name, $code, $price, $description, $category, $is_available, $id]);
    }

    // Update product_categories table
    // First, delete existing categories for this product
    $deleteStmt = $pdo->prepare("DELETE FROM product_categories WHERE product_code = ?");
    $deleteStmt->execute([$code]);

    // Then insert the new category
    $insertStmt = $pdo->prepare("INSERT INTO product_categories (product_code, category) VALUES (?, ?)");
    $insertStmt->execute([$code, $category]);

    echo json_encode([
        "success" => true,
        "message" => "Product updated successfully"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
