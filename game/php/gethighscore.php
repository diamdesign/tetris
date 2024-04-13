<?php 
header("Access-Control-Allow-Origin: *");


require("db.php");

$response = [];

if(isset($_GET['width']) || isset($_POST['width'])) {


// Get width and height from GET or POST
$width = isset($_REQUEST['width']) ? $_REQUEST['width'] : null;
$height = isset($_REQUEST['height']) ? $_REQUEST['height'] : null;

if ($width !== null && $height !== null) {
    $sql = "SELECT *
            FROM highscore
            WHERE width = :width AND height = :height
            ORDER BY score DESC, 
                    days ASC, 
                    hours ASC, 
                    minutes ASC, 
                    seconds ASC, 
                    milliseconds ASC LIMIT 250";

    // Prepare and execute the statement
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':width', $width, PDO::PARAM_INT);
    $stmt->bindParam(':height', $height, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the result
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $rank = 1;
    // Remove the 'id' column from each row
    foreach ($result as &$row) {
        unset($row['id']);

            $row['rank'] = $rank;
    $rank++;
    }


    $response = $result;
} else {
    $response['error'] = "Width and height parameters are required.";
}

} else {
    $response['error'] = "Width is not specified.";
}

header('Content-Type: application/json');
echo json_encode($response);
?>
