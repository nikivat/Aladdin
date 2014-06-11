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
        checkMovementKeys();

        setTimeout(gameLoop, 30);
    };

    // ship rendering

    function renderShip() {
        context.drawImage(spaceShip, shipX, shipY);
    }

    // on user key pressed

    var keys = [];

    function checkMovementKeys() {
        if (keys[38]) {
            //go up
            if (shipY >= SHIP_SPEED) {
                shipY -= SHIP_SPEED;
            }
        }

        if (keys[37]) {
            //go left
            if (shipX >= SHIP_SPEED) {
                shipX -= SHIP_SPEED;
            }
        }

        if (keys[40]) {
            //go down
            if (shipY < canvas.height - shipHeight - 10) {
                shipY += SHIP_SPEED;
            }
        }

        if (keys[39]) {
            //go right
            if (shipX < canvas.width - shipWidth - 5) {
                shipX += SHIP_SPEED;
            }
        }
    }

    function checkShootingKey() {
        if (keys[32]) {
            fire();
        }

        setTimeout(checkShootingKey, 100);
    }

    checkShootingKey();

    //checkKeys();

    addEventListener('keydown', function(e) {
        keys[e.keyCode] = true;
    });

    addEventListener('keyup', function(e) {
        keys[e.keyCode] = false;
    });

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
