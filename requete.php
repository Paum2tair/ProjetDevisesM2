<?php

require_once('database.php');

// Database connexion.
$db = dbConnect();
if (!$db)
{
  header ('HTTP/1.1 503 Service Unavailable');
  exit;
}
$data=false;
// Check the request.
$requestMethod = $_SERVER['REQUEST_METHOD'];
$request = substr($_SERVER['PATH_INFO'], 1);
$request = explode('/', $request);
$requestRessource = array_shift($request);

if($requestMethod=='GET'){
    if($requestRessource=='one_currency'){
        if (isset( $_GET['id'])){
            $currencyCode = $_GET['id'];
            $query = "SELECT date_value,value FROM currency WHERE iso = :currencyCode";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':currencyCode', $currencyCode, PDO::PARAM_STR);
            // Execute the query.
            if ($stmt->execute()) {
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        }
    }
    if($requestRessource=='list_all'){
        $query = "SELECT DISTINCT iso FROM currency";
        $stmt = $db->prepare($query);
        if ($stmt->execute()) {
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
}
if ($requestMethod == 'POST' && $requestRessource == 'upload_csv') {
    // Check if a file was uploaded
    if (isset($_FILES['csvFile']) && $_FILES['csvFile']['error'] == 0) {
        $fileTmpPath = $_FILES['csvFile']['tmp_name'];

        // Open the CSV file
        if (($handle = fopen($fileTmpPath, 'r')) !== false) {
            // Retrieve the first line (header)
            $headerRow = fgetcsv($handle);

            // Check if the CSV has a valid header (cell B1 for ISO)
            if (isset($headerRow[1]) && !empty($headerRow[1])) {
                // Extract the ISO from cell B1
                $iso = substr($headerRow[1], 0, 3); // Assuming the format like 'JPY_to_EUR'

                // Process each row
                while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                    // Ensure the row has at least 2 columns (date_value and value)
                    if (count($row) >= 2) {
                        $date_value = $row[0];
                        $value = $row[1];

                        // Validate that the date_value and value are not empty
                        if (!empty($date_value) && !empty($value)) {
                            // Insert into the database with the extracted 'iso' value
                            dbAddCurrency($db, $iso, $date_value, $value);
                        } else {
                            echo "One or more fields are empty in the row: " . implode(", ", $row) . "<br>";
                        }
                    } else {
                        echo "Invalid row format: " . implode(", ", $row) . "<br>";
                    }
                }
            } else {
                echo "Invalid CSV format. ISO value missing in B1.";
            }

            fclose($handle);
            echo "CSV data successfully uploaded.";
        } else {
            echo "Failed to open the uploaded CSV file.";
        }
    } else {
        echo "No file uploaded or an error occurred.";
    }
}

echo json_encode($data);
?>