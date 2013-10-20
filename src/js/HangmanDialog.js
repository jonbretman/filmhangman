define('HangmanDialog', ['DOM', 'Events', 'libs/underscore'], function ($, Events, _) {

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

        backdrop_: null,
        el_: null,
        content_: null,
        playAgainButton_: null,

        wnnersTemplate_: [
            '<h3>Well done!</h3>',
            '<p>You guessed <strong>{{ film }}</strong> in {{ time }}</p>'
        ].join(''),

        losersTemplate_: [
            '<h3>Out of guesses :(</h3>',
            '<p>The correct answer was <strong>{{ film }}</strong></p>'
        ].join(''),

        appendTo: function (el) {
            el.appendChild(this.backdrop_);
            return this;
        },

        show: function (opts) {

            if (!opts) {
                return this;
            }

            if (opts.won) {
                this.content_.innerHTML = this.wnnersTemplate_.replace('{{ film }}', opts.film).replace('{{ time }}', this.formatTime_(opts.time));
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

            this.playAgainButton_.focus();
            return this;
        },

        hide: function () {
            $(this.el_).addClass('hidden');

            $(this.backdrop_).addClass('hidden');
            return this;
        },

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