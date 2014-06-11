window.onload = function myfunction() {

    var canvas = document.getElementById("ship"),
        context = canvas.getContext("2d"),
        speed = 10,
        width = 30, //dimensions of the player
        height = 40,
        x = canvas.width / 2 - width / 2, //align to centre of the screen
        y = canvas.height - height - 10,
        spaceShip = new Image();

    spaceShip.src = "img/spaceship.png";
    context.drawImage(spaceShip, x, y, width, height);

    window.addEventListener('keydown', onKeyDown);

    function onKeyDown(event) {
        if (event.keyCode == 38) {
            if (y >= speed) {
                y -= speed; //going up
            }
        }
        if (event.keyCode == 37) {
            if (x >= speed) {
                x -= speed; //going left
            }
        }
        if (event.keyCode == 40) {
            if (y < canvas.height - height) {
                y += speed; //going down
            }
        }
        if (event.keyCode == 39) {
            if (x < canvas.width - width) {
                x += speed; //going right
            }
        }
        renderShip();
    }

    function renderShip() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(spaceShip, x, y, width, height);
    }
};
