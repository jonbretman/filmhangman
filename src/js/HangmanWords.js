define('HangmanPhrase', function () {

    var HangmanPhrase = function (phrase) {
        _.bindAll.apply(_, [this].concat(_.functions(this)));



        this.createElement_();
    };

    HangmanPhrase.prototype = {

        el: null,

        phrase: null,

        appendTo: function (el) {
            el.appendChild(this.el);
            return this;
        },

        createElement_: function () {

            this.el = document.createElement('div');
            this.el.className = 'hangman-phrase';

            _.each(this.phrase, function (word) {

                var container = document.createElement('span');
                container.className = 'hangman-word';

                _.each(word, function (letter) {
                    var d = document.createElement('span');
                    d.innerText = letter;
                    d.className = 'hangman-letter';
                    container.appendChild(d);
                });

                this.el.appendChild(container);

            }, this);
        },

        setPhrase: function (phrase) {
            this.phrase = _.map(phrase.split(' '), function (word) {
                return word.split('');
            });
        }

    };

    return HangmanPhrase;
});