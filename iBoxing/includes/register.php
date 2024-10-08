<?php
include_once "database.php";
try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'register') {
        $newUsername = mysqli_real_escape_string($conn, $_POST['new-username']);
        if (empty($newUsername)) {
            throw new Exception('Username is required');
        } else {
            $sql = "INSERT INTO users (username) VALUES ('$newUsername')";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['success' => true, 'user_id' => $conn->insert_id]);
            } else {
                throw new Exception('Error: ' . $conn->error);
            }
        }
    } else {
        throw new Exception('Invalid request');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit();
}
