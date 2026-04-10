<?php
require_once(__DIR__ . '/db_connect.php');

session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();
        $_SESSION['adminSession'] = [
            "adminId" => $admin['id'],
            "username" => $admin['username'],
            "fullName" => $admin['full_name'],
            "role" => $admin['role'],
            "loginTime" => date("Y-m-d H:i:s")
        ];
        header("Location: dashboard.html");
        exit;
    } else {
        $error = "Invalid username or password";
    }
}
?>
