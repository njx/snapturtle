var t = new SnapTurtle(Snap(800, 800), 400, 400);

function circle(inc) {
    for (var i = 0; i < 360; i++) {
        t.right(1).forward(inc);
    }
}

function square(len) {
    for (var i = 0; i < 4; i++) {
        t.forward(len).right(90);
    }
}

function arcr(size, deg) {
    for (var i = 0; i < deg; i++) {
        t.forward(size).right(1);
    }
}
function arcl(size, deg) {
    for (var i = 0; i < deg; i++) {
        t.forward(size).left(1);
    }
}

function ray(deg) {
    arcr(1, deg);
    arcl(1, deg);
    arcr(1, deg);
    arcl(1, deg);
}

//for (var i = 0; i < 9; i++) {
//    ray(120);
//    t.right(200);
//}

function branch(size, scale, lang, rang) {
    if (size < 3) return;
    
    t.forward(size);
    t.left(lang);
    branch(size * scale, scale, lang, rang);
    t.right(lang);
    t.right(rang);
    branch(size * scale, scale, lang, rang);
    t.left(rang);
    t.back(size);
}

//branch(100, 0.7, 10, 50);

function polyspi(size, angle) {
    if (size > 400) return;
    
    t.forward(size).right(angle);
    polyspi(size + 1, angle);
}

// polyspi(15, 72);

function dragon(size, level, isRight) {
    if (level === 0) {
        t.forward(size);
        return;
    }
    dragon(size, level - 1, false);
    if (isRight) {
        t.right(90);
    } else {
        t.left(90);
    }
    dragon(size, level - 1, true);
}

// dragon(5, 12, false);

//var level = 1;
//function animDragon() {
//    if (level <= 12) {
//        requestAnimationFrame(animDragon);
//    }
//    t.clear().goto(400, 400).heading(90);
//    dragon(5, level, false);
//    level++;
//}
//
//animDragon();

function nestedTriangle(size) {
    if (size < 10) {
        return;
    }
    for (var i = 0; i < 3; i++) {
        t.forward(size);
        t.right(120);
        nestedTriangle(size/2);
    }
}

t.goto(200, 400).right(30);
nestedTriangle(320);