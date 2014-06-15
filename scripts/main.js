/*jslint browser:true*/

(function() {
    'use strict';

    var canvas = document.getElementById('ship'),
        context = canvas.getContext('2d'),
        shipX = canvas.width / 2 - consts.SHIP_WIDTH / 2,
        shipY = canvas.height - consts.SHIP_HEIGHT - 10,
        spaceShip = new Image(),
        meteorImage = new Image(),
        allShots = [],
        reload = [],
        allMeteors = [],
        reloadImg = new Image(),
        keys = [],
        distance = document.getElementById('distance'),
        currDistance = 0.0,
        fuel = document.getElementById('fuel').getElementsByTagName('div')[0],
        restart = document.getElementById('restart'),
        shipAlive = true,
        score = document.getElementById('score'),
        currentScore = 0,
        bonus = 0,
        countEnter;

    context.strokeStyle = 'white';
    spaceShip.src = 'img/spaceship.png';
    meteorImage.src = 'img/meteorit.png';
    reloadImg.src = 'img/reload.png';

    // GAME ENGINE

    // reload
    var reloadCanvas = document.getElementById('reload'),
        ctxReload = reloadCanvas.getContext('2d'),
        randomX = Math.random() * (consts.GAME_WIDTH - 30);

    function Reload() {
        this.x = randomX;
        this.y = -40;
        this.image = reloadImg;
        this.direction = 'R';

        this.render = function() {
            ctxReload.drawImage(this.image, this.x, this.y);
        };

        this.move = function() {
            this.y += 4;
            var rightEnd = this.x + 30;
            if (this.direction === 'R') {
                if ((rightEnd += 4) < consts.GAME_WIDTH) {
                    this.x += 4;
                } else {
                    this.direction = 'L';
                }
            } else {
                if ((this.x -= 4) > 0) {
                    this.x -= 4;
                } else {
                    this.direction = 'R';
                }
            }
        };
    }

    function checkReload() {
        if (reload.length > 0) {
            if (reload[0].y > consts.GAME_HEIGHT) {
                reload.pop();
                return;
            }

            if (reload[0].x >= shipX &&
                reload[0].x <= shipX + 30 &&
                reload[0].y >= shipY &&
                reload[0].y <= shipY + 40) {

                reload.pop();
                fuel.style.width = '144px';
                return;
            } else if (reload[0].x + 30 >= shipX &&
                reload[0].x + 30 <= shipX + 30 &&
                reload[0].y >= shipY &&
                reload[0].y <= shipY + 40) {

                reload.pop();
                fuel.style.width = '144px';
                return;
            } else if (reload[0].x >= shipX &&
                reload[0].x <= shipX + 30 &&
                reload[0].y + 30 >= shipY &&
                reload[0].y + 30 <= shipY + 40) {

                reload.pop();
                fuel.style.width = '144px';
                return;
            } else if (reload[0].x + 30 >= shipX &&
                reload[0].x + 30 <= shipX + 30 &&
                reload[0].y + 30 >= shipY &&
                reload[0].y + 30 <= shipY + 40) {

                reload.pop();
                fuel.style.width = '144px';
                return;
            }
        }
    }

    setInterval(function() {
        if (reload.length === 0) {
            var r = new Reload();
            reload.push(r);
        }
    }, 16000);

    // end of reload

    var endOfText = false;

    window.onload = function() {
        context.fillStyle = '#D3FFEB';
        context.font = '25px san-serif';
        context.textBaseline = 'bottom';
        var text = 'Press ENTER to start!',
            i = 1;

        function drawStartText() {
            context.fillText(text.substr(0, i), 45, 260);
            i += 1;

            if (i <= text.length) {
                setTimeout(drawStartText, 100);
            } else {
                endOfText = true;
                countEnter = 0;
            }
        }

        drawStartText();
    };

    addEventListener('keydown', function(e) {
        countEnter++;
        if (e.keyCode == 13 && endOfText && countEnter === 1) {
            gameLoop();
            document.getElementById('fuel').getElementsByTagName('div')[0].style.width = '144px';
            calculateFuel();
            calculateDistance();
            calculateScore();
        }
    });

    function calculateDistance() {
        if (!shipAlive) {
            return;
        }

        currDistance += 0.1;
        var num = currDistance.toFixed(1);
        distance.innerHTML = 'Distance: ' + num + ' km';

        setTimeout(calculateDistance, 100);
    }

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
            if (shipX >= allMeteors[k].x + consts.COLLISION_PIXELS &&
                shipX <= allMeteors[k].x + consts.METEOR_WIDTH - consts.COLLISION_PIXELS &&
                shipY >= allMeteors[k].y + consts.COLLISION_PIXELS &&
                shipY <= allMeteors[k].y + consts.METEOR_HEIGHT - consts.COLLISION_PIXELS) {

                shipAlive = false;
                destroyShip();
                break;
            } else if (shipX + consts.SHIP_WIDTH >= allMeteors[k].x  + consts.COLLISION_PIXELS &&
                shipX + consts.SHIP_WIDTH <= allMeteors[k].x + consts.METEOR_WIDTH  - consts.COLLISION_PIXELS &&
                shipY >= allMeteors[k].y + consts.COLLISION_PIXELS &&
                shipY <= allMeteors[k].y + consts.METEOR_HEIGHT - consts.COLLISION_PIXELS ) {

                shipAlive = false;
                destroyShip();
                break;
            } else if (shipX >= allMeteors[k].x + consts.COLLISION_PIXELS &&
                shipX <= allMeteors[k].x + consts.METEOR_WIDTH - consts.COLLISION_PIXELS &&
                shipY + consts.SHIP_HEIGHT >= allMeteors[k].y + consts.COLLISION_PIXELS &&
                shipY + consts.SHIP_HEIGHT <= allMeteors[k].y + consts.METEOR_HEIGHT - consts.COLLISION_PIXELS) {

                shipAlive = false;
                destroyShip();
                break;
            } else if (shipX + consts.SHIP_WIDTH >= allMeteors[k].x  + consts.COLLISION_PIXELS &&
                shipX + consts.SHIP_WIDTH <= allMeteors[k].x + consts.METEOR_WIDTH  - consts.COLLISION_PIXELS &&
                shipY + consts.SHIP_HEIGHT >= allMeteors[k].y + consts.COLLISION_PIXELS &&
                shipY + consts.SHIP_HEIGHT <= allMeteors[k].y + consts.METEOR_HEIGHT - consts.COLLISION_PIXELS) {

                shipAlive = false;
                destroyShip();
                break;
            }
        }

        checkMeteors();
        checkShots();
    }

    function gameEnd() {
        endOfText = false;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var j = 0; j < allMeteors.length; j += 1) {
            destroyMeteor(allMeteors[j].x, allMeteors[j].y);
        }

        allMeteors = [];

        context.fillStyle = '#D3FFEB';
        context.font = '40px san-serif';
        context.textBaseline = 'bottom';
        var text = 'Game over !',
            i = 1;

        function drawFinalText() {
            context.fillText(text.substr(0, i), 50, 200);
            i += 1;

            if (i <= text.length) {
                setTimeout(drawFinalText, 200);
            }
        }

        drawFinalText();
    }

    function gameLoop() {
        ctxReload.clearRect(0, 0, reloadCanvas.width, reloadCanvas.height);
        if (reload[0]) {
            reload[0].render();
            reload[0].move();
        }

        checkReload();

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
            setTimeout(function() {
                restart.style.zIndex = '100';
            }, 3000);
        }
    }

    restart.addEventListener('click', function() {
        location.reload();
    });

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

    function calculateFuel() {
        var fuelValue = parseInt(fuel.style.width);
        fuelValue -= 3;
        if (fuelValue < 0) {
            fuelValue = 0;
            shipAlive = false;
        }

        fuel.style.width = fuelValue + 'px';
        if (shipAlive) {
            setTimeout(calculateFuel, 1000);
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
        if (allShots.length < 5) {
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

    // SCORE

    function calculateScore() {
        if (!shipAlive) {
            return;
        }

        currentScore = Math.floor(currDistance * 10);

        score.innerHTML = 'Score<br />' + currentScore +
            '<br />Bonus<br />' + bonus;

        setTimeout(calculateScore, 100);
    }

}());
