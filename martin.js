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

    window.onload = function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        renderShip();
        checkShots();
        renderAllShots();

        setTimeout(gameLoop, 20);
    };

    // ship rendering

    function renderShip() {
        context.drawImage(spaceShip, shipX, shipY);
    }

    // on user key pressed

    var keys = {
        38: false,
        37: false
    };

    function checkKeys(e) {

        if (keys[38] && keys[37]) {
            alert('URA')
        }



        /* if (e.keyCode == 38) {
            if (shipY >= SHIP_SPEED) {
                shipY -= SHIP_SPEED; //going up
            }
        } else if (e.keyCode == 37) {
            if (shipX >= SHIP_SPEED) {
                shipX -= SHIP_SPEED; //going left
            }
        } else if (e.keyCode == 40) {
            if (shipY < canvas.height - shipHeight - 10) {
                shipY += SHIP_SPEED; //going down
            }
        } else if (e.keyCode == 39) {
            if (shipX < canvas.width - shipWidth - 5) {
                shipX += SHIP_SPEED; //going right
            }
        } else if (e.keyCode == 32) {
            fire();
        } */
    };

    function onKeyDown(e) {
        for (var index in keys) {
            if (e.keyCode == index) {
                keys[e.keyCode] = true;
            }
        }
    }

    function onKeyUp(e) {
        for (var index in keys) {
            if (e.keyCode == index) {
                keys[e.keyCode] = false;
            }
        }
    }

    addEventListener('keydown', onKeyDown);
    addEventListener('keyup', onKeyUp);

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

    function checkShots() {
        for (var i = 0; i < allShots.length; i++) {
            if (allShots[i].y <= 0) {
                allShots.splice(i, 1);
                i--;
            }
        }
    }

})();
