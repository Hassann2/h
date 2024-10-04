<?php
session_start();
if(!isset($_SESSION['logged']) || $_SESSION['logged'] !== true){
    header("Location: https://codingapp.net/login_page");
    exit;
};

?>

<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Websites</title>
        <link rel="icon" type="image/x-icon" href="
            <?php 
                $token = bin2hex(random_bytes(16));
                $baseUrl = 'https://codingapp.net/Signup/Logo_Black.ico' . '?token=' . $token;
                echo $baseUrl;
            ?>
        ">
        <link rel="stylesheet" href="
            <?php 
                $token = bin2hex(random_bytes(16));
                $baseUrl = 'https://codingapp.net/Home/Projects/Websites/css/swiper-bundle.min.css' . '?token=' . $token;
                echo $baseUrl;
            ?>
        ">
        <link rel="stylesheet" href="
            <?php 
                $token = bin2hex(random_bytes(16));
                $baseUrl = 'https://codingapp.net/Home/Projects/Websites/css/style.css' . '?token=' . $token;
                echo $baseUrl;
            ?>
        ">        
        <link href='https://fonts.googleapis.com/css?family=Monoton' rel='stylesheet' type='text/css'>                   
    </head>
    <body>
        <div class="page">
            <div class="background-stars">
                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>
            </div>
            <div class="slide-container swiper">
                <div class="slide-content">
                    <div class="card-wrapper swiper-wrapper">
                        <div class="card swiper-slide">
                            <div class="image-content">
                                <span class="overlay"></span>
    
                                <div class="card-image">
                                    <img src="
                                        <?php 
                                            $token = bin2hex(random_bytes(16));
                                            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/images/Glowing%20Bottle.png' . '?token=' . $token;
                                            echo $baseUrl;
                                        ?>
                                    " alt="" class="card-img">
                                </div>
                            </div>
                            <div class="card-content">
                                <h2 class="name">3D Glowing Bottle</h2>
    
                                <a href="https://github.com/codingwebserver/Websites/tree/main/3D%20Glowing%20Bottle" class="button">View More</a>
                            </div>
                        </div>
                        <div class="card swiper-slide">
                            <div class="image-content">
                                <span class="overlay"></span>
    
                                <div class="card-image">
                                    <img src="
                                        <?php 
                                            $token = bin2hex(random_bytes(16));
                                            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/images/3D%20Text.png' . '?token=' . $token;
                                            echo $baseUrl;
                                        ?>
                                    " alt="" class="card-img">
                                </div>
                            </div>
    
                            <div class="card-content">
                                <h2 class="name">3D Text</h2>
    
                                <a href="https://github.com/codingwebserver/Websites/tree/main/3D%20Text" class="button">View More</a>
                            </div>
                        </div>
                        <div class="card swiper-slide">
                            <div class="image-content">
                                <span class="overlay"></span>
    
                                <div class="card-image">
                                    <img src="
                                        <?php 
                                            $token = bin2hex(random_bytes(16));
                                            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/images/Ambient%20Light.png' . '?token=' . $token;
                                            echo $baseUrl;
                                        ?>
                                    " alt="" class="card-img">
                                </div>
                            </div>
    
                            <div class="card-content">
                                <h2 class="name">Video Ambient Light</h2>
    
                                <a href="https://github.com/codingwebserver/Websites/tree/main/Ambient%20Light" class="button">View More</a>
                            </div>
                        </div>
                        <div class="card swiper-slide">
                            <div class="image-content">
                                <span class="overlay"></span>
    
                                <div class="card-image">
                                    <img src="
                                        <?php 
                                            $token = bin2hex(random_bytes(16));
                                            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/images/Clima.png' . '?token=' . $token;
                                            echo $baseUrl;
                                        ?>
                                    " alt="" class="card-img">
                                </div>
                            </div>
    
                            <div class="card-content">
                                <h2 class="name">Climate</h2>
    
                                <a href="https://github.com/codingwebserver/Websites/tree/main/ClimaCode" class="button">View More</a>
                            </div>
                        </div>
                        <div class="card swiper-slide">
                            <div class="image-content">
                                <span class="overlay"></span>
    
                                <div class="card-image">
                                    <img src="
                                        <?php 
                                            $token = bin2hex(random_bytes(16));
                                            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/images/Download_Btn.png' . '?token=' . $token;
                                            echo $baseUrl;
                                        ?>
                                    " alt="" class="card-img">
                                </div>
                            </div>
    
                            <div class="card-content">
                                <h2 class="name">Download Button</h2>
    
                                <a href="https://github.com/codingwebserver/Websites/tree/main/Download%20Button" class="button">View More</a>
                            </div>
                        </div>
                        <div class="card swiper-slide">
                            <div class="image-content">
                                <span class="overlay"></span>
    
                                <div class="card-image">
                                    <img src="
                                        <?php 
                                            $token = bin2hex(random_bytes(16));
                                            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/images/Run_Python_On_Web.png' . '?token=' . $token;
                                            echo $baseUrl;
                                        ?>
                                    " alt="" class="card-img">
                                </div>
                            </div>
    
                            <div class="card-content">
                                <h2 class="name">Python On Web</h2>
    
                                <a href="https://github.com/codingwebserver/Websites/tree/main/PythonOnWeb" class="button">View More</a>
                            </div>
                        </div>
                        <div class="card swiper-slide">
                            <div class="image-content">
                                <span class="overlay"></span>
    
                                <div class="card-image">
                                    <img src="
                                        <?php 
                                            $token = bin2hex(random_bytes(16));
                                            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/images/Google%20Maps.png' . '?token=' . $token;
                                            echo $baseUrl;
                                        ?>
                                    " alt="" class="card-img">
                                </div>
                            </div>
    
                            <div class="card-content">
                                <h2 class="name">Google Maps</h2>
    
                                <a href="https://github.com/codingwebserver/Websites/tree/main/Maps" class="button">View More</a>
                            </div>
                        </div>
                        <div class="card swiper-slide">
                            <div class="image-content">
                                <span class="overlay"></span>
    
                                <div class="card-image">
                                    <img src="
                                        <?php 
                                            $token = bin2hex(random_bytes(16));
                                            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/images/Lamp.png' . '?token=' . $token;
                                            echo $baseUrl;
                                        ?>
                                    " alt="" class="card-img">
                                </div>
                            </div>
    
                            <div class="card-content">
                                <h2 class="name">Lamp</h2>
    
                                <a href="https://github.com/codingwebserver/Websites/tree/main/Lamp" class="button">View More</a>
                            </div>
                        </div>
                        <div class="card swiper-slide">
                            <div class="image-content">
                                <span class="overlay"></span>
    
                                <div class="card-image">
                                    <img src="
                                        <?php 
                                            $token = bin2hex(random_bytes(16));
                                            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/images/Heart.png' . '?token=' . $token;
                                            echo $baseUrl;
                                        ?>
                                    " alt="" class="card-img">
                                </div>
                            </div>
    
                            <div class="card-content">
                                <h2 class="name">Heart</h2>
    
                                <a href="https://github.com/codingwebserver/Websites/tree/main/Heart" class="button">View More</a>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="swiper-button-next swiper-navBtn"></div>
                <div class="swiper-button-prev swiper-navBtn"></div>
                <div class="swiper-pagination"></div>
            </div>    
            <a class="back" href='<?php echo $_SERVER['HTTP_REFERER']?>'>GO BACK</a>
        </div>
    </body>
    <script src="
        <?php 
            $token = bin2hex(random_bytes(16));
            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/js/swiper-bundle.min.js' . '?token=' . $token;
            echo $baseUrl;
        ?>
    "></script>
    <script src="
        <?php 
            $token = bin2hex(random_bytes(16));
            $baseUrl = 'https://codingapp.net/Home/Projects/Websites/js/script.js' . '?token=' . $token;
            echo $baseUrl;
        ?>
    "></script>
</html>