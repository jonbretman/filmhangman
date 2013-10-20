define('HangmanDrawing', ['libs/underscore'], function (_) {

    var HangmanDrawing = function () {
        _.bindAll.apply(_, [this].concat(_.functions(this)));

        this.order = [
            this.drawBase,
            this.drawUpright,
            this.drawTopBeam,
            this.drawRope,
            this.drawHead,
            this.drawBody,
            this.drawLegs,
            this.drawArms_
        ];

        this.width = 250;
        this.height = 250;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'hangman-drawing';
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.currentColour_ = this.OUTLINE_COLOUR;
    };

    HangmanDrawing.prototype = {

        currentColour_: null,
        currentStep: -1,
        width: null,
        height: null,
        canvas: null,
        isComplete: false,
        order: null,

        OUTLINE_COLOUR: 'rgba(44,62,80, 0.3)',
        DRAW_COLOUR: '#FC4349',

        appendTo: function (el) {
            el.appendChild(this.canvas);
            return this;
        },

        reset: function () {
            this.canvas.getContext('2d').clearRect(0, 0, this.width, this.height);
            this.currentStep = -1;
            this.currentColour_ = this.OUTLINE_COLOUR;
            return this;
        },

        drawOutline: function (callback) {

            this.reset();

            var next = _.bind(function () {

                if (this.isFinished()) {
                    this.currentColour_ = this.DRAW_COLOUR;
                    this.currentStep = -1;
                    callback();
                }
                else {
                    this.drawNext(next);
                }

            }, this);

            next();
        },

        drawNext: function (callback) {
            if (this.currentStep >= this.order.length - 1) {
                return this;
            }
            return this.order[++this.currentStep](callback || _.identity);
        },

        isFinished: function () {
            return this.currentStep >= this.order.length - 1;
        },

        drawBase: function (callback) {
            this.drawBaseLeft(_.partial(this.drawBaseRight, callback));
            return this;
        },

        drawBaseLeft: function (callback) {
            this.drawLine_({
                x: 20,
                y: this.height - 20,
                endX: 63,
                endY: this.height - 63,
                duration: 250,
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
                duration: 250,
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
                duration: 500,
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
                duration: 500,
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
                duration: 350,
                callback: callback
            });
            return this;
        },

        drawHead: function (callback) {
            this.drawCircle_({
                x: 165,
                y: 84,
                duration: 500,
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
                duration: 350,
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
                duration: 150,
                callback: function () {
                    this.drawLine_({
                        x: 195,
                        y: 200,
                        endX: 165,
                        endY: 160,
                        duration: 150,
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
                duration: 200,
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

        getContext_: function () {
            var ctx = this.canvas.getContext('2d');
            ctx.lineWidth = 10;
            ctx.strokeStyle = this.currentColour_;
            return ctx;
        },


        drawCircle_: function (opts) {

            var buffer = this.getBuffer_();
            var canvas = this.canvas;
            var ctx = this.getContext_();
            var segments = (opts.duration / 1000) * 60;
            var currentSegment = 0;

            var nextTick = function (num) {
                var tick = ((Math.PI / 180) * 360) / segments;
                return tick * num;
            };

            var segment = function (end) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(buffer, 0, 0);
                ctx.beginPath();
                ctx.arc(opts.x, opts.y, 15, 0, end);
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
                    opts.callback();
                }
            };

            requestAnimationFrame(render);
            return this;
        },

        drawLine_: function (opts) {

            var buffer = this.getBuffer_();
            var canvas = this.canvas;
            var ctx = this.getContext_();
            var segments = (opts.duration / 1000) * 60;
            var currentSegment = 0;
            var tickX = (opts.endX - opts.x) / segments;
            var tickY = (opts.endY - opts.y) / segments;

            var nextTick = function (num) {
                return {
                    x: opts.x + (tickX * num),
                    y: opts.y + (tickY * num)
                };
            };

            var segment = function (coords) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(buffer, 0, 0);
                ctx.beginPath();
                ctx.moveTo(opts.x, opts.y);
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
                    opts.callback();
                }
            };

            requestAnimationFrame(render);
            return this;
        }

    };

    return HangmanDrawing;
});