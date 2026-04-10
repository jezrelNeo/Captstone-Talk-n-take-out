<?php
header("Content-Type: application/json");

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "coffee_master";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  echo json_encode(["success" => false, "message" => "DB connection failed"]);
  exit;
}

$startDate = isset($_GET["startDate"]) ? $_GET["startDate"] : date("Y-m-d");
$endDate   = isset($_GET["endDate"]) ? $_GET["endDate"] : date("Y-m-d");

// Fetch orders in date range
$sql = "
  SELECT items 
  FROM orders 
  WHERE DATE(created_at) BETWEEN '$startDate' AND '$endDate'
";
$res = $conn->query($sql);

$inventory = [];

while ($row = $res->fetch_assoc()) {
  $items = json_decode($row["items"], true);
  if (is_array($items)) {
    foreach ($items as $item) {
      $name     = $conn->real_escape_string($item["name"]);
      $category = strtolower($item["category"]); // coffee, bread, pastry
      $qty      = intval($item["quantity"]);
      $price    = floatval($item["price"]);
      $revenue  = $qty * $price;

      $key = $name . "|" . $category;
      if (!isset($inventory[$key])) {
        $inventory[$key] = [
          "name"     => $name,
          "category" => $category,
          "quantity" => 0,
          "revenue"  => 0,
        ];
      }

      $inventory[$key]["quantity"] += $qty;
      $inventory[$key]["revenue"]  += $revenue;
    }
  }
}

$response = [
  "success" => true,
  "items"   => array_values($inventory)
];

echo json_encode($response);
$conn->close();
?>
