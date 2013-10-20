define('HangmanKeyboard', ['DOM', 'Events', 'libs/underscore'], function ($, Events, _) {

    /**
     * Array of letters desribing the structure of a Qwerty keyboard
     * @type {Array}
     */
    var querty = [
        ['q','w','e','r','t','y','u','i','o','p'],
         ['a','s','d','f','g','h','j','k','l'],
            ['z','x','c','v','b','n','m']
    ];

    // detect touch support
    var hasTouch = 'ontouchstart' in window;
    var touchStartEvent = hasTouch ? 'touchstart' : 'mousedown';
    var touchEndEvent = hasTouch ? 'touchend' : 'mouseup';

    /**
     * HangmanKeyboard class
     * @constructor
     */
    var HangmanKeyboard = function () {
        _.bindAll.apply(_, [this].concat(_.functions(this)));
        this.createKeyboard_();
        this.bindEvents_();
    };

    HangmanKeyboard.prototype = _.extend(HangmanKeyboard.prototype, Events, {

        /**
         * Flag indicating whether the kayboard is enabled or not.
         */
        enabled_: false,

        KEY_A: 65,

        KEY_Z: 90,

        KEY_REG_EXP: /hangman-keyboard-key-[A-Z]/,

        currentKey_: null,

        /**
         * Appends this view to the pased element.
         * @param el
         * @returns {*}
         */
        appendTo: function (el) {
            el.appendChild(this.el);
            return this;
        },

        /**
         * Disables the kayboard
         * @returns {*}
         */
        disable: function () {
            this.enabled_ = false;
            return this;
        },

        /**
         * Enables the keyboard.
         * @returns {*}
         */
        enable: function () {
            this.enabled_ = true;
            return this;
        },

        /**
         * Resets the keyboard to it's default state.
         * @returns {*}
         */
        reset: function () {
            $('.hangman-keyboard-key').removeClass('selected guessed-correct guessed-incorrect');
            return this;
        },

        /**
         * Sets the passed letter to the guessed-correct state.
         * @param letter
         * @returns {*}
         */
        setLetterCorrect: function (letter) {
            $('#hangman-keyboard-key-' + letter).addClass('guessed-correct');
            return this;
        },

        /**
         * Sets the passed letter to the guessed-incorrect state
         * @param letter
         * @returns {*}
         */
        setLetterIncorrect: function (letter) {
            $('#hangman-keyboard-key-' + letter).addClass('guessed-incorrect');
            return this;
        },

        /**
         * Creates the keyboard.
         * @private
         */
        createKeyboard_: function () {

            this.el = document.createElement('div');
            this.el.className = 'hangman-keyboard';

            _.each(querty, function (row) {
                var container = document.createElement('div');
                container.className = 'hangman-keyboard-row';
                _.each(row, function (key) {
                    var el = document.createElement('span');
                    el.id = 'hangman-keyboard-key-' + key.toUpperCase();
                    el.className = 'hangman-keyboard-key';
                    el.innerHTML = key.toUpperCase();
                    container.appendChild(el);
                });
                this.el.appendChild(container);
            }, this);
        },

        /**
         * Binds all events.
         * @private
         */
        bindEvents_: function () {
            document.addEventListener('keydown', this.onKeyEvent_, false);
            document.addEventListener('keyup', this.onKeyEvent_, false);
            this.el.addEventListener(touchStartEvent, this.onTouchEvent_, false);
            this.el.addEventListener(touchEndEvent, this.onTouchEvent_, false);
        },

        /**
         * Resets the currently selected key.
         * @private
         */
        resetCurrentKey_: function () {
            if (this.currentKey_) {
                $(this.currentKey_).removeClass('selected');
            }
        },

        /**
         * Makes the passed key active by adding the selected class.
         * @param key
         * @private
         */
        makeKeyActive_: function (key) {
            $(key).addClass('selected');
            this.currentKey_ = key;
        },

        /**
         * Returns true if the passes key has already been guessed.
         * @param key
         * @returns {*}
         * @private
         */
        isKeyGuessed_: function (key) {
            key = $(key);
            return key.hasClass('guessed-correct') || key.hasClass('guessed-incorrect');
        },

        /**
         * Handles key events.
         * @param e
         * @returns {boolean}
         * @private
         */
        onKeyEvent_: function (e) {

            if (!this.enabled_) {
                return false;
            }

            var code = e.keyCode;

            if (code < this.KEY_A || code > this.KEY_Z) {
                return true;
            }

            var letter = String.fromCharCode(e.keyCode).toUpperCase();
            var id = 'hangman-keyboard-key-' + letter;
            var key = document.getElementById(id);

            if (!key || this.isKeyGuessed_(key)) {
                return true;
            }

            this.resetCurrentKey_();

            if (e.type === 'keydown') {
                this.makeKeyActive_(key);
                return true;
            }

            if (this.currentKey_ && key !== this.currentKey_) {
                return true;
            }

            this.trigger('letter', {
                letter: letter
            });
            return true;
        },

        /**
         * Handles touch events.
         * @param e
         * @returns {boolean}
         * @private
         */
        onTouchEvent_: function (e) {

            if (!this.enabled_) {
                return false;
            }

            var key = e.target;

            if (!key || !this.KEY_REG_EXP.test(key.id) || this.isKeyGuessed_(key)) {
                this.currentKey_ = null;
                return true;
            }

            this.resetCurrentKey_();

            if (e.type === touchStartEvent) {

                this.makeKeyActive_(key);
                this.currentKey_ = key;
                key.className += ' selected';

                if (!hasTouch) {
                    var mouseOut = _.bind(function () {
                        key.removeEventListener('mouseout', mouseOut, false);
                        this.resetCurrentKey_();
                        this.currentKey_ = null;
                    }, this);
                    key.addEventListener('mouseout', mouseOut, false);
                }

                return true;
            }

            if (key !== this.currentKey_) {
                return true;
            }

            this.trigger('letter', {
                letter: key.innerHTML
            });
            return true;
        }

    });

    return HangmanKeyboard;
});