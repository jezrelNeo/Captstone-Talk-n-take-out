<?php
$servername = "localhost";
$username = "root";  // change if you set a password
$password = "";      // add your MySQL password here
$dbname = "coffee_master";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "DB Connection failed: " . $conn->connect_error]));
}
