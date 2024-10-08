<?php
include 'database.php';
session_start(); // Ensure session is started
$userid = $_SESSION['user_id'];

$query = "SELECT * FROM sessions WHERE user_id = '$userid'";
//storing the result of the executed query
$result = $conn->query($query);
if (!$result) {
    die("Query failed: " . $conn->error);
}
//initialize the array to store the processed data
$jsonArray = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $jsonArrayItem = array();
        $jsonArrayItem['user_id'] = $row['user_id'];
        $jsonArrayItem['duration'] = $row['duration'];
        $jsonArrayItem['max_distance'] = $row['max_distance'];
        $jsonArrayItem['highest_pitch'] = $row['highest_pitch'];
        $jsonArrayItem['hits_per_min'] = $row['hits_per_min'];
        $jsonArrayItem['total_hits'] = $row['total_hits'];
        array_push($jsonArray, $jsonArrayItem);
    }
} else {
    echo "No records found for user_id: $userid";
}
//Closing the connection to DB
$conn->close();
//set the response content type as JSON
header('Content-type: application/json');
//output the return value of json encode using the echo function.
echo json_encode($jsonArray);