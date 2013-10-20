define('HangmanWords', ['DOM', 'Events'], function ($, Events) {

    /**
     * HangmanWords class
     * @param words
     * @constructor
     */
    var HangmanWords = function (words) {

        // bind all methods to correct context
        _.bindAll.apply(_, [this].concat(_.functions(this)));

        this.createElement_();

        // if words passed to constructor set them now
        if (words) {
            this.setWords(words);
        }

    };

    HangmanWords.prototype = _.extend(HangmanWords.prototype, Events, {

        /**
         * Main  element.
         */
        el: null,

        /**
         * Current words.
         */
        words_: null,

        /**
         * How many letters are left to guess.
         */
        leftToGuess_: 0,

        /**
         * Appends this view to the element passed.
         * @param el
         * @returns {*}
         */
        appendTo: function (el) {
            el.appendChild(this.el);
            return this;
        },

        /**
         * Creates the root element.
         * @returns {*}
         * @private
         */
        createElement_: function () {
            this.el = document.createElement('div');
            this.el.className = 'hangman-words';
            return this;
        },

        /**
         * Renders the current words and works out how many unique letters are in the word.
         * @returns {*}
         * @private
         */
        renderWords_: function () {

            var letters = [];
            var unique = this.leftToGuess_ = [];
            this.el.innerHTML = '';

            _.each(this.words_, function (word) {

                var container = document.createElement('span');
                container.className = 'hangman-word';

                _.each(word, function (letter) {

                    letter = letter.toUpperCase();

                    var d = document.createElement('span');
                    d.innerText = letter;
                    d.className = 'hangman-letter hidden';
                    letters.push($(d));

                    if (!/[A-Z]/.test(letter)) {
                        d.className += ' non-letter';
                    }
                    else {

                        d.className += ' hangman-letter-' + letter;

                        if (unique.indexOf(letter) === -1) {
                            unique.push(letter);
                        }
                    }

                    container.appendChild(d);
                });

                this.el.appendChild(container);

            }, this);

            // shows the next letter, if all letters are shown calls the callback
            var showNextLetter = _.partial(requestAnimationFrame, _.bind(function () {
                var letter = letters.shift();
                if (!letter) {
                    this.trigger('ready');
                }
                else {
                    letter.removeClass('hidden');
                    setTimeout(showNextLetter, 100);
                }
            }, this));

            showNextLetter();
            return this;
        },

        /**
         * Accepts a string and parses it into a set of words.
         * @param str
         * @returns {*}
         */
        setWords: function (str) {

            this.words_ = _.map(str.split(' '), function (word) {
                return word.split('');
            });

            this.renderWords_();
            return this;
        },

        /**
         * Makes a guess of a letter that might be in the current words.
         * Returns the number of occurences of that letter.
         * @param guess
         * @returns {*}
         */
        makeGuess: function (guess) {

            // if letter is not found in the leftToGuess_ array then incorrect guess
            if (this.leftToGuess_.indexOf(guess) === -1) {
                return 0;
            }

            // remove this letter from leftToGuess_ array
            this.leftToGuess_ = _.without(this.leftToGuess_, guess);

            // find all occurances of this letter and show
            return $(this.el).find('.hangman-letter-' + guess).addClass('guessed').length;
        },

        /**
         * Returns the number of letters left to guess.
         * @returns {Number}
         */
        getLeftToGuess: function () {
            return this.leftToGuess_.length;
        }

    });

    return HangmanWords;
});