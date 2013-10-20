define('HangmanFilms', function () {

    /**
     * Detects support for localStorage
     */
    var hasLocalStorage = (function () {

        if (!window.localStorage) {
            return false;
        }

        try {
            localStorage.setItem('foo', 'bar');
            return localStorage.getItem('foo') === 'bar';
        }
        catch (e) {
            return false;
        }

    })();

    /**
     * HangmanFilms class
     * @constructor
     */
    var HangmanFilms = function () {
        this.load_();
    };

    HangmanFilms.prototype = {

        /**
         * Array to hold films that have been played.
         */
        completed_: [],

        /**
         * Array holding films yet to be played.
         */
        films_: [
            'Unbreakable',
            'The Green Mile',
            'Saving Private Ryan',
            'Ghostbusters',
            'Sin City',
            'Captain America',
            'Avengers Assemble',
            'Schindlers List',
            'The Boy in the Striped Pyjamas'
        ],

        /**
         * The current film.
         */
        currentFilm_: null,

        /**
         * Load the films_ and completed_ arrays from localStorage
         * @private
         */
        load_: function () {

            if (hasLocalStorage) {
                try {
                    var data = JSON.parse(localStorage.getItem('hangman_films'));
                    this.completed_ = data.completed;
                    this.films_ = data.films;
                }
                catch (e) {
                }
            }

        },

        /**
         * Save the films_ and completed_ arrays to localStorage
         * @private
         */
        save_: function () {

            if (hasLocalStorage) {
                localStorage.setItem('hangman_films', JSON.stringify({
                    films: this.films_,
                    completed: this.completed_
                }));
            }

        },

        /**
         * Returns the current film.
         * @returns {String}
         */
        getCurrent: function () {
            return this.films_[this.films_.length - 1];
        },

        /**
         * Returns the next film from the films_ queue.
         * If all films have been played the completed_ and films_ arrays are swapped.
         * @returns {String}
         */
        getNext: function () {

            // if there is a current film add it to the completed list
            if (this.currentFilm_) {
                this.completed_.unshift(this.films_.pop());
                this.save_();
            }
            // if we've run out of films swap the lists
            if (this.films_.length === 0) {
                this.films_ = this.completed_;
                this.completed_ = [];
            }

            // return the film at the end of the list
            this.currentFilm_ = this.films_[this.films_.length - 1];
            return this.currentFilm_;
        }

    };

    return HangmanFilms;
});