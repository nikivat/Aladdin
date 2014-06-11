window.onload = function myfunction() {

    var canvas = document.createElement("canvas");
    var canvasWidth = document.getElementById("svg").offsetWidth + "px";
    var canvasHeight = document.getElementById("svg").offsetHeight + "px";
    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);
    canvas.setAttribute("style", "z-index: 100; position:absolute; top: 0px; left:0px;");
    document.getElementById("svg").setAttribute("style", "z-index: -1");
    canvas.id = "space-ship";

    document.body.appendChild(canvas);

    var context = canvas.getContext("2d"),
        speed = 5,
        width = 50, //dimensions of the player
        height = 70,
        x = canvas.width / 2, //align to centre of the screen
        y = canvas.height - height,
        spaceShip = new Image(),
        sizeOfShots = 5,
        allShots = [];

    spaceShip.src = "img/spaceship.png";
    context.drawImage(spaceShip, x, y, width, height);

    window.addEventListener('keydown', onKeyDown);

    function Shot(x, y, shotSize) {
        this.x = x;
        this.y = y;

        this.draw = function () {
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.x, this.y - shotSize);
            context.strokeStyle = "yellow";
            context.lineWidth = 2;
            context.stroke();
        }

        this.move = function () {
            this.y -= speed;
        }
    }

    function fire() {
        var shot = new Shot(x + width / 2, y, sizeOfShots);
        allShots.push(shot);
    }

    function moveShots(shots) {
        for (var i = 0, length = shots.length; i < length; i++) {
            if (shots[i].y <= 0) {
                shots.splice(i, 1);
                i--;
            }
            if (shots.length <= 0) {
                break;
            }
        }

        for (var i = 0, length = shots.length; i < length; i++) {
            shots[i].move();
            shots[i].draw();
        }
    }

    function onKeyDown(event) {
        if (event.keyCode == 38) {
            if (y >= speed) {
                y -= speed; //going up
                console.log("y" + y);
            }
        }
        if (event.keyCode == 37) {
            if (x >= speed) {
                x -= speed; //going left
                console.log("x" + x);
            }
        }
        if (event.keyCode == 40) {
            if (y < canvas.height - height) {
                y += speed; //going down
                console.log("y" + y);
            }
        }
        if (event.keyCode == 39) {
            if (x < canvas.width - width) {
                x += speed; //going right
                console.log("x" + x);
            }
        }
        if (event.keyCode == 32) {
            fire();
        }
        requestAnimationFrame(render);
    };

    function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(spaceShip, x, y, width, height);
        moveShots(allShots);
        requestAnimationFrame(render);
    }
    //requestAnimationFrame(renderShip);

}