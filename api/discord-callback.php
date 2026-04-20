<?php
session_start();

// CONFIG DISCORD
$client_id = "1495749940377293001";
$client_secret = "OljH22s_AnrePO0F2efmc9tirOdmRSrv";
$redirect_uri = "https://www.n1tier.com/api/discord-callback.php";

// 1) Vérifie si Discord a renvoyé un "code"
if (!isset($_GET['code'])) {
    die("Erreur : aucun code reçu.");
}

$code = $_GET['code'];

// 2) Échanger le code contre un access_token
$token_url = "https://discord.com/api/oauth2/token";

$data = [
    "client_id" => $client_id,
    "client_secret" => $client_secret,
    "grant_type" => "authorization_code",
    "code" => $code,
    "redirect_uri" => $redirect_uri
];

$options = [
    "http" => [
        "header" => "Content-Type: application/x-www-form-urlencoded",
        "method" => "POST",
        "content" => http_build_query($data)
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($token_url, false, $context);
$token = json_decode($response, true);

if (!isset($token["access_token"])) {
    die("Erreur : impossible d'obtenir le token Discord.");
}

$access_token = $token["access_token"];

// 3) Récupérer les infos du user Discord
$user_url = "https://discord.com/api/users/@me";

$opts = [
    "http" => [
        "header" => "Authorization: Bearer $access_token"
    ]
];

$context = stream_context_create($opts);
$user_info = json_decode(file_get_contents($user_url, false, $context), true);

// Infos récupérées
$discord_id = $user_info["id"];
$username = $user_info["username"];
$global_name = $user_info["global_name"] ?? $username;
$email = $user_info["email"] ?? null;
$avatar = $user_info["avatar"];

// 4) Connexion MySQL
$host = "sql302.infinityfree.com "; // hostname
$dbname = "if0_41708053_n1_tier"; // base
$dbuser = "if0_41708053"; // user
$dbpass = "TON_MDP_MYSQL";

$conn = new mysqli($host, $dbuser, $dbpass, $dbname);

if ($conn->connect_error) {
    die("Erreur MySQL : " . $conn->connect_error);
}

// 5) Vérifie si l'utilisateur existe déjà
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $email, $global_name);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // L'utilisateur existe → on le connecte
    $stmt->bind_result($user_id);
    $stmt->fetch();
} else {
    // L'utilisateur n'existe pas → on le crée
    $password_hash = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);

    $insert = $conn->prepare("INSERT INTO users (email, username, password_hash, is_verified) VALUES (?, ?, ?, 1)");
    $insert->bind_param("sss", $email, $global_name, $password_hash);
    $insert->execute();

    $user_id = $insert->insert_id;
}

// 6) Crée la session
$_SESSION["user_id"] = $user_id;
$_SESSION["username"] = $global_name;
$_SESSION["email"] = $email;

// 7) Redirection vers mon site
header("Location: https://www.n1tier.com/");
exit;
?>
