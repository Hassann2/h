<?php
session_start();
require_once('../../Database_Files/login.php');
require_once('../../Database_Files/DB_Config/config.php');
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="charset" content="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta http-equiv="Content-Language" content="en" />
  <link rel="icon" href="
        <?php 
            $token = bin2hex(random_bytes(16));
            $baseUrl = 'https://codingapp.net/Signup/Logo_Black.ico' . '?token=' . $token;
            echo $baseUrl;
        ?>
  " type="image/x-icon">
  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com/">
  <meta name="apple-mobile-web-app-status-bar" content="#202125">
  <title>About Me</title>
  <link rel="stylesheet" href="
        <?php 
            $token = bin2hex(random_bytes(16));
            $baseUrl = 'https://codingapp.net/Home/style.css' . '?token=' . $token;
            echo $baseUrl;
        ?>
  ">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.11/typed.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" />
</head>

<body>
    <div class="page">
        <div class="bg"></div>
            <div class="bg bg2"></div>
            <div class="bg bg3"></div>
        <div class="scroll-up-btn">
            <i class="fas fa-angle-up"></i>
        </div>
        <nav class="navbar">
            <div class="width">
                <div class="logo">
                    <a href="#">
                        <img src="
                        <?php 
                            $token = bin2hex(random_bytes(16));
                            $baseUrl = 'https://codingapp.net/Signup/Logo.png' . '?token=' . $token;
                            echo $baseUrl;
                        ?>
                        " alt="Logo" style="width: 60px;" id="Logo_W">
                        <img src="
                        <?php 
                            $token = bin2hex(random_bytes(16));
                            $baseUrl = 'https://codingapp.net/Signup/Logo_Black.png' . '?token=' . $token;
                            echo $baseUrl;
                        ?>
                        " alt="Logo" style="width: 60px;" id="Logo_B">
                    </a>
                </div>
                <ul class="menu">
                    <li>
                    <a href="
                        <?php
                            function generate_Token_U_H($username_token, $password_token, $baseUrl_h, $id){
                                $hashed_password_token_h = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_u_h = bin2hex(random_bytes(16));
                                $link_u_h = $baseUrl_h . '?id='. $id . '?token=' . $token_u_h . '#home';

                                return $link_u_h;
                            }

                            function generate_Token_E_H($email_token, $password_token, $baseUrl_h, $id){
                                $hashed_password_token_h = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_e_h = bin2hex(random_bytes(16));
                                $link_e_h = $baseUrl_h . '?id='. $id . '?token=' . $token_e_h . '#home';

                                return $link_e_h;
                            }

                            $baseUrl_h = '/home';
                            $sql = "SELECT id FROM signup";
                            $result = $connection->query($sql);
                            $row = $result->fetch_assoc();
                            $id = $row["id"];
                            $link_u_h = generate_Token_U_H($username_token, $password_token, $baseUrl_h, $id);
                            $link_e_h = generate_Token_E_H($email_token, $password_token, $baseUrl_h, $id);

                            if(!empty($username)){
                                echo $link_u_h;
                            }else{
                                echo $link_e_h;
                            }
                        ?>
                    " class="menu-btn">Home</a></li>
                    <li><a href="
                        <?php
                            function generate_Token_U_A($username_token, $password_token, $baseUrl_a, $id){
                                $hashed_password_token_a = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_u_a = bin2hex(random_bytes(16));
                                $link_u_a = $baseUrl_a . '?id='. $id . '?token=' . $token_u_a . '#about';

                                return $link_u_a;
                            }

                            function generate_Token_E_A($email_token, $password_token, $baseUrl_a, $id){
                                $hashed_password_token_a = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_e_a = bin2hex(random_bytes(16));
                                $link_e_a = $baseUrl_a . '?id='. $id . '?token=' . $token_e_a . '#about';

                                return $link_e_a;
                            }

                            $baseUrl_a = 'home';
                            $sql = "SELECT id FROM signup";
                            $result = $connection->query($sql);
                            $row = $result->fetch_assoc();
                            $id = $row["id"];
                            $link_u_a = generate_Token_U_A($username_token, $password_token, $baseUrl_a, $id);
                            $link_e_a = generate_Token_E_A($email_token, $password_token, $baseUrl_a, $id);

                            if(!empty($username)){
                                echo $link_u_a;
                            }else{
                                echo $link_e_a;
                            }
                        ?>
                    " class="menu-btn">About</a></li>
                    <li><a href="
                        <?php
                            function generate_Token_U_S($username_token, $password_token, $baseUrl_s, $id){
                                $hashed_password_token_s = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_u_s = bin2hex(random_bytes(16));
                                $link_u_s = $baseUrl_s . '?id='. $id . '?token=' . $token_u_s . '#services';

                                return $link_u_s;
                            }

                            function generate_Token_E_S($email_token, $password_token, $baseUrl_s, $id){
                                $hashed_password_token_s = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_e_s = bin2hex(random_bytes(16));
                                $link_e_s = $baseUrl_s . '?id='. $id .'?token=' . $token_e_s . '#services';

                                return $link_e_s;
                            }

                            $baseUrl_s = 'home';
                            $sql = "SELECT id FROM signup";
                            $result = $connection->query($sql);
                            $row = $result->fetch_assoc();
                            $id = $row["id"];
                            $link_u_s = generate_Token_U_S($username_token, $password_token, $baseUrl_s, $id);
                            $link_e_s = generate_Token_E_S($email_token, $password_token, $baseUrl_s, $id);

                            if(!empty($username)){
                                echo $link_u_s;
                            }else{
                                echo $link_e_s;
                            }
                        ?>
                    " class="menu-btn">Services</a></li>
                    <li><a href="
                        <?php
                            function generate_Token_U_SK($username_token, $password_token, $baseUrl_sk, $id){
                                $hashed_password_token_sk = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_u_sk = bin2hex(random_bytes(16));
                                $link_u_sk = $baseUrl_sk . '?id='. $id . '?token=' . $token_u_sk . '#skills';

                                return $link_u_sk;
                            }

                            function generate_Token_E_SK($email_token, $password_token, $baseUrl_sk, $id){
                                $hashed_password_token_sk = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_e_sk = bin2hex(random_bytes(16));
                                $link_e_sk = $baseUrl_sk . '?id='. $id . '?token=' . $token_e_sk . '#skills';

                                return $link_e_sk;
                            }

                            $baseUrl_sk = 'home';
                            $sql = "SELECT id FROM signup";
                            $result = $connection->query($sql);
                            $row = $result->fetch_assoc();
                            $id = $row["id"];
                            $link_u_sk = generate_Token_U_SK($username_token, $password_token, $baseUrl_sk, $id);
                            $link_e_sk = generate_Token_E_SK($email_token, $password_token, $baseUrl_sk, $id);

                            if(!empty($username)){
                                echo $link_u_sk;
                            }else{
                                echo $link_e_sk;
                            }
                        ?>
                    " class="menu-btn">Skills</a></li>
                    <li><a href="
                        <?php
                            function generate_Token_U_C($username_token, $password_token, $baseUrl_c, $id){
                                $hashed_password_token_c = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_u_c = bin2hex(random_bytes(16));
                                $link_u_c = $baseUrl_c . '?id='. $id . '?token=' . $token_u_c . '#contact';

                                return $link_u_c;
                            }

                            function generate_Token_E_C($email_token, $password_token, $baseUrl_c, $id){
                                $hashed_password_token_c = password_hash($password_token, PASSWORD_BCRYPT);
                                $token_e_c = bin2hex(random_bytes(16));
                                $link_e_c = $baseUrl_c . '?id='. $id . '?token=' . $token_e_c . '#contact';

                                return $link_e_c;
                            }

                            $baseUrl_c = 'home';
                            $sql = "SELECT id FROM signup";
                            $result = $connection->query($sql);
                            $row = $result->fetch_assoc();
                            $id = $row["id"];
                            $link_u_c = generate_Token_U_C($username_token, $password_token, $baseUrl_c, $id);
                            $link_e_c = generate_Token_E_C($email_token, $password_token, $baseUrl_c, $id);

                            if(!empty($username)){
                                echo $link_u_c;
                            }else{
                                echo $link_e_c;
                            }
                        ?>
                    " class="menu-btn">Contact</a></li>
                </ul>
                <div class="username_container">
                        <button class="profile_btn">
                            <span id="username">
                                <?php
                                    if(empty($username)){
                                        $email = $_SESSION['email'];
                                        echo $email;

                                        if(strlen($email) >= 12){
                                            echo"<style>#username{font-size: 8pt}</style>";
                                        }elseif(isset($_COOKIE['screenWidth']) < 300){
                                            echo"<style>#username{font-size: 9pt}</style>";
                                        }else{
                                            echo"<style>#username{font-size: 15pt}</style>";
                                        }
                                    }

                                    if(empty($email)){
                                        $username = $_SESSION['username'];
                                        echo $username;

                                        if(strlen($username) >= 12){
                                            echo"<style>#username{font-size: 8pt}</style>";
                                        }elseif(isset($_COOKIE['screenWidth']) < 300){
                                            echo"<style>#username{font-size: 9pt}</style>";
                                        }else{
                                            echo"<style>#username{font-size: 15pt}</style>";
                                        }
                                    }
                                ?>
                            </span>
                            <i class="fas fa-angle-up" id="arrow_up_btn"></i>
                        </button>
                    </div> 
                <div class="menu-btn">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </nav>
        <section class="home" id="home">
            <div class="width">
                <div class="home-content">
                    <div class="text-2">About Me</div>
                </div>
            </div>
        </section>
        <section class="about" id="about">
            <div class="width">
                <h2 class="title">About me</h2>
                <div class="about-content">
                    <div class="column left">
                        <img src="https://miro.medium.com/v2/resize:fit:12000/0*y-Pl05Vwn8nCsoro">
                    </div>
                    <div class="column right">
                        <div class="text">Hi, my name is Hassan and I am a web developer, game developer, gamer.</div>
                        <p>I am a passionate programmer and web developer with a deep understanding of modern technologies and a proven track record of delivering high-quality projects. With a strong background in programming and a keen eye for design, I specialize in creating seamless, easy-to-use, and visually appealing web experiences.</p>
                        <div class="head">Skills:</div>
                        <ol class="rm-ol">
                            <li>Front-end development: I have extensive experience in HTML, CSS, and JavaScript, ensuring clean, responsive designs that work seamlessly across multiple devices and browsers.</li>
                            <li>Backend Development: I have excellent knowledge of server-side programming languages ​​such as Python and PHP. I have basic experience with popular frameworks and libraries, which allow me to create robust and scalable web applications.</li>
                            <li>Database Management: I have good knowledge of database technologies, including SQL and NoSQL databases. I am good at designing and implementing efficient data models and optimizing queries to ensure optimal performance and data integrity.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
        <footer>
            <span>Copyright © 
            <script>
                document.write(new Date().getFullYear());
            </script> All rights reserved By <i class="fa fa-heart"></i> 
            <a href="
                <?php
                    function generate_Token_U_D($username_token, $password_token, $baseUrl_d, $id){
                        $hashed_password_token_d = password_hash($password_token, PASSWORD_BCRYPT);
                        $token_u_d = bin2hex(random_bytes(16));
                        $link_u_d = $baseUrl_d . '?id='. $id . '?token=' . $token_u_d;
                        return $link_u_d;
                    }
                    
                    function generate_Token_E_D($email_token, $password_token, $baseUrl_d, $id){
                        $hashed_password_token_d = password_hash($password_token, PASSWORD_BCRYPT);
                        $token_e_d = bin2hex(random_bytes(16));
                        $link_e_d = $baseUrl_d . '?id='. $id . '?token=' . $token_e_d;
                        return $link_e_d;
                    }
                    
                    $baseUrl_d = 'donate';
                    $sql = "SELECT id FROM signup";
                    $result = $connection->query($sql);
                    $row = $result->fetch_assoc();
                    $id = $row["id"];
                    $link_u_d = generate_Token_U_D($username_token, $password_token, $baseUrl_d, $id);
                    $link_e_d = generate_Token_E_D($email_token, $password_token, $baseUrl_d, $id);
                    if(!empty($username)){
                        echo $link_u_d;
                    }else{
                        echo $link_e_d;
                    }
                ?>
            ">Hassan</a></span>
        </footer>
    </div>
    <script src="
        <?php 
            $token = bin2hex(random_bytes(16));
            $baseUrl = 'https://codingapp.net/Home/script.js' . '?token=' . $token;
            echo $baseUrl;
        ?>
    "></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous"></script>
</body>
</html>