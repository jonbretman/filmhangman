define('HangmanDrawing', ['libs/underscore'], function (_) {

    /**
     * HangmanDrawing clas
     * @constructor
     */
    var HangmanDrawing = function () {

        // bind all methods to correct context
        _.bindAll.apply(_, [this].concat(_.functions(this)));

        // order of the drawing
        this.order = [
            this.drawBase,
            this.drawUpright,
            this.drawTopBeam,
            this.drawSupport,
            this.drawRope,
            this.drawHead,
            this.drawBody,
            this.drawLegs,
            this.drawArms_
        ];

        // setup
        this.width = 250;
        this.height = 250;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'hangman-drawing';
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.currentColour_ = this.OUTLINE_COLOUR;
    };

    HangmanDrawing.prototype = {

        /**
         * The current color being drawn with. Either OUTLINE_COLOUR or DRAW_COLOUR
         * @type {String}
         * @private
         */
        currentColour_: null,

        /**
         * The current step being drawn.
         * @type {Number}
         * @private
         */
        currentStep: -1,

        /**
         * The width of the canvas
         * @type {Number}
         * @private
         */
        width: null,

        /**
         * The height of the canvas
         * @type {Number}
         * @private
         */
        height: null,

        /**
         * The canvas element.
         * @type {HTMLElement}
         * @private
         */
        canvas: null,

        /**
         * The order of the drawing methods.
         * @type {Function[]}
         * @private
         */
        order: null,

        /**
         * The outline color.
         * @type {String}
         * @private
         */
        OUTLINE_COLOUR: 'rgba(44,62,80, 0.3)',

        /**
         * The strong color used for actual game.
         * @type {String}
         * @private
         */
        DRAW_COLOUR: '#FC4349',

        /**
         * Appends this view to the passes element.
         * @param {HTMLElement} el
         * @returns {HangmanDrawing}
         */
        appendTo: function (el) {
            el.appendChild(this.canvas);
            return this;
        },

        /**
         * Resets the drawing.
         * @returns {HangmanDrawing}
         */
        reset: function () {
            this.canvas.getContext('2d').clearRect(0, 0, this.width, this.height);
            this.currentStep = -1;
            this.currentColour_ = this.OUTLINE_COLOUR;
            return this;
        },

        /**
         * Draws the outline of the hangman.
         * @param {Function} callback
         * @returns {HangmanDrawing}
         */
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
            return this;
        },

        /**
         * Draws the next step.
         * @param {Function} callback
         * @returns {HangmanDrawing}
         */
        drawNext: function (callback) {
            if (this.currentStep >= this.order.length - 1) {
                return this;
            }
            return this.order[++this.currentStep](callback || _.identity);
        },

        /**
         * Returns true if the drawing of the hangman is complete.
         * @returns {boolean}
         */
        isFinished: function () {
            return this.currentStep >= this.order.length - 1;
        },

        /**
         * Draws the base of the hangman.
         * @param callback
         * @returns {HangmanDrawing}
         */
        drawBase: function (callback) {
            this.drawBaseLeft(_.partial(this.drawBaseRight, callback));
            return this;
        },

        /**
         * Draws the left hand side of the base.
         * @param callback
         * @returns {HangmanDrawing}
         */
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

        /**
         * Draws the right hand side of the base.
         * @param callback
         * @returns {HangmanDrawing}
         */
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

        /**
         * Draws the upright part of the hangman drawing.
         * @param callback
         * @returns {HangmanDrawing}
         */
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

        /**
         * Draws the top beam of the hangman.
         * @param callback
         * @returns {HangmanDrawing}
         */
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

        /**
         * Draws the support connecting the upright and the top beam.
         * @param callback
         * @returns {HangmanDrawing}
         */
        drawSupport: function (callback) {
            this.drawLine_({
                x: 60,
                y: 60,
                endX: 90,
                endY: 25,
                duration: 500,
                callback: callback
            });
            return this;
        },

        /**
         * Draws the rope of the hangman.
         * @param callback
         * @returns {HangmanDrawing}
         */
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

        /**
         * Draws the hangmans head.
         * @param callback
         * @returns {HangmanDrawing}
         */
        drawHead: function (callback) {
            this.drawCircle_({
                x: 165,
                y: 84,
                duration: 500,
                callback: callback
            });
            return this;
        },

        /**
         * Draws the hangmans body
         * @param callback
         * @returns {HangmanDrawing}
         */
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

        /**
         * Draws the hangmans legs.
         * @param callback
         * @returns {HangmanDrawing}
         */
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
            return this;
        },

        /**
         * Draws the hangmans arms.
         * @param callback
         * @private
         * @returns {HangmanDrawing}
         */
        drawArms_: function (callback) {
            this.drawLine_({
                x: 125,
                y: 130,
                endX: 205,
                endY: 130,
                duration: 200,
                callback: callback
            });
            return this;
        },

        /**
         * Returns a buffer canvas used to preserve what is on the canvas before drawing.
         * @returns {HTMLElement}
         * @private
         */
        getBuffer_: function () {
            var buffer = document.createElement('canvas');
            buffer.width = this.width;
            buffer.height = this.height;
            var bctx = buffer.getContext('2d');
            bctx.drawImage(this.canvas, 0, 0);
            return buffer;
        },

        /**
         * Returns the 2d context for the canvas.
         * @returns {CanvasRenderingContext2D}
         * @private
         */
        getContext_: function () {
            var ctx = this.canvas.getContext('2d');
            ctx.lineWidth = 10;
            ctx.strokeStyle = this.currentColour_;
            return ctx;
        },

        /**
         * Animates the drawing of a circle.
         * @param opts
         * @returns {HangmanDrawing}
         * @private
         */
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

        /**
         * Animates the drawing of a line.
         * @param opts
         * @returns {HangmanDrawing}
         * @private
         */
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