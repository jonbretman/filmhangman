define(
    'HangmanGame',
    [
        'HangmanDrawing',
        'HangmanWords',
        'HangmanKeyboard',
        'HangmanDialog',
        'HangmanFilms'
    ],
    function (Drawing, Words, Keyboard, Dialog, Films) {

        var HangmanGame = function () {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        };

        HangmanGame.prototype = {

            drawing_: null,
            keyboard_: null,
            words_: null,
            dialog_: null,
            films_: null,
            startTime_: null,

            start: function () {
                this.getDrawing().appendTo(document.body);
                this.getWords().appendTo(document.body);
                this.getKeyboard().appendTo(document.body).on('letter', this.onGuess_);
                this.getDialog().appendTo(document.body).on('play-again', this.loadNextWord_);
                this.loadNextWord_();
            },

            getDrawing: function () {
                return this.drawing_ || (this.drawing_ = new Drawing());
            },

            getKeyboard: function () {
                return this.keyboard_ || (this.keyboard_ = new Keyboard());
            },

            getWords: function () {
                return this.words_ || (this.words_ = new Words());
            },

            getDialog: function () {
                return this.dialog_ || (this.dialog_ = new Dialog());
            },

            getFilms: function () {
                return this.films_ || (this.films_ = new Films());
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
                    this.getDialog().show({
                        film: this.getFilms().getCurrent(),
                        time: new Date().getTime() - this.startTime_,
                        won: true
                    });
                }
                else {
                    this.getKeyboard().enable();
                }

            },

            onDrawingEnd_: function () {

                if (this.getDrawing().isFinished()) {
                    this.getDialog().show({
                        film: this.getFilms().getCurrent(),
                        time: new Date().getTime() - this.startTime_,
                        won: false
                    });
                }
                else {
                    this.getKeyboard().enable();
                }

            },

            loadNextWord_: function () {
                var done = _.after(2, this.enableGame_);
                this.getDialog().hide();
                this.getKeyboard().reset().disable();
                this.getDrawing().drawOutline(done);
                this.getWords().once('ready', done).setWords(this.getFilms().getNext());
            },

            enableGame_: function () {
                this.startTime_ = new Date().getTime();
                this.getKeyboard().enable();
            }

        };

        return HangmanGame;
    }
);