<?php
header("Content-Type: application/json");

require_once '../../api/config.php';

try {
    // ---------------- TODAY STATS ----------------
    $todayStatsSql = "
      SELECT
        IFNULL(SUM(total), 0) AS todaySales,
        IFNULL(SUM(coffee_count), 0) AS todayCoffee,
        IFNULL(SUM(bread_count), 0) AS todayBread,
        IFNULL(SUM(pastry_count), 0) AS todayPastry,
        COUNT(*) AS todayOrderCount
      FROM orders
      WHERE DATE(created_at) = CURDATE() AND status = 'completed'
    ";
    $todayStats = $pdo->query($todayStatsSql)->fetch(PDO::FETCH_ASSOC);

    // ---------------- ALL-TIME CATEGORY TOTALS ----------------
    $allTimeStatsSql = "
      SELECT
        IFNULL(SUM(coffee_count), 0) AS totalCoffee,
        IFNULL(SUM(bread_count), 0) AS totalBread,
        IFNULL(SUM(pastry_count), 0) AS totalPastry
      FROM orders
      WHERE status = 'completed'
    ";
    $allTimeStats = $pdo->query($allTimeStatsSql)->fetch(PDO::FETCH_ASSOC);

    // ---------------- MONTHLY & YEARLY ----------------
    $monthlySql = "SELECT IFNULL(SUM(total),0) AS monthlySales
                   FROM orders
                   WHERE MONTH(created_at) = MONTH(CURDATE())
                     AND YEAR(created_at) = YEAR(CURDATE())
                     AND status = 'completed'";
    $yearlySql  = "SELECT IFNULL(SUM(total),0) AS yearlySales
                   FROM orders
                   WHERE YEAR(created_at) = YEAR(CURDATE())
                     AND status = 'completed'";

    $monthlySales = $pdo->query($monthlySql)->fetch(PDO::FETCH_ASSOC)["monthlySales"];
    $yearlySales  = $pdo->query($yearlySql)->fetch(PDO::FETCH_ASSOC)["yearlySales"];

    // ---------------- CHART: DAILY SALES (Last 7 days) ----------------
    $dailySalesSql = "
      SELECT DATE(created_at) as date, SUM(total) as total
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND status = 'completed'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    ";
    $dailySales = [];
    $res = $pdo->query($dailySalesSql);
    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
      $dailySales[] = $row;
    }

    // ---------------- CHART: CATEGORY TOTALS ----------------
    $categorySql = "
      SELECT 'Coffee' as category, IFNULL(SUM(coffee_count),0) as qty FROM orders WHERE status = 'completed'
      UNION ALL
      SELECT 'Bread' as category, IFNULL(SUM(bread_count),0) as qty FROM orders WHERE status = 'completed'
      UNION ALL
      SELECT 'Pastry' as category, IFNULL(SUM(pastry_count),0) as qty FROM orders WHERE status = 'completed'
    ";
    $categoryData = [];
    $res = $pdo->query($categorySql);
    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
      $categoryData[] = $row;
    }

    // ---------------- CHART: DAILY CATEGORY SALES ----------------
    $dailyCategorySql = "
      SELECT DATE(created_at) as date,
             IFNULL(SUM(coffee_count),0) as Coffee,
             IFNULL(SUM(bread_count),0) as Bread,
             IFNULL(SUM(pastry_count),0) as Pastry
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND status = 'completed'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    ";
    $dailyCategorySales = [];
    $res = $pdo->query($dailyCategorySql);
    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
      $dailyCategorySales[] = $row;
    }

    // ---------------- FINAL RESPONSE ----------------
    $response = [
      "success" => true,
      "stats" => [
        "todaySales"   => (float)$todayStats["todaySales"],
        "monthlySales" => (float)$monthlySales,
        "yearlySales"  => (float)$yearlySales,
        "todayOrderCount" => (int)$todayStats["todayOrderCount"],
        "todayCoffee"  => (int)$todayStats["todayCoffee"],
        "todayBread"   => (int)$todayStats["todayBread"],
        "todayPastry"  => (int)$todayStats["todayPastry"],

        "totalCoffee"  => (int)$allTimeStats["totalCoffee"],
        "totalBread"   => (int)$allTimeStats["totalBread"],
        "totalPastry"  => (int)$allTimeStats["totalPastry"],
      ],
      "chartData" => [
        "dailySales"         => $dailySales,
        "categoryData"       => $categoryData,
        "dailyCategorySales" => $dailyCategorySales,
      ]
    ];

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
