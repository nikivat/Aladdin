/*jslint browser:true*/

(function() {
    'use strict';

    var canvas = document.getElementById("ship"),
        context = canvas.getContext("2d"),
        shipX = canvas.width / 2 - consts.SHIP_WIDTH / 2,
        shipY = canvas.height - consts.SHIP_HEIGHT - 10,
        spaceShip = new Image(),
        meteorImage = new Image(),
        allShots = [],
        allMeteors = [],
        keys = [],
        shipAlive = true,
        gameOver = false;

    context.strokeStyle = "white";
    spaceShip.src = "img/spaceship.png";
    meteorImage.src = 'img/meteorit.png';


    // GAME ENGINE

    function detectCollisions() {
        // collision bullet-meteor
        for (var i = 0; i < allMeteors.length; i += 1) {
            for (var j = 0; j < allShots.length; j += 1) {
                if ((allMeteors[i].y + consts.METEOR_HEIGHT) >= (allShots[j].y - consts.SHOT_SIZE)) {
                    if (allMeteors[i].x <= allShots[j].x) {
                        if ((allMeteors[i].x + consts.METEOR_WIDTH) >= allShots[j].x) {
                            allShots[j].destroyed = true;
                            allMeteors[i].destroyed = true;
                            break;
                        }
                    }
                }
            }
        }

        // collision ship-meteor
        for (var k = 0; k < allMeteors.length; k += 1) {
            if (shipX >= allMeteors[k].x &&
                shipX <= allMeteors[k].x + consts.METEOR_WIDTH &&
                shipY >= allMeteors[k].y &&
                shipY <= allMeteors[k].y + consts.METEOR_HEIGHT) {

                shipAlive = false;
                destroyShip();
                break;
            } else if (shipX + consts.SHIP_WIDTH >= allMeteors[k].x &&
                shipX + consts.SHIP_WIDTH <= allMeteors[k].x + consts.METEOR_WIDTH &&
                shipY >= allMeteors[k].y &&
                shipY <= allMeteors[k].y + consts.METEOR_HEIGHT) {

                shipAlive = false;
                destroyShip();
                break;
            } else if (shipX >= allMeteors[k].x &&
                shipX <= allMeteors[k].x + consts.METEOR_WIDTH &&
                shipY + consts.SHIP_HEIGHT >= allMeteors[k].y &&
                shipY + consts.SHIP_HEIGHT <= allMeteors[k].y + consts.METEOR_HEIGHT) {

                shipAlive = false;
                destroyShip();
                break;
            } else if (shipX + consts.SHIP_WIDTH >= allMeteors[k].x &&
                shipX + consts.SHIP_WIDTH <= allMeteors[k].x + consts.METEOR_WIDTH &&
                shipY + consts.SHIP_HEIGHT >= allMeteors[k].y &&
                shipY + consts.SHIP_HEIGHT <= allMeteors[k].y + consts.METEOR_HEIGHT) {

                shipAlive = false;
                destroyShip();
                break;
            }
        }

        checkMeteors();
        checkShots();
    }

    function gameEnd() {
        for (var j = 0; j < allMeteors.length; j += 1) {
            destroyMeteor(allMeteors[j].x, allMeteors[j].y);
        }

        context.fillStyle = "#D3FF87";
        context.font = '40px san-serif';
        context.textBaseline = 'bottom';
        var text = 'Game over !',
            i = 1;

        function drawFinalText() {
            context.fillText(text.substr(0, i), 50, 50);
            i += 1;

            if (i <= text.length) {
                setTimeout(drawFinalText, 200);
            }
        }

        drawFinalText();
    }

    window.onload = function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        detectCollisions();
        renderShip(0);
        renderAllMeteors();
        renderAllShots();
        checkMovementKeys();

        if (shipAlive) {
            setTimeout(gameLoop, 30);
        } else {
            gameEnd();
        }
    };

    // SPACESHIP

    function renderShip(frame) {
        context.drawImage(spaceShip, frame * consts.SHIP_WIDTH, 0, consts.SHIP_WIDTH, consts.SHIP_HEIGHT,
            shipX, shipY, consts.SHIP_WIDTH, consts.SHIP_HEIGHT);
    }

    var shipFrames = 1;

    function destroyShip() {
        context.clearRect(shipX, shipY, consts.SHIP_WIDTH, consts.SHIP_HEIGHT);
        renderShip(shipFrames);
        shipFrames += 1;

        if (shipFrames <= 6) {
            setTimeout(destroyShip, 400);
        }
    }

    // ON USER KEY PRESSED

    function checkMovementKeys() {
        if (!shipAlive) {
            return;
        }

        if (keys[38]) {
            //go up
            if (shipY >= consts.MOVEMENT_SPEED) {
                shipY -= consts.MOVEMENT_SPEED;
            }
        }

        if (keys[37]) {
            //go left
            if (shipX >= consts.MOVEMENT_SPEED) {
                shipX -= consts.MOVEMENT_SPEED;
            }
        }

        if (keys[40]) {
            //go down
            if (shipY < canvas.height - consts.SHIP_HEIGHT - 10) {
                shipY += consts.MOVEMENT_SPEED;
            }
        }

        if (keys[39]) {
            //go right
            if (shipX < canvas.width - consts.SHIP_WIDTH - 5) {
                shipX += consts.MOVEMENT_SPEED;
            }
        }
    }

    function checkShootingKey() {
        if (keys[32] && shipAlive) {
            fire();
        }

        setTimeout(checkShootingKey, 100);
    }

    checkShootingKey();

    addEventListener('keydown', function(e) {
        keys[e.keyCode] = true;
    });

    addEventListener('keyup', function(e) {
        keys[e.keyCode] = false;
    });

    // SHOOTING

    function Shot(x, y) {
        this.x = x;
        this.y = y;
        this.destroyed = false;

        this.render = function() {
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.x, this.y - consts.SHOT_SIZE);
            context.lineWidth = 3;
            context.stroke();
        };

        this.move = function() {
            this.y -= consts.MOVEMENT_SPEED;
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
        for (var i = 0; i < allShots.length; i += 1) {
            if (allShots[i].y <= 0 || allShots[i].destroyed) {
                allShots.splice(i, 1);
                i--;
            }
        }
    }

    // METEORS

    function Meteor(x, y) {
        this.x = x;
        this.y = y;
        this.destroyed = false;

        this.render = function(frame) {
            context.drawImage(meteorImage, frame * consts.METEOR_WIDTH, 0, consts.METEOR_WIDTH, consts.METEOR_HEIGHT,
                this.x, this.y, consts.METEOR_WIDTH, consts.METEOR_HEIGHT);
        };

        this.move = function() {
            this.y += consts.MOVEMENT_SPEED;
        };
    }

    function renderAllMeteors() {
        for (var i = 0; i < allMeteors.length; i += 1) {
            allMeteors[i].move();
            allMeteors[i].render(0);
        }
    }

    function destroyMeteor(x, y) {
        var meteorFrame = 1;

        function animate() {
            context.clearRect(x, y, consts.METEOR_WIDTH, consts.METEOR_HEIGHT);
            context.drawImage(meteorImage, meteorFrame * consts.METEOR_WIDTH, 0, consts.METEOR_WIDTH, consts.METEOR_HEIGHT,
                x, y, consts.METEOR_WIDTH, consts.METEOR_HEIGHT);
            meteorFrame += 1;

            if (meteorFrame <= 8) {
                setTimeout(animate, 30);
            }
        }

        animate();
    }

    function checkMeteors() {
        for (var i = 0; i < allMeteors.length; i += 1) {
            if (allMeteors[i].y >= consts.GAME_HEIGHT || allMeteors[i].destroyed) {
                destroyMeteor(allMeteors[i].x, allMeteors[i].y);
                allMeteors.splice(i, 1);
                i--;
            }
        }
    }

    function generateMeteors() {
        if (allMeteors.length < consts.METEORS_COUNT && shipAlive) {
            var randomX = Math.random() * (consts.GAME_WIDTH - consts.METEOR_WIDTH),
                meteor = new Meteor(randomX, -60);

            allMeteors.push(meteor);
        }

        setTimeout(generateMeteors, 500);
    }

    generateMeteors();

}());
