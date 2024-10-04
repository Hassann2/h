<?php
session_start();
if(!isset($_SESSION['logged']) || $_SESSION['logged'] !== true){
    header("Location: https://codingapp.net/login_page");
    exit;
};

?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="
        <?php 
            $token = bin2hex(random_bytes(16));
            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/Lamp/style.css' . '?token=' . $token;
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
    <title>Lamp</title>
</head>
<body>
    <div class="lamp-wrapper">
        <div class="lamp-rope"></div>
        <div class="lamp">
            <div class="lamp-part -top">
                <div class="lamp-part -top-part"></div>
                <div class="lamp-part -top-part right"></div>
            </div>
            <div class="lamp-part -body"></div>
            <div class="lamp-part -body right"></div>
            <div class="lamp-part -bottom"></div>
            <div class="blub"></div>
        </div>
        <div class="wall-light-shadow"></div>
    </div>

    <form oninput="body.setAttribute('data-light', slider.value)">
        <div class="icon sun">
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
            <div class="ray"></div>
        </div>
        <input type="range" id="slider" value="0" min="0" max="10">
    </form>
</body>
</html>