<?php

require_once('constants.php');

function dbConnect()
  {
    try
    {
      $db = new PDO('mysql:host='.DB_SERVER.';dbname='.DB_NAME.';charset=utf8',
        DB_USER, DB_PASSWORD);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    }
    catch (PDOException $exception)
    {
      error_log('Connection error: '.$exception->getMessage());
      return false;
    }
    return $db;
  }
  function dbAddCurrency($db, $iso, $date_value, $value) {
    try {
        // Vérifie si `iso` existe dans la table `currency`
        $request = "SELECT COUNT(*) FROM currency WHERE iso = :iso";
        $statement = $db->prepare($request);
        $statement->bindValue(':iso', $iso);
        $statement->execute();
        if ($statement->fetchColumn() == 0) {
            $request = "INSERT INTO currency (iso) VALUES (:iso)";
            $statement = $db->prepare($request);
            $statement->bindValue(':iso', $iso);
            $statement->execute();
        }

        // Vérifie si l'entrée existe déjà dans `currency_to_euro`
        $request = "SELECT COUNT(*) FROM currency_to_euro WHERE iso = :iso AND date_value = :date_value";
        $statement = $db->prepare($request);
        $statement->bindValue(':iso', $iso);
        $statement->bindValue(':date_value', $date_value);
        $statement->execute();
        if ($statement->fetchColumn() == 0) {
            $request = "INSERT INTO currency_to_euro (iso, date_value, value) VALUES (:iso, :date_value, :value)";
            $statement = $db->prepare($request);
            $statement->bindValue(':iso', $iso);
            $statement->bindValue(':date_value', $date_value);
            $statement->bindValue(':value', $value);
            $statement->execute();
        }
    } catch (PDOException $e) {
        error_log("Error inserting data: " . $e->getMessage());
    }
}
?>
