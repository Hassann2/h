//Toggling Menu
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId);
    const nav = document.getElementById(navId);

    if(toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        })
    }
}

showMenu('nav-toggle', 'nav-menu');

//Toggling Active Link
const navLink = document.querySelectorAll('.nav-link');

function linkAction() {
    navLink.forEach(n => n.classList.remove('active'));
    this.classList.add('active');

    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show');
}

navLink.forEach(n => n.addEventListener('click', linkAction));

// card flippy
$(".flip").mouseover(function () {
	$(this)
		.find(".card")
		.addClass("flipped")
		.mouseleave(function () {
			$(this).removeClass("flipped");
		});
	return false;
});

// Remove Card Flip small viewport
var alterClass = function () {
	var ww = document.body.clientWidth;
	if (ww < 700) {
		$(".card-core").removeClass("flip");
	} else if (ww >= 700) {
		$(".card-core").addClass("flip");
	}
};
$(window).resize(function () {
	alterClass();
});


// Scroll Reveal
const sr = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 2000,
    reset: true
})

sr.reveal('.home-title', {} )
sr.reveal('.button', {delay: 200} )
sr.reveal('.home-img', {delay: 400} )
sr.reveal('.home-social', {delay: 400,} )

sr.reveal('.about-img', {} )
sr.reveal('.about-subtitle', {delay: 200} )
sr.reveal('.about-text', {delay: 400} )

sr.reveal('.skills-subtitle', {delay: 100} )
sr.reveal('.skills-text', {delay: 150} )
sr.reveal('.skills-data', {interval: 200} )
sr.reveal('.skills-img', {delay: 400} )
sr.reveal('#education', {delay: 400})
sr.reveal('#work', {delay: 400})
sr.reveal('.home-slogan', {delay: 400})
sr.reveal('.work-img', {interval: 200} )

sr.reveal('.contact-input', {interval: 200} )

// typing text animation script
var typed = new Typed(".typing", {
    strings: ["Web Developer", " Game Developer", "Photo Editor", "Video Editor", "Gamer"],
    typeSpeed: 100,
    backSpeed: 80,
    loop: true
});
