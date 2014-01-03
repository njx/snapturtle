/*
 * snapturtle: SVG turtle graphics based on Snap.svg
 *
 * Copyright (c) 2014 Narciso Jaramillo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @constructor
 * Creates a SnapTurtle object from a Snap SVG element.
 * @param {Paper} snap A Snap SVG element, as returned by the Snap() constructor.
 * @param {number=} x Initial x-position of the turtle; default 0 (left edge).
 * @param {number=} y Initial y-position of the turtle; default 0 (top edge).
 */
function SnapTurtle(snap, x, y) {
    this._snap = snap;
    this._heading = 90;
    this._x = x || 0;
    this._y = y || 0;
    this._penColor = "#000";
    this._animating = false;
    this._animSpeed = 100;
    this._animQueue = [];
    this._processQueue = this._processQueue.bind(this);
}

SnapTurtle.prototype.forward = function (length) {
    this._drawAndMove(length);
    return this;
};

SnapTurtle.prototype.back = function (length) {
    this.right(180);
    this._drawAndMove(length);
    this.left(180);
    return this;
};

SnapTurtle.prototype.right = function (angle) {
    this._queueAnim({ type: "turn", angle: -angle });
    this._heading = (this._heading - angle) % 360;
    return this;
};

SnapTurtle.prototype.left = function (angle) {
    this._queueAnim({ type: "turn", angle: angle });
    this._heading = (this._heading + angle) % 360;
    return this;
};

SnapTurtle.prototype.penColor = function (color) {
    this._penColor = color;
    return this;
};

SnapTurtle.prototype._drawAndMove = function (length) {    
    var rad = this._heading * Math.PI / 180,
        newX = this._x + length * Math.cos(rad),
        newY = this._y - length * Math.sin(rad);
    this._queueAnim({ type: "line", x1: this._x, y1: this._y, x2: newX, y2: newY, penColor: this._penColor });
    this._x = newX;
    this._y = newY;
    return this;
};

SnapTurtle.prototype._queueAnim = function (anim) {
    if (!this._animating && !this._animQueue.length) {
        this._process(anim, false);
    } else {
        this._animQueue.push(anim);
        if (!this._animRequested) {
            this._animRequested = true;
            requestAnimationFrame(this._processQueue);
        }
    }
};

SnapTurtle.prototype._processQueue = function () {
    if (this._animQueue.length) {
        var anim = this._animQueue.shift();
        // If this is a "stop animating", then process all the items up to the next "start animating"
        // or the end of the queue.
        // TODO: if any anims come in asynchronously, this can get out of sync
        if (anim.type === "animOff") {
            while (this.animQueue.length && this.animQueue[0].type !== "animOn") {
                this._process(this._animQueue.shift(), false);
            }
        } else if (anim.type != "animOn") {
            this._process(anim, true);
        } else {
            requestAnimationFrame(this._processQueue);
        }
    }
};

SnapTurtle.prototype._process = function (anim, doAnim) {
    if (!doAnim) {
        // Only need to process lines
        if (anim.type === "line") {
            console.log("immediate: " + JSON.stringify(anim));
            this._snap.line(anim.x1, anim.y1, anim.x2, anim.y2).attr({ stroke: anim.penColor });
        }
    } else {
        console.log("starting: " + JSON.stringify(anim));
        if (anim.type === "turn") {
            this._startAngleAnim(anim);
        } else if (anim.type === "line") {
            this._startLineAnim(anim);
        }
    }
};

SnapTurtle.prototype._startAngleAnim = function (anim) {
    // TODO: doesn't do anything yet
    requestAnimationFrame(this._processQueue);
};

SnapTurtle.prototype._startLineAnim = function (anim) {
    var self = this,
        line = this._snap.line(anim.x1, anim.y1, anim.x1, anim.y1);
    line.attr({ stroke: anim.penColor });
    line.animate({x2: anim.x2, y2: anim.y2}, this._animSpeed, mina.linear, function () {
        requestAnimationFrame(self._processQueue);
    });
};

SnapTurtle.prototype.clear = function () {
    this._snap.selectAll("*").remove();
    return this;
};

SnapTurtle.prototype.goto = function (x, y) {
    this._x = x;
    this._y = y;
    return this;
};

SnapTurtle.prototype.heading = function (angle) {
    this._heading = angle;
    return this;
};

SnapTurtle.prototype.animate = function (val, speed) {
    if (this._animating && !val) {
        this._animQueue.push({ type: "animOff" });
    } else if (!this._animating && val) {
        this._animQueue.push({ type: "animOn" });
    }
    this._animating = val;
    this._animSpeed = speed;
};
