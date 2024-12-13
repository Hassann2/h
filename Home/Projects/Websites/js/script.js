/*
window.addEventListener("load", (event) => {
    const rand = () => Math.random().toString(36).substr(2);
    const token = (length) => (rand() + rand() + rand() + rand()).substr(0, length);
    let currentLocation = window.location;
    
    if (!currentLocation.search.includes('?token=')) {
        currentLocation.href = currentLocation + '?token=' + token(40);
    }
});
*/
var swiper = new Swiper(".slide-content", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: true,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints:{
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView: 2,
        },
        950: {
            slidesPerView: 3,
        },
    },
});
