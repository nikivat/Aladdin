(function() {
    var paper = Raphael('svg', 800, 501);
    // background image
    paper.image('./img/space.png', 0, 0, 800, 501);

    // moving background stars
    var SPEED = 6000;

    function repeat() {
        stars.attr({
            y: -501
        });
        stars.animate({
            y: 501
        }, 2 * SPEED);

        setTimeout(repeat, 2 * SPEED);
    }

    function repeat2() {
        stars2.attr({
            y: -501
        });
        stars2.animate({
            y: 501
        }, 2 * SPEED);

        setTimeout(repeat2, 2 * SPEED);
    }

    var stars = paper.image('./img/star.png', 0, 0, 800, 501);
    stars.animate({
        y: 501
    }, SPEED, repeat);

    var stars2 = paper.image('./img/star.png', 0, -512, 800, 501);
    stars2.animate({
        y: 501
    }, 2 * SPEED, repeat2);

}());
