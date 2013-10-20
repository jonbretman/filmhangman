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

        /**
         * HangmanGame class.
         * Contains the main logic for the game.
         * @constructor
         */
        var HangmanGame = function () {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
        };

        HangmanGame.prototype = {

            /**
             * Instance of HangmanDrawing.
             * @type {HangmanDrawing}
             * @private
             */
            drawing_: null,

            /**
             * Instance of HangmanKeyboard.
             * @type {HangmanKeyboard}
             * @private
             */
            keyboard_: null,

            /**
             * Instance of HangmanWords.
             * @type {HangmanWords}
             * @private
             */
            words_: null,

            /**
             * Instance of HangmanDialog.
             * @type {HangmanDialog}
             * @private
             */
            dialog_: null,

            /**
             * Instance of HangmanFilms.
             * @type {HangmanFilms}
             * @private
             */
            films_: null,

            /**
             * The start time of the current game..
             * @type {Number}
             * @private
             */
            startTime_: null,

            /**
             * Starts the game.
             */
            start: function () {
                this.getDrawing().appendTo(document.body);
                this.getWords().appendTo(document.body);
                this.getKeyboard().appendTo(document.body).on('letter', this.onGuess_);
                this.getDialog().appendTo(document.body).on('play-again', this.loadNextFilm_);
                this.loadNextFilm_();
            },

            /**
             * Returns the instance of HangmanDrawing
             * @returns {HangmanDrawing}
             */
            getDrawing: function () {
                return this.drawing_ || (this.drawing_ = new Drawing());
            },

            /**
             * Returns the instance of HangmanKeyboard
             * @returns {HangmanKeyboard}
             */
            getKeyboard: function () {
                return this.keyboard_ || (this.keyboard_ = new Keyboard());
            },

            /**
             * Returns the instance of HangmanWords
             * @returns {HangmanWords}
             */
            getWords: function () {
                return this.words_ || (this.words_ = new Words());
            },

            /**
             * Returns the instance of HangmanDialog
             * @returns {HangmanDialog}
             */
            getDialog: function () {
                return this.dialog_ || (this.dialog_ = new Dialog());
            },

            /**
             * Returns the instance of HangmanFilms
             * @returns {HangmanFilms}
             */
            getFilms: function () {
                return this.films_ || (this.films_ = new Films());
            },

            /**
             * Handler for the user making a guess.
             * @param event
             * @param event.letter
             * @private
             */
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

            /**
             * Handler for a part of the hangman drawing finishing.
             * @private
             */
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

            /**
             * Loads the next film into the game.
             * @private
             */
            loadNextFilm_: function () {
                var done = _.after(2, this.enableGame_);
                this.getDialog().hide();
                this.getKeyboard().reset().disable();
                this.getDrawing().drawOutline(done);
                this.getWords().once('ready', done).setWords(this.getFilms().getNext());
            },

            /**
             * Enables the game after the outline has ben drawn and all the letters have animated in.
             * @private
             */
            enableGame_: function () {
                this.startTime_ = new Date().getTime();
                this.getKeyboard().enable();
            }

        };

        return HangmanGame;
    }
);