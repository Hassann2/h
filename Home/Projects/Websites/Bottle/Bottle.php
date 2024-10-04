<?php
session_start();
if(!isset($_SESSION['logged']) || $_SESSION['logged'] !== true){
    header("Location: https://codingapp.net/login_page");
    exit;
};

?>

<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="
        <?php 
            $token = bin2hex(random_bytes(16));
            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/Bottle/style.css' . '?token=' . $token;
            echo $baseUrl;
        ?>
    ">
    <link rel="icon" type="image/x-icon" href="
        <?php 
            $token = bin2hex(random_bytes(16));
            $baseUrl = 'https://codingapp.net/Signup/Logo_Black.ico' . '?token=' . $token;
            echo $baseUrl;
        ?>
    ">
    <title>3D Glowing Bottle</title>
</head>
<body>
    <section>
        <div class="shadow"></div>
        <div class="bowl">
            <div class="liquid"></div>
        </div>
    </section>
</body>
</html>