define('HangmanWords', ['DOM', 'Events'], function ($, Events) {

    var HangmanWords = function (words) {
        _.bindAll.apply(_, [this].concat(_.functions(this)));

        this.createElement_();

        if (words) {
            this.setWords(words);
        }

    };

    HangmanWords.prototype = _.extend(HangmanWords.prototype, Events, {

        el: null,

        words_: null,

        leftToGuess_: 0,

        appendTo: function (el) {
            el.appendChild(this.el);
            return this;
        },

        createElement_: function () {
            this.el = document.createElement('div');
            this.el.className = 'hangman-words';
            return this;
        },

        renderWords_: function () {

            var letters = [];
            var unique = this.leftToGuess_ = [];

            _.each(this.words_, function (word) {

                var container = document.createElement('span');
                container.className = 'hangman-word';

                _.each(word, function (letter) {
                    letter = letter.toUpperCase();
                    var d = document.createElement('span');
                    d.innerText = letter;
                    d.className = 'hangman-letter hidden hangman-letter-' + letter;
                    container.appendChild(d);
                    letters.push($(d));

                    if (unique.indexOf(letter) === -1) {
                        unique.push(letter);
                    }

                });

                this.el.appendChild(container);

            }, this);

            var showNextLetter = _.bind(function () {
                var letter = letters.shift();
                if (!letter) {
                    this.trigger('ready');
                }
                else {
                    letter.removeClass('hidden');
                    setTimeout(showNextLetter, 150);
                }
            }, this);

            showNextLetter();

            return this;
        },

        setWords: function (words) {

            this.words_ = _.map(words.split(' '), function (word) {
                return word.split('');
            });

            this.renderWords_();
            return this;
        },

        makeGuess: function (guess) {

            if (this.leftToGuess_.indexOf(guess) === -1) {
                return 0;
            }

            this.leftToGuess_ = _.without(this.leftToGuess_, guess);
            return $(this.el).find('.hangman-letter-' + guess).addClass('guessed').length;
        },

        getLeftToGuess: function () {
            return this.leftToGuess_.length;
        }

    });

    return HangmanWords;
});