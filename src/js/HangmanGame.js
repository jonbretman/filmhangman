define(
    'HangmanGame',
    [
        'HangmanDrawing',
        'HangmanWords',
        'HangmanKeyboard'
    ],
    function (HangmanDrawing, HangmanWords, HangmanKeyboard) {

        var HangmanGame = function () {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        };

        HangmanGame.prototype = {

            drawing_: null,

            keyboard_: null,

            words_: null,

            start: function () {
                this.getDrawing().appendTo(document.body);
                this.getWords().appendTo(document.body);
                this.getKeyboard().appendTo(document.body).on('letter', this.onGuess_);
                this.loadNextWord_();
            },

            getDrawing: function () {
                return this.drawing_ || (this.drawing_ = new HangmanDrawing());
            },

            getKeyboard: function () {
                return this.keyboard_ || (this.keyboard_ = new HangmanKeyboard());
            },

            getWords: function () {
                return this.words_ || (this.words_ = new HangmanWords());
            },

            onGuess_: function (event) {

                this.getKeyboard().disable();
                var occurances = this.getWords().makeGuess(event.letter);

                if (occurances === 0) {
                    this.getKeyboard().setLetterIncorrect(event.letter);
                    this.getDrawing().drawNext(this.onDrawingEnd_);
                    return ;
                }

                this.getKeyboard().setLetterCorrect(event.letter);

                if (this.getWords().getLeftToGuess() === 0) {
                    console.log('Woop!');
                }
                else {
                    this.getKeyboard().enable();
                }

            },

            onDrawingEnd_: function () {

                if (this.getDrawing().isFinished()) {
                    console.log('Game over!');
                }
                else {
                    this.getKeyboard().enable();
                }

            },

            loadNextWord_: function () {
                var done = _.after(2, this.enableGame_);
                this.getKeyboard().disable();
                this.getDrawing().appendTo(document.body).drawOutline(done);
                this.getWords().once('ready', done).setWords('The Green Mile');
            },

            enableGame_: function () {
                this.getKeyboard().enable();
            }
        };

        return HangmanGame;
    }
);