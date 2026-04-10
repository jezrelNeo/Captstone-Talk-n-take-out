<?php
$mysqli = new mysqli("localhost", "root", "", "coffee_master");

if ($mysqli->connect_error) {
    die("❌ DB connection failed: " . $mysqli->connect_error);
} else {
    echo "✅ Connected to coffee_master!";
}
?>