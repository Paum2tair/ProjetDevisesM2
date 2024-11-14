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
  function dbAddCurrency($db,$iso,$date_value,$value){
$request = "INSERT INTO currency (iso, date_value, value) VALUES (:iso, :date_value, :value)";
$statement = $db->prepare($request);
$statement->bindValue(':iso', $iso);
$statement->bindValue(':date_value', $date_value);
$statement->bindValue(':value', $value);
$statement->execute();
  }
?>
