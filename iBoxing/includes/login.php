<?php
session_start();
include_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    
    if (empty($username)) {
        echo json_encode(['success' => false, 'message' => 'Username is required']);
        exit();
    } else {
        $sql = "SELECT id FROM users WHERE username='$username'";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            echo json_encode(['success' => false, 'message' => 'Query failed: ' . mysqli_error($conn)]);
            exit();
        }
        $resultCheck = mysqli_num_rows($result);
        if ($resultCheck < 1) {
            echo json_encode(['success' => false, 'message' => 'Invalid username']);
            exit();
        } else {
            $row = mysqli_fetch_assoc($result);
            $user_id = $row['id'];
            $_SESSION['user_id'] = $user_id;
            header("Location: ../dashboard.php");
            
        } 
    } 
}
