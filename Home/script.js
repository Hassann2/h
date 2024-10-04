//Home Page
const white_logo = document.getElementById('Logo_W');
const black_logo = document.getElementById('Logo_B');
var screen_width = window.matchMedia("(max-width: 947px)");
function ScreenCheck(screen_width){
    if (screen_width.matches && this.scrollY > 20) {
        $('.navbar').addClass("sticky");
        white_logo.style.display = "none";
        black_logo.style.display = "block";
    } else {
        $('.navbar').removeClass("sticky");
        white_logo.style.display = "block";
        black_logo.style.display = "none";
    }
    if(this.scrollY > 200 && screen_width.matches){
        $('.scroll-up-btn').addClass("show");
        $('.scroll-up-btn').removeClass("hidden");
    }else{
        $('.scroll-up-btn').removeClass("show");
        $('.scroll-up-btn').removeClass("hidden");
    }
}

ScreenCheck(screen_width);
screen_width.addEventListener("change", function() {
    ScreenCheck(screen_width);
});

$(document).ready(function(){
    $(window).scroll(function(){

        if (this.scrollY > 20) {
            $('.navbar').addClass("sticky");
            white_logo.style.display = "none";
            black_logo.style.display = "block";
        } else {
            $('.navbar').removeClass("sticky");
            white_logo.style.display = "block";
            black_logo.style.display = "none";
        }

        // scroll-up button show/hide script
        if(this.scrollY > 200){
            $('.scroll-up-btn').addClass("show");
            $('.scroll-up-btn').removeClass("hidden");
        }else{
            $('.scroll-up-btn').removeClass("show");
            $('.scroll-up-btn').removeClass("hidden");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({ scrollTop: 0 });
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
        $('.scroll-up-btn').addClass("hidden");
    });

    // typing text animation script
    var typed = new Typed(".typing", {
        strings: ["Web Developer", " Game Developer", "Photo Editor", "Video Editor", "Gamer"],
        typeSpeed: 120,
        backSpeed: 80,
        loop: true
    });

    var typed = new Typed(".typing-2", {
        strings: ["Web Developer", " Game Developer", "Photo Editor", "Video Editor", " Gamer"],
        typeSpeed: 120,
        backSpeed: 80,
        loop: true
    });
});

//Deactivate Up-Arrow Menu
$('.profile_btn').click(function(){
    $('#arrow_up_btn').toggleClass("active");
})

function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}
