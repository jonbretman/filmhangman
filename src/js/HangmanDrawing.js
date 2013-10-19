define('HangmanDrawing', function () {

    var HangmanDrawing = function () {
        this.width = 250;
        this.height = 250;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'hangman-drawing';
        var ctx = this.canvas.getContext('2d');
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    };

    HangmanDrawing.prototype = {

        width: null,
        height: null,
        canvas: null,
        isComplete: false,

        appendTo: function (el) {
            el.appendChild(this.canvas);
            return this;
        },

        clear: function () {
            this.canvas.getContext('2d').clearRect(0, 0, this.width, this.height);
            return this;
        },

        drawBaseLeft: function (callback) {
            this.drawLine_({
                x: 20,
                y: this.height - 20,
                endX: 63,
                endY: this.height - 63,
                duration: 500,
                callback: callback
            });
            return this;
        },

        drawBaseRight: function (callback) {
            this.drawLine_({
                x: 100,
                y: this.height - 20,
                endX: 57,
                endY: this.height - 63,
                duration: 500,
                callback: callback
            });
            return this;
        },

        drawUpright: function (callback) {
            this.drawLine_({
                x: 60,
                y: this.height - 60,
                endX: 60,
                endY: 20,
                duration: 750,
                callback: callback
            });
            return this;
        },

        drawTopBeam: function (callback) {
            this.drawLine_({
                x: 55,
                y: 25,
                endX: 170,
                endY: 25,
                duration: 750,
                callback: callback
            });
            return this;
        },

        drawRope: function (callback) {
            this.drawLine_({
                x: 165,
                y: 20,
                endX: 165,
                endY: 65,
                duration: 500,
                callback: callback
            });
            return this;
        },

        drawHead: function (callback) {
            this.drawCircle_({
                x: 165,
                y: 84,
                duration: 1000,
                callback: callback
            });
            return this;
        },

        drawBody: function (callback) {
            this.drawLine_({
                x: 165,
                y: 100,
                endX: 165,
                endY: 160,
                duration: 500,
                callback: callback
            });
            return this;
        },

        drawLegs: function (callback) {
            this.drawLine_({
                x: 135,
                y: 200,
                endX: 165,
                endY: 160,
                duration: 500,
                callback: function () {
                    this.drawLine_({
                        x: 195,
                        y: 200,
                        endX: 165,
                        endY: 160,
                        duration: 500,
                        callback: callback
                    });
                }.bind(this)
            });
        },

        drawArms_: function (callback) {
            this.drawLine_({
                x: 125,
                y: 130,
                endX: 205,
                endY: 130,
                duration: 500,
                callback: callback
            });
        },

        getBuffer_: function () {
            var buffer = document.createElement('canvas');
            buffer.width = this.width;
            buffer.height = this.height;
            var bctx = buffer.getContext('2d');
            bctx.drawImage(this.canvas, 0, 0);
            return buffer;
        },

        drawCircle_: function (opts) {

            var x = opts.x;
            var y = opts.y;
            var duration = opts.duration;
            var callback = opts.callback;
            var buffer = this.getBuffer_();
            var canvas = this.canvas;
            var ctx = canvas.getContext('2d');
            var segments = (duration / 1000) * 60;
            var currentSegment = 0;

            var nextTick = function (num) {
                var tick = ((Math.PI / 180) * 360) / segments;
                return tick * num;
            };

            var segment = function (end) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(buffer, 0, 0);
                ctx.beginPath();
                ctx.arc(x, y, 15, 0, end);
                ctx.stroke();
                ctx.closePath();
            };

            var render = function () {
                segment(nextTick(currentSegment + 1));
                currentSegment += 1;
                if (currentSegment < segments) {
                    requestAnimationFrame(render);
                }
                else {
                    callback();
                }
            };

            canvas.width = this.width;
            canvas.height = this.height;
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';

            render();
            return this;
        },

        drawLine_: function (opts) {

            var x = opts.x;
            var y = opts.y;
            var endX = opts.endX;
            var endY = opts.endY;
            var duration = opts.duration;
            var callback = opts.callback;
            var canvas = this.canvas;
            var buffer = this.getBuffer_();
            var ctx = this.canvas.getContext('2d');
            var segments = (duration / 1000) * 60;
            var currentSegment = 0;
            var tickX = (endX - x) / segments;
            var tickY = (endY - y) / segments;

            var nextTick = function (num) {
                return {
                    x: x + (tickX * num),
                    y: y + (tickY * num)
                };
            };

            var segment = function (coords) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(buffer, 0, 0);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(coords.x, coords.y);
                ctx.closePath();
                ctx.stroke();
            };

            var render = function () {
                segment(nextTick(currentSegment + 1));
                currentSegment++;
                if (currentSegment < segments) {
                    requestAnimationFrame(render);
                }
                else {
                    callback();
                }
            };

            canvas.width = this.width;
            canvas.height = this.height;
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';

            render();
            return this;
        }

    };

    return HangmanDrawing;

});