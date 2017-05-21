<?php
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);
header('access-control-allow-origin: *');

$chk = curl_init('http://127.0.0.1:5001');
curl_setopt($chk, CURLOPT_NOBODY, true);
curl_setopt($chk, CURLOPT_FOLLOWLOCATION, true);
curl_exec($chk);
$retcode = curl_getinfo($chk, CURLINFO_HTTP_CODE);
curl_close($chk);
if (! 200 == $retcode) {
    http_response_code(503);
    die('data: Server is down :(, will use WebTorrent');
}


include('easy-ipfs.php');
$ipfs = new IPFS();

if (isset($_GET['cat'])){
  die($ipfs->cat($_GET['cat']));
}


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
