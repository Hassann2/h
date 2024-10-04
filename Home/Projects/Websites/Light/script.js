const canvas = document.getElementById('light');
const video = document.getElementById('video');
const ctx = canvas.getContext('2d');
const videoDims = {width: canvas.offsetWidth, height: canvas.offsetHeight};
const btn_a = document.querySelector('.amb_l_btn_a');
const btn_d = document.querySelector('.amb_l_btn_d');

btn_a.addEventListener('click',()=>{
    ctx.drawImage(video, 0, 0, videoDims.width, videoDims.height);
    btn_a.style.display = "none";
    btn_d.style.display = "block";
});

btn_d.addEventListener('click', ()=>{
    ctx.clearRect(0, 0, videoDims.width, videoDims.height);
    btn_d.style.display = "none";
    btn_a.style.display = "block";
})