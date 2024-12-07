<?php

$dominio = $_GET['dominio'];
$pais = $_GET['pais'];
$idioma = $_GET['idioma'];


$url = "https://v7.authoritas.com/api/v3/visibility-explorer/ranking/keywords/".$idioma."_".$pais."?domains[]=".$dominio."&pageSize=5000";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Seguir redirecciones
curl_setopt($ch, CURLOPT_MAXREDIRS, 5); // Limitar redirecciones
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
    "Accept: application/json",
    "Connection: keep-alive"
]);
curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookies.txt'); // Habilitar cookies
curl_setopt($ch, CURLOPT_COOKIEFILE, 'cookies.txt'); // Reutilizar cookies

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo "{'error:':'".curl_error($ch)."'}";
} else {
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode === 200) {
        echo $response;
    } else {
        echo "{'error:':'HTTP code ".$httpCode."'}";
    }
}

curl_close($ch);

?>
