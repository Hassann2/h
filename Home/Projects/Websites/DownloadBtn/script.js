const btn = document.querySelector("button");

function download() {
    const text = btn.querySelector("span");
    const cloud = btn.querySelector(".cloud-icon");
    const check = btn.querySelector(".check-icon");
    const finish = document.querySelector(".finish");
    cloud.classList.add("pulseAnimation");

    text.style.transform = "translateX(-200%)";
    setTimeout(() => {
        btn.style.transform = "scaleX(0.95)";
        btn.style.borderRadius = "30px";
        cloud.style.transform = "translateX(-200%), scaleX(3.2), scaleY(1.25)";
    }, 200);

    setTimeout(() => {
        cloud.style.transform = "translateY(-200%), translateX(-200%)";
        btn.style.background = "#268778";
    }, 1000);

    setTimeout(() => {
        cloud.style.display = "none";
        check.style.display = "block";
        finish.classList.toggle('F');
    }, 2100);

    setTimeout(() => {
        check.style.transform = "scaleX(2.5), translateX(-75%), translateY(0)";
    }, 2150);

    btn.addEventListener("click", download);
}