<?php
require("db.php");

$response = [];

// Set appropriate CORS headers

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, X-Fetch-Request"); // Allow X-Fetch-Request header

// Get the JSON data from the request body
$requestBody = file_get_contents('php://input');

if(empty($requestBody)) {
    // If the request body is empty, send a forbidden response
    $response['success'] = false;
    $response['message'] = "Forbidden: Empty request body";
    echo json_encode($response);
    exit;
}

    // Decode the JSON data
    $data = json_decode($requestBody, true);

    // Extract data from the JSON
    $level = $data['level'];
    $alias = $data['alias'];

    $score = $data['score'];

    $days = $data['days'];
    $hours = $data['hours'];
    $minutes = $data['minutes'];
    $seconds = $data['seconds'];
    $milliseconds = $data['milliseconds'];

    $width = $data['width'];
    $height = $data['height'];

    $theme = "default";
    


function compareTimes($newTime, $existingTime) {
    $newDays = (int)$newTime['days'];
    $newHours = (int)$newTime['hours'];
    $newMinutes = (int)$newTime['minutes'];
    $newSeconds = (int)$newTime['seconds'];
    $newMilliseconds = (int)$newTime['milliseconds'];

    $existingDays = (int)$existingTime['days'];
    $existingHours = (int)$existingTime['hours'];
    $existingMinutes = (int)$existingTime['minutes'];
    $existingSeconds = (int)$existingTime['seconds'];
    $existingMilliseconds = (int)$existingTime['milliseconds'];

    // Convert all time components to milliseconds for comparison
    $newTotalMilliseconds = $newDays * 24 * 60 * 60 * 1000 +
                             $newHours * 60 * 60 * 1000 +
                             $newMinutes * 60 * 1000 +
                             $newSeconds * 1000 +
                             $newMilliseconds;

    $existingTotalMilliseconds = $existingDays * 24 * 60 * 60 * 1000 +
                                 $existingHours * 60 * 60 * 1000 +
                                 $existingMinutes * 60 * 1000 +
                                 $existingSeconds * 1000 +
                                 $existingMilliseconds;

    return $newTotalMilliseconds < $existingTotalMilliseconds;
}


    try {
// Check if a record exists for the provided alias on the specified level
$existingStmt = $pdo->prepare("SELECT score, days, hours, minutes, seconds, milliseconds FROM highscore WHERE BINARY alias = :alias AND width = :width AND height = :height");
$existingStmt->bindParam(':alias', $alias, PDO::PARAM_STR);
$existingStmt->bindParam(':width', $width, PDO::PARAM_INT);
$existingStmt->bindParam(':height', $height, PDO::PARAM_INT);

$existingStmt->execute();
$existingScore = $existingStmt->fetch(PDO::FETCH_ASSOC);

if (!$existingScore) {
    // If no existing record, insert the new score

    // Insert the new high score
    $insertStmt = $pdo->prepare("INSERT INTO highscore (alias, score, days, hours, minutes, seconds, milliseconds, level, width, height, theme) VALUES (:alias, :score, :days, :hours, :minutes, :seconds, :milliseconds, :level, :width, :height, :theme)");

    $insertStmt->bindParam(':alias', $alias, PDO::PARAM_STR);
    $insertStmt->bindParam(':score', $score, PDO::PARAM_INT);
    $insertStmt->bindParam(':days', $days, PDO::PARAM_INT);
    $insertStmt->bindParam(':hours', $hours, PDO::PARAM_INT);
    $insertStmt->bindParam(':minutes', $minutes, PDO::PARAM_INT);
    $insertStmt->bindParam(':seconds', $seconds, PDO::PARAM_INT);
    $insertStmt->bindParam(':milliseconds', $milliseconds, PDO::PARAM_INT);
    $insertStmt->bindParam(':level', $level, PDO::PARAM_INT);
    $insertStmt->bindParam(':width', $width, PDO::PARAM_INT);
    $insertStmt->bindParam(':height', $height, PDO::PARAM_INT);
    $insertStmt->bindParam(':theme', $theme, PDO::PARAM_STR);
    $insertStmt->execute();

    $response['success'] = true;
    $response['message'] = "High score added successfully";
} else {
    // If existing record, check if new score is better

    if ($score > $existingScore['score'] || ($score == $existingScore['score'] && compareTimes($data, $existingScore))) {
        // If new score is better, update the existing record

        // Update the existing high score
        $updateStmt = $pdo->prepare("UPDATE highscore SET score = :score, days = :days, hours = :hours, minutes = :minutes, seconds = :seconds, milliseconds = :milliseconds, level = :level WHERE width = :width AND height = :height AND alias = :alias");

        $updateStmt->bindParam(':alias', $alias, PDO::PARAM_STR);
        $updateStmt->bindParam(':score', $score, PDO::PARAM_INT);
        $updateStmt->bindParam(':days', $days, PDO::PARAM_INT);
        $updateStmt->bindParam(':hours', $hours, PDO::PARAM_INT);
        $updateStmt->bindParam(':minutes', $minutes, PDO::PARAM_INT);
        $updateStmt->bindParam(':seconds', $seconds, PDO::PARAM_INT);
        $updateStmt->bindParam(':milliseconds', $milliseconds, PDO::PARAM_INT);
        $updateStmt->bindParam(':width', $width, PDO::PARAM_INT);
        $updateStmt->bindParam(':height', $height, PDO::PARAM_INT);
        $updateStmt->execute();

        $response['success'] = true;
        $response['message'] = "High score updated successfully";
    } else {
        // If new score is not better, do nothing

        $response['success'] = true;
        $response['message'] = "No high score added or updated";
    }
}

    // Delete records where all time components are 0 or steps are 0
    $stmt = $pdo->prepare("
        DELETE FROM highscore 
        WHERE (days = 0 AND hours = 0 AND minutes = 0 AND seconds = 0 AND milliseconds = 0) 
        OR score = 0
    ");
    $stmt->execute();


} catch (PDOException $e) {
    $response['success'] = false;
    $response['message'] = "Error: " . $e->getMessage();
}

$response['data'] = $data;
echo json_encode($response);
?>