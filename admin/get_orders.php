// get_orders.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors_get_orders.log');

try {
    $host = "localhost";
    $user = "root";
    $pass = "";
    $db = "coffee_master";

    $conn = new mysqli($host, $user, $pass, $db);

    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
        exit;
    }

    // Check if orders table exists
    $table_check = $conn->query("SHOW TABLES LIKE 'orders'");
    if ($table_check->num_rows == 0) {
        error_log("Orders table does not exist in coffee_master database");
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "Orders table does not exist"]);
        $conn->close();
        exit;
    }

    $sql = "SELECT order_id, username, items, total, created_at FROM orders ORDER BY created_at DESC LIMIT 50";
    $result = $conn->query($sql);

    if ($result === false) {
        error_log("SQL query failed: " . $conn->error);
        ob_end_clean();
        echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
        $conn->close();
        exit;
    }

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $row["items"] = json_decode($row["items"], true) ?: [];
        $orders[] = $row;
    }

    ob_end_clean();
    echo json_encode(["success" => true, "orders" => $orders], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    $conn->close();
} catch (Exception $e) {
    error_log("Exception in get_orders.php: " . $e->getMessage());
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>
