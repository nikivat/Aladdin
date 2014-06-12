(function () {
    var canvas = document.getElementById("ship"),
        context = canvas.getContext("2d"),
        shipX = canvas.width / 2 - consts.SHIP_WIDTH / 2,
        shipY = canvas.height - consts.SHIP_HEIGHT - 10,
        spaceShip = new Image(),
        allShots = [],
        meteors = [],
        keys = [],
            meteorImage = new Image();

    context.strokeStyle = "white";
    spaceShip.src = "img/spaceship.png";
    meteorImage.src = 'img/meteorit.png';


    // GAME ENGINE

    window.onload = function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        renderShip();
        checkShots();
        renderAllShots();
        checkMovementKeys();

        setTimeout(gameLoop, 30);
    };

    // SHIP RENDER

    function renderShip() {
        context.drawImage(spaceShip, shipX, shipY);
    }

    // ON USER KEY PRESSED

    function checkMovementKeys() {
        if (keys[38]) {
            //go up
            if (shipY >= consts.SHIP_SPEED) {
                shipY -= consts.SHIP_SPEED;
            }
        }

        if (keys[37]) {
            //go left
            if (shipX >= consts.SHIP_SPEED) {
                shipX -= consts.SHIP_SPEED;
            }
        }

        if (keys[40]) {
            //go down
            if (shipY < canvas.height - consts.SHIP_HEIGHT - 10) {
                shipY += consts.SHIP_SPEED;
            }
        }

        if (keys[39]) {
            //go right
            if (shipX < canvas.width - consts.SHIP_WIDTH - 5) {
                shipX += consts.SHIP_SPEED;
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

    addEventListener('keydown', function (e) {
        keys[e.keyCode] = true;
    });

    addEventListener('keyup', function (e) {
        keys[e.keyCode] = false;
    });

    // SHOOTING

    function Shot(x, y) {
        this.x = x;
        this.y = y;

        this.render = function () {
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.x, this.y - consts.SHOT_SIZE);
            context.lineWidth = 3;
            context.stroke();
        };

        this.move = function () {
            this.y -= consts.SHIP_SPEED;
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
            var shot = new Shot(shipX + consts.SHIP_WIDTH / 2, shipY);
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

    function Meteor(ctx, posX, posY) {

            var meteor = {},
                frame = 0;

            meteor.width = 60;
            meteor.height = 60;
            meteor.image = coinImage;

            meteor.render = function (clipX) {
                ctx.clearRect(posX, posY, meteor.width, meteor.height);
                ctx.drawImage(
                    this.image,
                    clipX,
                    0,
                    this.width,
                    this.height,
                    posX,
                    posY,
                    this.width,
                    this.height
                );
            };

            meteor.animate = function () {
                meteor.render(frame);
                frame += 44;

                if (frame >= 440) {
                    frame = 0;
                }

                setTimeout(meteor.animate, 80);
            };

            return meteor;
        }

        //TO DO collision detector 
    }
})();
