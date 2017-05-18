<?php
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);
include('easy-ipfs.php');
$ipfs = new IPFS();
header('access-control-allow-origin: *');

//file_put_contents('yolo.txt', 'test');

$title = bin2hex(openssl_random_pseudo_bytes(3)) . time() . '.txt';
$title = (string)$title;
if (isset($_FILES["data"]["tmp_name"])){
  if ($_FILES['data']['tmp_name'] > 5242880){
    die('Your paste is too large, must be less than 5mb');
  }
  move_uploaded_file($_FILES["data"]["tmp_name"], './' . $title);
  $key = $ipfs->dataAdd(__DIR__ . '/' . $title);
  $key = substr($key, 0, strpos($key, "}") + 1);
  //echo $key;
  $ob = json_decode($key, true);
  echo 'data: ' . $ob['Hash'];
  unlink($title);
}
else{
  echo 'No data provided';
}

?>
