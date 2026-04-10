<?php
// delete_product.php
header('Content-Type: application/json');

// Read raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'No ID provided']);
    exit;
}

$id = intval($data['id']);

$conn = new mysqli("localhost", "root", "", "coffee_master");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Optional: Delete image file too
$sql = "SELECT image FROM menu_items WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row && $row['image'] && file_exists("uploads/" . $row['image'])) {
    @unlink("uploads/" . $row['image']); // delete image file
}

// Now delete from database
$sql = "DELETE FROM menu_items WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Product deleted']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete from database']);
}

$stmt->close();
$conn->close();
?>