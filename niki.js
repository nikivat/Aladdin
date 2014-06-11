(function() {
    var paper = Raphael('svg', 313, 500);
    // background image
    paper.image('./img/space.png', 0, 0, 313, 500);

    // moving background stars
    var SPEED = 6000;

    function repeat() {
        stars.attr({
            y: -500
        });
        stars.animate({
            y: 500
        }, 2 * SPEED);

        setTimeout(repeat, 2 * SPEED);
    }

    function repeat2() {
        stars2.attr({
            y: -500
        });
        stars2.animate({
            y: 500
        }, 2 * SPEED);

        setTimeout(repeat2, 2 * SPEED);
    }

    var stars = paper.image('./img/star.png', 0, 0, 313, 500);
    stars.animate({
        y: 500
    }, SPEED, repeat);

    var stars2 = paper.image('./img/star.png', 0, -500, 313, 500);
    stars2.animate({
        y: 500
    }, 2 * SPEED, repeat2);

}());
