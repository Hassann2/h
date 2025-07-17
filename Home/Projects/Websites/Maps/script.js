document.getElementById("send").addEventListener("click", function() {
    const key = "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";
    const street = document.getElementById("street").value;
    const city = document.getElementById("city").value;
    document.getElementById("map").setAttribute("src", "https://www.google.com/maps/embed/v1/place?q=" + encodeURIComponent(street) + "+" + encodeURIComponent(city) + `&key=${key}`);
});
