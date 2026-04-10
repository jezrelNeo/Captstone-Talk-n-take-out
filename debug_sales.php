<?php
require_once 'api/config.php';

try {
    echo "<h2>Sales Data Debug</h2>";

    // Check all completed orders
    echo "<h3>All Completed Orders:</h3>";
    $result = $pdo->query("SELECT id, order_id, total, created_at, status FROM orders WHERE status = 'completed' ORDER BY created_at DESC LIMIT 20");
    $orders = $result->fetchAll(PDO::FETCH_ASSOC);

    if (count($orders) > 0) {
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>ID</th><th>Order ID</th><th>Total</th><th>Date</th><th>Status</th></tr>";
        foreach ($orders as $order) {
            echo "<tr>";
            echo "<td>{$order['id']}</td>";
            echo "<td>{$order['order_id']}</td>";
            echo "<td>₱" . number_format($order['total'], 2) . "</td>";
            echo "<td>{$order['created_at']}</td>";
            echo "<td>{$order['status']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "No completed orders found.<br>";
    }

    // Check today's sales
    echo "<h3>Today's Sales (CURDATE()):</h3>";
    $todayResult = $pdo->query("SELECT SUM(total) as todaySales, COUNT(*) as orderCount FROM orders WHERE DATE(created_at) = CURDATE() AND status = 'completed'");
    $todayData = $todayResult->fetch(PDO::FETCH_ASSOC);
    echo "Today's Sales: ₱" . number_format($todayData['todaySales'] ?? 0, 2) . "<br>";
    echo "Today's Orders: " . ($todayData['orderCount'] ?? 0) . "<br>";

    // Check monthly sales
    echo "<h3>Monthly Sales (Current Month):</h3>";
    $monthlyResult = $pdo->query("SELECT SUM(total) as monthlySales FROM orders WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND status = 'completed'");
    $monthlyData = $monthlyResult->fetch(PDO::FETCH_ASSOC);
    echo "Monthly Sales: ₱" . number_format($monthlyData['monthlySales'] ?? 0, 2) . "<br>";

    // Check yearly sales
    echo "<h3>Yearly Sales (Current Year):</h3>";
    $yearlyResult = $pdo->query("SELECT SUM(total) as yearlySales FROM orders WHERE YEAR(created_at) = YEAR(CURDATE()) AND status = 'completed'");
    $yearlyData = $yearlyResult->fetch(PDO::FETCH_ASSOC);
    echo "Yearly Sales: ₱" . number_format($yearlyData['yearlySales'] ?? 0, 2) . "<br>";

    // Test the API directly
    echo "<h3>API Response Test:</h3>";
    $apiUrl = "http://localhost/ordering2/admin/api/dashboard_data.php";
    $context = stream_context_create([
        "http" => [
            "method" => "GET",
            "header" => "Content-Type: application/json"
        ]
    ]);

    $apiResponse = file_get_contents($apiUrl, false, $context);
    if ($apiResponse) {
        $data = json_decode($apiResponse, true);
        if ($data['success']) {
            echo "<pre>";
            echo "API Today Sales: ₱" . number_format($data['stats']['todaySales'], 2) . "\n";
            echo "API Monthly Sales: ₱" . number_format($data['stats']['monthlySales'], 2) . "\n";
            echo "API Yearly Sales: ₱" . number_format($data['stats']['yearlySales'], 2) . "\n";
            echo "</pre>";
        } else {
            echo "API Error: " . $data['message'];
        }
    } else {
        echo "Failed to fetch API data";
    }

    // Option to clear recent sales data
    echo "<h3>Clear Recent Sales Data (Optional):</h3>";
    echo "<form method='post'>";
    echo "<input type='checkbox' name='confirm_clear' value='1'> Confirm clearing all completed orders<br>";
    echo "<input type='submit' value='Clear All Completed Orders' style='background:red;color:white;padding:5px;margin:10px 0;'>";
    echo "</form>";

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirm_clear'])) {
        $pdo->exec("DELETE FROM orders WHERE status = 'completed'");
        echo "<p style='color:red;'>All completed orders have been cleared!</p>";
        echo "<script>window.location.reload();</script>";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
