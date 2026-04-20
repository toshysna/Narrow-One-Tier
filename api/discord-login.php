<?php
$client_id = "1495749940377293001";
$redirect_uri = urlencode("https://www.n1tier.com/api/discord-callback.php");
$scope = "identify email";

$url = "https://discord.com/oauth2/authorize?client_id=$client_id&redirect_uri=$redirect_uri&response_type=code&scope=" . urlencode($scope);

header("Location: $url");
exit;
