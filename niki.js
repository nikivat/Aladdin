(function() {
    var paper = Raphael('svg', 800, 501);
    paper.image('./img/space.png', 0, 0, 800, 501);

    var star = paper.image('./img/star.png', 0, 0, 800, 501);
    var anim = Raphael.animation({
        y: 501
    }, 6000).repeat(Infinity);
    star.animate(anim);

}());
