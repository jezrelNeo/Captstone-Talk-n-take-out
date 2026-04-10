<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'api/config.php';

try {
    // First, backup the current menu_items table
    $pdo->exec("CREATE TABLE menu_items_backup AS SELECT * FROM menu_items");

    // Define the mapping from current codes to allowed codes
    $codeMapping = [
        'R3' => 'R4',  // R3 not allowed, map to R4
        'R10' => 'R11', // R10 not allowed, map to R11
        'N1' => 'N3',  // N1 not allowed, map to N3
        'N2' => 'N5',  // N2 not allowed, map to N5
        'N4' => 'N6',  // N4 not allowed, map to N6
        'B1' => 'B3',  // B1 not allowed, map to B3
        'B2' => 'B4',  // B2 not allowed, map to B4
        'B10' => 'B11', // B10 not allowed, map to B11
        'P3' => 'P4',  // P3 not allowed, map to P4
        'P10' => 'P11', // P10 not allowed, map to P11
        'D3' => 'D4',  // D3 not allowed, map to D4
        // Add more mappings as needed for any other invalid codes found
    ];

    // Update the menu_items table with new codes
    foreach ($codeMapping as $oldCode => $newCode) {
        $stmt = $pdo->prepare("UPDATE menu_items SET code = ? WHERE code = ?");
        $stmt->execute([$newCode, $oldCode]);
    }

    // Also update any references in orders table (items JSON field)
    foreach ($codeMapping as $oldCode => $newCode) {
        // Update orders table where items contain the old code
        $stmt = $pdo->prepare("
            UPDATE orders
            SET items = REPLACE(items, '\"code\":\"$oldCode\"', '\"code\":\"$newCode\"')
            WHERE items LIKE '%\"code\":\"$oldCode\"%'
        ");
        $stmt->execute();
    }

    // Verify no duplicate codes exist
    $stmt = $pdo->query("SELECT code, COUNT(*) as count FROM menu_items GROUP BY code HAVING count > 1");
    $duplicates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($duplicates)) {
        // If duplicates found, we need to handle them
        // For now, we'll log them but continue
        error_log("Warning: Duplicate codes found after update: " . json_encode($duplicates));
    }

    // Get updated menu items count
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM menu_items");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Menu codes updated successfully",
        "backup_created" => true,
        "total_items" => $count['total'],
        "mappings_applied" => count($codeMapping),
        "duplicates_found" => count($duplicates)
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Failed to update menu codes: " . $e->getMessage()
    ]);
}
?>
