<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'api/config.php';

$allowedCodes = [
    'R1', 'R2', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R11', 'R12', 'R14', 'R15', 'R16', 'R17', 'R18', 'R19', 'R21', 'R22', 'R24', 'R25',
    'N0', 'N3', 'N5', 'N6', 'N7', 'N8', 'N9', 'N20', 'N21', 'N23', 'N24', 'N25', 'N26', 'N27', 'N28', 'N29', 'N30', 'N31', 'N32', 'N33',
    'D1', 'D2', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D11', 'D12', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19', 'D21', 'D22', 'D24', 'D25',
    'T0', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T11', 'T12', 'T14', 'T15', 'T16', 'T17', 'T18', 'T19', 'T21', 'T22', 'T24', 'T25',
    'P1', 'P2', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P11', 'P12',
    'B0', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B11', 'B12'
];

try {
    // Check menu_items table
    $stmt = $pdo->query("SELECT code, name FROM menu_items ORDER BY code");
    $menuItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $invalidCodes = [];
    $validCodes = [];
    $duplicates = [];

    $codeCount = [];
    foreach ($menuItems as $item) {
        $code = $item['code'];
        if (!in_array($code, $allowedCodes)) {
            $invalidCodes[] = $item;
        } else {
            $validCodes[] = $item;
        }

        if (!isset($codeCount[$code])) {
            $codeCount[$code] = 0;
        }
        $codeCount[$code]++;
    }

    foreach ($codeCount as $code => $count) {
        if ($count > 1) {
            $duplicates[] = ['code' => $code, 'count' => $count];
        }
    }

    // Check orders table for invalid codes in items JSON
    $stmt = $pdo->query("SELECT id, order_id, items FROM orders");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $ordersWithInvalidCodes = [];
    foreach ($orders as $order) {
        $items = json_decode($order['items'], true);
        if ($items && is_array($items)) {
            foreach ($items as $item) {
                if (isset($item['code']) && !in_array($item['code'], $allowedCodes)) {
                    $ordersWithInvalidCodes[] = [
                        'order_id' => $order['order_id'],
                        'invalid_code' => $item['code'],
                        'item_name' => $item['name'] ?? 'Unknown'
                    ];
                }
            }
        }
    }

    echo json_encode([
        "success" => true,
        "menu_items_total" => count($menuItems),
        "valid_codes_count" => count($validCodes),
        "invalid_codes_count" => count($invalidCodes),
        "duplicates_count" => count($duplicates),
        "orders_with_invalid_codes" => count($ordersWithInvalidCodes),
        "details" => [
            "invalid_codes" => $invalidCodes,
            "duplicates" => $duplicates,
            "orders_with_invalid_codes" => $ordersWithInvalidCodes
        ]
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Verification failed: " . $e->getMessage()
    ]);
}
?>
