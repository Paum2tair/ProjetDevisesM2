<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
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
            $query = "SELECT date_value,value FROM currency_to_euro WHERE iso = :currencyCode";
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
    if (isset($_FILES['csvFile']) && $_FILES['csvFile']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['csvFile']['tmp_name'];

        if (($handle = fopen($fileTmpPath, 'r')) !== false) {
            // Lire la ligne d'en-tête
            $headerRow = fgetcsv($handle);
            
            if ($headerRow !== false && count($headerRow) >= 2) {
                // Identifier dynamiquement les colonnes
                $dateIndex = array_search('DateTime', $headerRow);
                $valueIndex = -1;
                $iso = '';

                foreach ($headerRow as $index => $column) {
                    // Supprimer une virgule initiale si elle existe
                    $column = ltrim($column, ',');
                    
                    // Vérifier si la colonne correspond au modèle XXX_to_EUR
                    if (preg_match('/^\w+_to_EUR$/', $column)) {
                        $valueIndex = $index;
                        $iso = substr($column, 0, 3); // Extraire l'ISO (les 3 premiers caractères)
                        break;
                    }
                }

                if ($dateIndex !== false && $valueIndex !== false) {
                    while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                        // S'assurer que la ligne a suffisamment de colonnes
                        if (isset($row[$dateIndex], $row[$valueIndex])) {
                            $date_value = $row[$dateIndex];
                            $value = $row[$valueIndex];

                            if (!empty($date_value) && !empty($value)) {
                                try {
                                    $db = dbConnect(); // Assurez-vous que la connexion à la base de données est disponible
                                    dbAddCurrency($db, $iso, $date_value, $value);
                                } catch (Exception $e) {
                                    error_log("Failed to insert row: " . $e->getMessage());
                                }
                            } else {
                                error_log("Empty fields in row: " . implode(", ", $row));
                            }
                        } else {
                            error_log("Invalid row format: " . implode(", ", $row));
                        }
                    }
                    echo "CSV data successfully uploaded.";
                } else {
                    echo "Required columns 'DateTime' and a column matching 'XXX_to_EUR' are missing.";
                }
            } else {
                echo "Invalid CSV format or insufficient columns.";
            }
            fclose($handle);
        } else {
            echo "Could not open the uploaded file.";
        }
    } else {
        echo "File upload failed with error code: " . $_FILES['csvFile']['error'];
    }
}


echo json_encode($data);
?>