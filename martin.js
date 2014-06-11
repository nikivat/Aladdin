(function() {
    var canvas = document.getElementById("ship"),
        context = canvas.getContext("2d"),
        SHIP_SPEED = 5,
        shipWidth = 30,
        shipHeight = 40,
        shipX = canvas.width / 2 - shipWidth / 2, 
        shipY = canvas.height - shipHeight - 10,
        spaceShip = new Image(),
        SHOT_SIZE = 10,
        sizeOfShots = 10,
        allShots = [];

    context.strokeStyle = "white";
    spaceShip.src = "img/spaceship.png";

    window.onload = function renderPlayfield() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        renderShip();
        moveShots();
        renderAllShots();

        setTimeout(renderPlayfield, 20);
    };

    // ship rendering

    function renderShip() {
        context.drawImage(spaceShip, shipX, shipY);
    }

    // on user key pressed

    function onKeyDown(event) {
        if (event.keyCode == 38) {
            if (shipY >= SHIP_SPEED) {
                shipY -= SHIP_SPEED; //going up
            }
        } else if (event.keyCode == 37) {
            if (shipX >= SHIP_SPEED) {
                shipX -= SHIP_SPEED; //going left
            }
        } else if (event.keyCode == 40) {
            if (shipY < canvas.height - shipHeight - 10) {
                shipY += SHIP_SPEED; //going down
            }
        } else if (event.keyCode == 39) {
            if (shipX < canvas.width - shipWidth - 5) {
                shipX += SHIP_SPEED; //going right
            }
        }

        if (event.keyCode == 32) {
            fire();
        }
    }

    window.addEventListener('keydown', onKeyDown);

    // shooting

    function Shot(x, y) {
        this.x = x;
        this.y = y;

        this.render = function() {
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.x, this.y - SHOT_SIZE);
            context.lineWidth = 3;
            context.stroke();
        };

        this.move = function() {
            this.y -= SHIP_SPEED;
        };
    }

    function renderAllShots() {
        for (var i = 0; i < allShots.length; i += 1) {
            allShots[i].move();
            allShots[i].render();
        }
    }

    function fire() {
        if (allShots.length < 3) {
            var shot = new Shot(shipX + shipWidth / 2, shipY);
            allShots.unshift(shot);
        }
    }

    function moveShots() {
        for (var i = 0; i < allShots.length; i++) {
            if (allShots[i].y <= 0) {
                allShots.splice(i, 1);
                i--;
            }
        }
    }

})();
