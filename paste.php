<?php
/*
SeedBin: a distributed pastebin with ipfs and webtorrent
    Copyright (C) 2017 Kevin Forman (beardog108) https://ChaosWebs.net/

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public
License
    along with this program.  If not, see
<http://www.gnu.org/licenses/>.
*/
/*
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);
*/
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
