-- Update menu item codes to use only allowed codes
-- First, create a backup of the menu_items table
CREATE TABLE menu_items_backup AS SELECT * FROM menu_items;

-- Update invalid codes to valid ones
-- R codes
UPDATE menu_items SET code = 'R4' WHERE code = 'R3';
UPDATE menu_items SET code = 'R11' WHERE code = 'R10';

-- N codes
UPDATE menu_items SET code = 'N3' WHERE code = 'N1';
UPDATE menu_items SET code = 'N5' WHERE code = 'N2';
UPDATE menu_items SET code = 'N6' WHERE code = 'N4';

-- B codes
UPDATE menu_items SET code = 'B3' WHERE code = 'B1';
UPDATE menu_items SET code = 'B4' WHERE code = 'B2';
UPDATE menu_items SET code = 'B11' WHERE code = 'B10';

-- P codes
UPDATE menu_items SET code = 'P4' WHERE code = 'P3';
UPDATE menu_items SET code = 'P11' WHERE code = 'P10';

-- D codes
UPDATE menu_items SET code = 'D4' WHERE code = 'D3';

-- Update orders table to reflect the new codes in the items JSON
-- R codes
UPDATE orders SET items = REPLACE(items, '"code":"R3"', '"code":"R4"') WHERE items LIKE '%"code":"R3"%';
UPDATE orders SET items = REPLACE(items, '"code":"R10"', '"code":"R11"') WHERE items LIKE '%"code":"R10"%';

-- N codes
UPDATE orders SET items = REPLACE(items, '"code":"N1"', '"code":"N3"') WHERE items LIKE '%"code":"N1"%';
UPDATE orders SET items = REPLACE(items, '"code":"N2"', '"code":"N5"') WHERE items LIKE '%"code":"N2"%';
UPDATE orders SET items = REPLACE(items, '"code":"N4"', '"code":"N6"') WHERE items LIKE '%"code":"N4"%';

-- B codes
UPDATE orders SET items = REPLACE(items, '"code":"B1"', '"code":"B3"') WHERE items LIKE '%"code":"B1"%';
UPDATE orders SET items = REPLACE(items, '"code":"B2"', '"code":"B4"') WHERE items LIKE '%"code":"B2"%';
UPDATE orders SET items = REPLACE(items, '"code":"B10"', '"code":"B11"') WHERE items LIKE '%"code":"B10"%';

-- P codes
UPDATE orders SET items = REPLACE(items, '"code":"P3"', '"code":"P4"') WHERE items LIKE '%"code":"P3"%';
UPDATE orders SET items = REPLACE(items, '"code":"P10"', '"code":"P11"') WHERE items LIKE '%"code":"P10"%';

-- D codes
UPDATE orders SET items = REPLACE(items, '"code":"D3"', '"code":"D4"') WHERE items LIKE '%"code":"D3"%';

-- Verify no duplicates exist
SELECT code, COUNT(*) as count
FROM menu_items
GROUP BY code
HAVING count > 1;

-- Show updated menu items
SELECT code, name, category
FROM menu_items
ORDER BY code;
