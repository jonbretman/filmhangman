define('HangmanKeyboard', ['Events'], function (Events) {

    var querty = [
        ['q','w','e','r','t','y','u','i','o','p'],
         ['a','s','d','f','g','h','j','k','l'],
            ['z','x','c','v','b','n','m']
    ];

    var hasTouch = 'ontouchstart' in window;
    var startEvent = hasTouch ? 'touchstart' : 'mousedown';
    var endEvent = hasTouch ? 'touchend' : 'mouseup';

    var HangmanKeyboard = function () {
        _.bindAll.apply(_, [this].concat(_.functions(this)));

        this.el = document.createElement('div');
        this.el.className = 'hangman-keyboard';

        _.each(querty, function (row) {
            var container = document.createElement('div');
            container.className = 'hangman-keyboard-row';
            _.each(row, function (key) {
                var el = document.createElement('span');
                el.className = 'hangman-keyboard-key';
                el.innerHTML = key.toUpperCase();
                container.appendChild(el);
            });
            this.el.appendChild(container);
        }, this);

        document.addEventListener('keyup', this.onKeyup_, false);
        this.el.addEventListener(startEvent, this.onTouchStart_, false);
        this.el.addEventListener(endEvent, this.onTouchEnd_, false);


    };

    HangmanKeyboard.prototype = _.extend(HangmanKeyboard.prototype, Events, {

        currentlyTouchedKey_: null,

        appendTo: function (el) {
            el.appendChild(this.el);
        },

        onKeyup_: function (e) {

            var code = e.keyCode;

            if (code < 65 || code > 90) {
                return true;
            }

            var letter = String.fromCharCode(e.keyCode).toUpperCase();

            this.trigger('letter', {
                letter: letter
            });
            return true;
        },

        onTouchStart_: function (e) {

            if (this.currentlyTouchedKey_) {
                this.currentlyTouchedKey_.className = 'hangman-keyboard-key';
            }

            var target = e.target;
            if (!target || target.className.indexOf('hangman-keyboard-key') === -1) {
                this.currentlyTouchedKey_ = null;
                return true;
            }

            this.currentlyTouchedKey_ = target;
            target.className += ' selected';

            if (!hasTouch) {
                target.addEventListener('mouseout', function handler () {
                    target.className = 'hangman-keyboard-key';
                    target.removeEventListener('mouseout', handler, false);
                }, false);
            }
            return true;
        },

        onTouchEnd_: function (e) {

            if (this.currentlyTouchedKey_) {
                this.currentlyTouchedKey_.className = 'hangman-keyboard-key';
            }

            var target = e.target;
            if (!target || target.className.indexOf('hangman-keyboard-key') === -1) {
                this.currentlyTouchedKey_ = null;
                return true;
            }

            if (target !== this.currentlyTouchedKey_) {
                return true;
            }

            this.trigger('letter', {
                letter: target.innerHTML
            });
            return true;
        }

    });

    return HangmanKeyboard;
});