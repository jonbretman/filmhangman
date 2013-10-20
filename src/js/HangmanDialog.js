define('HangmanDialog', ['DOM', 'Events', 'libs/underscore'], function ($, Events, _) {

    /**
     * HangmanDialog class
     * @constructor
     */
    var HangmanDialog = function () {
        _.bindAll.apply(_, [this].concat(_.functions(this)));

        this.el_ = document.createElement('div');
        this.el_.id = 'hangman-dialog';
        this.el_.className = 'hidden';

        this.content_ = document.createElement('div');
        this.el_.appendChild(this.content_);

        var playAgainButton = this.playAgainButton_ = document.createElement('input');
        playAgainButton.type = 'submit';
        playAgainButton.id = 'hangman-play-again-button';
        playAgainButton.innerHTML = 'Play Again';
        this.el_.appendChild(playAgainButton);

        this.backdrop_ = document.createElement('div');
        this.backdrop_.id = 'hangman-dialog-backdrop';
        this.backdrop_.className = 'hidden';
        this.backdrop_.appendChild(this.el_);

        playAgainButton.addEventListener('click', _.partial(this.trigger, 'play-again'));
    };

    HangmanDialog.prototype = _.extend(HangmanDialog.prototype, Events, {

        /**
         * The backdrop element
         * @type {HTMLElement}
         * @private
         */
        backdrop_: null,

        /**
         * The main dialog element
         * @type {HTMLElement}
         * @private
         */
        el_: null,

        /**
         * The dialog content element
         * @type {HTMLElement}
         * @private
         */
        content_: null,

        /**
         * The play again element
         * @type {HTMLElement}
         * @private
         */
        playAgainButton_: null,

        /**
         * Template for the dialog shown when user correctly guesses the film.
         * @type {String}
         * @private
         */
        winnersTemplate_: [
            '<h3>Well done!</h3>',
            '<p>You guessed <strong>{{ film }}</strong> in {{ time }}.</p>'
        ].join(''),

        /**
         * Template for the dialog shown when user runs out of guesses.
         * @type {String}
         * @private
         */
        losersTemplate_: [
            '<h3>Out of guesses :(</h3>',
            '<p>The correct answer was <strong>{{ film }}</strong>.</p>'
        ].join(''),

        /**
         * Append this View to the element passes.
         * @param {HTMLElement} el
         * @returns {HangmanDialog}
         */
        appendTo: function (el) {
            el.appendChild(this.backdrop_);
            return this;
        },

        /**
         * Shows the dialog.
         * @param {Object} opts
         * @param {boolean} opts.won True if the user successfully guessed the film.
         * @param {String} opts.film The film the user was trying to guess.
         * @param {Number} [opts.time] The time it took the user to guess the film.
         * @returns {HangmanDialog}
         */
        show: function (opts) {

            if (!opts) {
                return this;
            }

            if (opts.won) {
                this.content_.innerHTML = this.winnersTemplate_.replace('{{ film }}', opts.film).replace('{{ time }}', this.formatTime_(opts.time));
            }
            else {
                this.content_.innerHTML = this.losersTemplate_.replace('{{ film }}', opts.film);
            }

            // show the backdrop
            $(this.backdrop_).removeClass('hidden');

            // force a reflow
            var forceReflow = this.backdrop_.offsetLeft;

            // animate the dialog
            $(this.el_).removeClass('hidden');
            return this;
        },

        /**
         * Hides the dialog.
         * @returns {HangmanDialog}
         */
        hide: function () {
            $(this.el_).addClass('hidden');

            $(this.backdrop_).addClass('hidden');
            return this;
        },

        /**
         * Formats milliseconds into a human readable string representing how long it took the user to took the film.
         * @param {Number} ms
         * @returns {string}
         * @private
         */
        formatTime_: function (ms) {
            var result = [];
            if (ms > 60000) {
                result.push(Math.floor(ms / 60000) + ' minutes');
                ms = ms % 60000;
            }
            if (ms > 1000) {
                result.push(Math.floor(ms / 1000) + ' seconds');
            }
            return result.length ? result.join(' and ') : 'lightening speed!';
        }

    });

    return HangmanDialog;

});