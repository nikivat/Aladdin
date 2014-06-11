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

    var pressedKeys = {
        38: false, // up arrow
        37: false, // left arrow
        40: false, //down arrow
        39: false, //right arrow
        32: false  //space
    };

    function onKeyDown(e) {
        for (var index in pressedKeys) {
            if (e.keyCode == index) {
                pressedKeys[e.keyCode] = true;
            }
        }

        if (pressedKeys[38] && pressedKeys[37]) {
            // go up-left
            if (shipY >= SHIP_SPEED) {
                shipY -= SHIP_SPEED;
            }

            if (shipX >= SHIP_SPEED) {
                shipX -= SHIP_SPEED;
            }
        } else if (pressedKeys[38] && pressedKeys[39]) {
            // go up-right
            if (shipY >= SHIP_SPEED) {
                shipY -= SHIP_SPEED;
            }

            if (shipX < canvas.width - shipWidth - 5) {
                shipX += SHIP_SPEED;
            }
        } else if (pressedKeys[40] && pressedKeys[39]) {
            // go down-right
            if (shipY < canvas.height - shipHeight - 10) {
                shipY += SHIP_SPEED;
            }

            if (shipX < canvas.width - shipWidth - 5) {
                shipX += SHIP_SPEED;
            }
        } else if (pressedKeys[40] && pressedKeys[37]) {
            // go down-left
            if (shipY < canvas.height - shipHeight - 10) {
                shipY += SHIP_SPEED;
            }

            if (shipX >= SHIP_SPEED) {
                shipX -= SHIP_SPEED;
            }
        } else if (e.keyCode == 38) {
            //go up
            if (shipY >= SHIP_SPEED) {
                shipY -= SHIP_SPEED;
            }
        } else if (e.keyCode == 37) {
            //go left
            if (shipX >= SHIP_SPEED) {
                shipX -= SHIP_SPEED;
            }
        } else if (e.keyCode == 40) {
            //go down
            if (shipY < canvas.height - shipHeight - 10) {
                shipY += SHIP_SPEED;
            }
        } else if (e.keyCode == 39) {
            //go right
            if (shipX < canvas.width - shipWidth - 5) {
                shipX += SHIP_SPEED;
            }
        }

        if (pressedKeys[32]) {
            fire();
        }
    }

    function onKeyUp(e) {
        for (var index in pressedKeys) {
            if (e.keyCode == index) {
                pressedKeys[e.keyCode] = false;
            }
        }
    }

    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;

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
