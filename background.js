(function() {
    var paper = Raphael('svg', consts.GAME_WIDTH, consts.GAME_HEIGHT);
    // background image
    paper.image('./img/space.png', 0, 0, consts.GAME_WIDTH, consts.GAME_HEIGHT);

    // moving background stars

    function repeat() {
        stars.attr({
            y: -consts.GAME_HEIGHT
        });
        stars.animate({
            y: consts.GAME_HEIGHT
        }, 2 * consts.STARS_SPEED);

        setTimeout(repeat, 2 * consts.STARS_SPEED);
    }

    function repeat2() {
        stars2.attr({
            y: -consts.GAME_HEIGHT
        });
        stars2.animate({
            y: consts.GAME_HEIGHT
        }, 2 * consts.STARS_SPEED);

        setTimeout(repeat2, 2 * consts.STARS_SPEED);
    }

    var stars = paper.image('./img/star.png', 0, 0, consts.GAME_WIDTH, consts.GAME_HEIGHT);
    stars.animate({
        y: consts.GAME_HEIGHT
    }, consts.STARS_SPEED, repeat);

    var stars2 = paper.image('./img/star.png', 0, -consts.GAME_HEIGHT, consts.GAME_WIDTH, consts.GAME_HEIGHT);
    stars2.animate({
        y: consts.GAME_HEIGHT
    }, 2 * consts.STARS_SPEED, repeat2);
}());
