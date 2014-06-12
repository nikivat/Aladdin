(function () {
    var canvas = document.getElementById("ship"),
        context = canvas.getContext("2d"),
        shipX = canvas.width / 2 - consts.SHIP_WIDTH / 2,
        shipY = canvas.height - consts.SHIP_HEIGHT - 10,
        spaceShip = new Image(),
        allShots = [],
        allMeteors = [],
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
        meteorsManager();//////////

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

        var frame = 60,
            oldPosX = posX,
            oldPosY = posY;
        this.x = posX;
        this.y = posY;

        this.width = 60;
        this.height = 60;
        this.image = meteorImage;

        this.render = function (clipX) {
            ctx.clearRect(oldPosX, oldPosY, this.width, this.height);
            ctx.drawImage(
                this.image,
                clipX,
                0,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        };

        this.animate = function () {
            this.render(frame);
            frame += 60;

            if (frame >= 480) {
                //frame = 0;
                return;
            }

            setTimeout(this.animate, 80);
        };

        this.move = function () {
            this.render(0);
            oldPosY = this.y;
            this.y += consts.SHIP_SPEED;
        }
    }

    function createMeteors() {
        var randomX = 0 | Math.random() * consts.GAME_WIDTH;
        var newMeteor = new Meteor(context, randomX, 5);
        allMeteors.push(newMeteor);

        setTimeout(createMeteors, 1000);
    }
    createMeteors();
    function meteorsManager() {
        for (var i = 0, length = allMeteors.length; i < length; i++) {
            allMeteors[i].move();
        }

        checkForShotMeteors();
        checkForEscapedMeteors();
    }

    function checkForShotMeteors() {
        for (var i = 0; i < allMeteors.length; i++) {
            for (var j = 0; j < allShots.length; j++) {
                if (allShots[j].x >= allMeteors[i].x - 30 && allShots[j].x <= (allMeteors[i].x + allMeteors[i].width) &&
                    allShots[j].y == (allMeteors[i].y + allMeteors[i].height)) {
                    allShots.splice(j, 1);
                    j--;

                    allMeteors[i].animate();
                    allMeteors.splice(i, 1);
                    i--;
                }
            }
        }
    }

    function checkForCollisionWithShip() {

    }

    function checkForEscapedMeteors() {
        for (var i = 0; i < allMeteors.length; i++) {
            if (allMeteors[i].y >= consts.GAME_HEIGHT) {
                allMeteors.splice(i, 1);
                i--;
            }
        }
    }
}());
