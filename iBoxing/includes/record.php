<?php
include_once 'database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'record_session') {
        $username = mysqli_real_escape_string($conn, $_POST['username']);
        $duration = mysqli_real_escape_string($conn, $_POST['duration']);
        $max_distance = mysqli_real_escape_string($conn, $_POST['max_distance']);
        $highest_pitch = mysqli_real_escape_string($conn, $_POST['highest_pitch']);
        $hits_per_min = mysqli_real_escape_string($conn, $_POST['hits_per_min']);
        $total_hits = mysqli_real_escape_string($conn, $_POST['total_hits']);
        
        if (empty($username) || empty($duration) || empty($max_distance) || empty($highest_pitch) || empty($hits_per_min) || empty($total_hits)) {
            echo json_encode(['success' => false, 'message' => 'All fields are required']);
            exit();
        } else {
            $sql = "SELECT id FROM users WHERE username='$username'";
            $result = mysqli_query($conn, $sql);
            if (!$result) {
                echo json_encode(['success' => false, 'message' => 'Query failed: ' . mysqli_error($conn)]);
                exit();
            } else if (mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $user_id = $row['id'];
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid username']);
                exit();
            }
            $sql = "INSERT INTO sessions (user_id, duration, max_distance, highest_pitch, hits_per_min, total_hits) 
                        VALUES ('$user_id', '$duration', '$max_distance', '$highest_pitch', '$hits_per_min', '$total_hits')";
            if (mysqli_query($conn, $sql)) {
                echo json_encode(['success' => true, 'message' => 'Session recorded successfully']);
            } else {
                throw new Exception('Error: ' . mysqli_error($conn));
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